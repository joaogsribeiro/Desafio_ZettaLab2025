import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, switchMap, tap } from 'rxjs/operators';
import { CharacterCard } from '../../components/character-card/character-card';
import { CharacterAttributes, PotterDbData } from '../../models/character.model';
import { PotterdbApi } from '../../services/potterdb-api';

/**
 * Componente da página de Personagens.
 * Exibe lista curada inicial e permite busca em tempo real.
 */
@Component({
  selector: 'app-characters',
  standalone: true,
  imports: [ CommonModule, ReactiveFormsModule, CharacterCard ],
  templateUrl: './characters.html',
  styleUrl: './characters.scss'
})
export class Characters implements OnInit {

  // --- Estado da UI ---
  public isLoading = true;
  public error: string | null = null;
  public isSearching = false; // Controla qual lista exibir (inicial ou busca)

  public searchControl = new FormControl(''); // Controle do input de busca

  // --- Dados ---
  public initialCharacters: PotterDbData<CharacterAttributes>[] = []; // Lista curada
  public searchedCharacters: PotterDbData<CharacterAttributes>[] = []; // Resultados da busca

  constructor(private potterdbApi: PotterdbApi) {} // Injeção do serviço API

  ngOnInit(): void {
    this.loadInitialCharacters(); // Carrega dados iniciais
    this.setupSearchListener();  // Configura reatividade da busca
  }

  /**
   * Busca a lista curada de personagens via `forkJoin`.
   */
  loadInitialCharacters(): void {
    this.isLoading = true;
    this.error = null;
    this.isSearching = false;

    this.potterdbApi.getImportantCharacters().subscribe({
      next: (charactersArray) => {
        this.initialCharacters = charactersArray;
        this.isLoading = false;
      },
      error: (_err) => {
        this.error = 'Falha ao carregar personagens principais.';
        this.isLoading = false;
      }
    });
  }

  /**
   * Configura o Observable da barra de busca com operadores RxJS
   * para otimizar chamadas e tratar erros de busca vazia.
   */
  setupSearchListener(): void {
    this.searchControl.valueChanges.pipe(
      debounceTime(300), // Evita chamadas excessivas durante digitação
      distinctUntilChanged(), // Ignora buscas repetidas
      tap(term => { // Atualiza estado da UI antes da chamada
        this.isSearching = !!term;
        this.isLoading = !!term;
        this.error = null; // Limpa erro anterior
        if (!term) this.searchedCharacters = []; // Limpa resultados se busca vazia
      }),
      // Chama a API de busca se houver termo, senão retorna Observable vazio
      switchMap(term => (term ? this.potterdbApi.searchCharacters(term) : []))
    ).subscribe({
      next: (response) => {
        // Atualiza resultados apenas se estiver buscando e houver dados
        if (this.isSearching && response.data) {
          this.searchedCharacters = response.data;
        } else if (this.isSearching) {
           this.searchedCharacters = []; // Garante lista vazia se resposta inesperada
        }

        // Define erro específico se a busca ativa não encontrar resultados
        if (this.isSearching && this.searchedCharacters.length === 0 && this.searchControl.value) {
           this.error = `Nenhum personagem encontrado para "${this.searchControl.value}".`;
        }
        this.isLoading = false; // Desativa loading após processar
      },
      error: (_err) => { // Tratamento de erro geral da API
        this.error = 'Falha ao realizar a busca na API.';
        this.isLoading = false;
      }
    });
  }
}