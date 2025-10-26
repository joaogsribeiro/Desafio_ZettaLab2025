import { CommonModule } from '@angular/common'; // Para *ngIf
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router'; // Importa ActivatedRoute e RouterLink
// Modelos e Serviço
import { finalize } from 'rxjs/operators'; // Para gerenciar loading
import { CharacterAttributes, PotterDbData } from '../../models/character.model';
import { PotterdbApi } from '../../services/potterdb-api';

/**
 * Componente da página de Detalhes do Personagem.
 * Exibe informações completas de um único personagem buscado por ID/Slug.
 */
@Component({
  selector: 'app-character-detail',
  standalone: true,
  imports: [
    CommonModule, // Para *ngIf, *ngFor
    RouterLink    // Para possíveis links (ex: voltar)
  ],
  templateUrl: './character-detail.html',
  styleUrl: './character-detail.scss' // Crie se precisar de estilos
})
export class CharacterDetail implements OnInit {

  // --- Estado da UI ---
  public isLoading = true; // Começa carregando
  public error: string | null = null; // Mensagem de erro

  // --- Dados ---
  /** Armazena os dados do personagem carregado. */
  public character: PotterDbData<CharacterAttributes> | null = null;

  /**
   * @constructor
   * @param route Usado para obter o ID/Slug da URL.
   * @param potterdbApi Serviço para buscar os dados da API.
   */
  constructor(
    private route: ActivatedRoute,
    private potterdbApi: PotterdbApi
  ) {}

  /**
   * Método do ciclo de vida: Executa na inicialização.
   * Obtém o ID/Slug da rota e chama a API.
   */
  ngOnInit(): void {
    // Tenta obter o parâmetro 'id' da URL (pode ser UUID ou Slug)
    const idOrSlug = this.route.snapshot.paramMap.get('id');

    if (idOrSlug) {
      this.loadCharacterDetails(idOrSlug);
    } else {
      // Caso a rota seja acessada sem um ID/Slug válido
      this.error = 'ID ou Slug do personagem não encontrado na URL.';
      this.isLoading = false;
      console.error('ID/Slug ausente nos parâmetros da rota.');
    }
  }

  /**
   * Busca os detalhes de um personagem específico usando o serviço da API.
   * @param idOrSlug O ID (UUID) ou Slug do personagem a ser buscado.
   */
  loadCharacterDetails(idOrSlug: string): void {
    this.isLoading = true;
    this.error = null;
    this.character = null; // Limpa dados anteriores

    this.potterdbApi.getCharacterByIdOrSlug(idOrSlug)
      .pipe(
        // finalize garante que isLoading será false ao final (sucesso ou erro)
        finalize(() => this.isLoading = false)
      )
      .subscribe({
        // O método já retorna PotterDbData<CharacterAttributes> "desembrulhado"
        next: (characterData: PotterDbData<CharacterAttributes>) => {
          this.character = characterData; // Armazena os dados do personagem
        },
        error: (err: HttpErrorResponse | any) => {
          if (err.status === 404) {
            this.error = `Personagem com ID/Slug "${idOrSlug}" não encontrado.`;
          } else {
            this.error = 'Falha ao carregar os detalhes do personagem.';
          }
          console.error(`Erro ao buscar personagem ${idOrSlug}:`, err.message || err);
        }
      });
  }
}