import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { finalize } from 'rxjs/operators';
// Modelos de dados e Serviço da API
import { CharacterAttributes, PotterDbData } from '../../models/character.model';
import { PotterdbApi } from '../../services/potterdb-api';

/**
 * Componente responsável por exibir os detalhes completos de um único personagem.
 * Busca os dados com base no ID ou Slug presente na URL da rota.
 */
@Component({
  selector: 'app-character-detail', // Seletor CSS do componente
  standalone: true, // Indica que é um componente standalone
  imports: [
    CommonModule, // Fornece diretivas como *ngIf, *ngFor
    RouterLink, // Habilita a diretiva routerLink no template
  ],
  templateUrl: './character-detail.html', // Arquivo HTML do template
  styleUrl: './character-detail.scss', // Arquivo SASS dos estilos
})
export class CharacterDetail implements OnInit {
  // Implementa OnInit para lógica de inicialização

  // --- Estado da UI ---
  public isLoading = true; // Controla exibição do spinner de carregamento
  public error: string | null = null; // Armazena mensagens de erro

  // --- Dados ---
  /** Armazena os dados do personagem buscado na API. */
  public character: PotterDbData<CharacterAttributes> | null = null;

  /**
   * Injeta dependências: ActivatedRoute para ler parâmetros da URL
   * e PotterdbApi para buscar dados.
   */
  constructor(private route: ActivatedRoute, private potterdbApi: PotterdbApi) {}

  /**
   * Método do ciclo de vida Angular: Executado ao inicializar o componente.
   * Obtém o ID/Slug da URL e inicia o carregamento dos dados.
   */
  ngOnInit(): void {
    // Pega o parâmetro 'id' da URL (pode ser UUID ou Slug)
    const idOrSlug = this.route.snapshot.paramMap.get('id');

    if (idOrSlug) {
      this.loadCharacterDetails(idOrSlug); // Chama a função de carregamento
    } else {
      // Define erro se o ID/Slug não for encontrado na URL
      this.error = 'ID ou Slug do personagem não encontrado na URL.';
      this.isLoading = false;
    }
  }

  /**
   * Busca os detalhes do personagem na API usando o ID ou Slug fornecido.
   * Gerencia os estados de carregamento e erro.
   * @param idOrSlug Identificador (UUID ou Slug) do personagem.
   */
  loadCharacterDetails(idOrSlug: string): void {
    this.isLoading = true; // Ativa loading
    this.error = null; // Limpa erros anteriores
    this.character = null; // Limpa dados anteriores

    this.potterdbApi
      .getCharacterByIdOrSlug(idOrSlug) // Chama o método do serviço
      .pipe(
        // Garante que o loading seja desativado ao final (sucesso ou erro)
        finalize(() => (this.isLoading = false))
      )
      .subscribe({
        // Se inscreve para receber o resultado
        // Callback de sucesso
        next: (characterData: PotterDbData<CharacterAttributes>) => {
          this.character = characterData; // Armazena os dados recebidos
        },
        // Callback de erro
        error: (err: HttpErrorResponse | any) => {
          // Define mensagem de erro específica para 404 (Não Encontrado)
          if (err.status === 404) {
            this.error = `Personagem com ID/Slug "${idOrSlug}" não encontrado.`;
          } else {
            // Mensagem genérica para outros erros
            this.error = 'Falha ao carregar os detalhes do personagem.';
          }
        },
      });
  }
}
