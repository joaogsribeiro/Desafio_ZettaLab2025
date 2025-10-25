import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, switchMap, tap } from 'rxjs/operators'; // Operadores RxJS
import { CharacterAttributes, PotterDbData } from '../../models/character.model'; // Modelos
import { PotterdbApi } from '../../services/potterdb-api'; // Serviço API
import { CharacterCard } from '../../components/character-card/character-card'; // Componente Card

/**
 * Componente da página de Personagens.
 * Exibe uma lista curada inicial e permite busca em tempo real na API.
 */
@Component({
  selector: 'app-characters',
  standalone: true,
  imports: [ CommonModule, ReactiveFormsModule, CharacterCard ], // Módulos e Componentes necessários
  templateUrl: './characters.html',
  styleUrl: './characters.scss'
})
export class Characters implements OnInit {

  // --- Estado da UI ---
  public isLoading = true; // Controla o spinner
  public error: string | null = null; // Mensagem de erro
  public isSearching = false; // Controla qual lista exibir (inicial ou busca)
  
  /** FormControl para o input de busca. */
  public searchControl = new FormControl('');
  
  // --- Dados ---
  /** Lista inicial de personagens principais. */
  public initialCharacters: PotterDbData<CharacterAttributes>[] = [];
  /** Lista de resultados da busca na API. */
  public searchedCharacters: PotterDbData<CharacterAttributes>[] = [];

  constructor(private potterdbApi: PotterdbApi) {} // Injeção do serviço da API

  /**
   * Método do ciclo de vida: Executa na inicialização do componente.
   */
  ngOnInit(): void {
    this.loadInitialCharacters(); // Carrega a lista inicial
    this.setupSearchListener();  // Configura a barra de busca
  }

  /**
   * Busca a lista curada de personagens via `forkJoin` no serviço.
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
      error: (err) => {
        this.error = 'Falha ao carregar personagens principais.';
        this.isLoading = false;
        console.error('Erro loadInitialCharacters:', err);
      }
    });
  }

  /**
   * Configura o Observable da barra de busca com operadores RxJS
   * para otimizar as chamadas à API (`debounceTime`, `distinctUntilChanged`, `switchMap`).
   */
  setupSearchListener(): void {
    this.searchControl.valueChanges.pipe(
      debounceTime(300), // Aguarda 300ms após parar de digitar
      distinctUntilChanged(), // Ignora se o valor não mudou
      tap(term => { // Efeito colateral para atualizar estado da UI
        this.isSearching = !!term; // Define isSearching baseado na existência de 'term'
        this.isLoading = !!term; // Ativa loading se houver termo
        this.error = null;
        if (!term) this.searchedCharacters = []; // Limpa busca se termo vazio
      }),
      switchMap(term => (term ? this.potterdbApi.searchCharacters(term) : [])) // Chama API ou retorna vazio
    ).subscribe({
      next: (response) => {
        if (this.isSearching && response.data) {
          this.searchedCharacters = response.data; // Atualiza resultados da busca
        }
        this.isLoading = false; // Desativa loading
      },
      error: (err) => {
        this.error = 'Falha ao realizar a busca na API.';
        this.isLoading = false;
        console.error('Erro setupSearchListener:', err);
      }
    });
  }
}