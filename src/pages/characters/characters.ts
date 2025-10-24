import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
// Importa operadores reativos do RxJS
import { debounceTime, distinctUntilChanged, switchMap, tap } from 'rxjs/operators';
// Importa modelos e o serviço
import { CharacterAttributes, PotterDbData } from '../../models/character.model';
import { PotterdbApi } from '../../services/potterdb-api';

// 1. IMPORTE O NOVO COMPONENTE
import { CharacterCard } from '../../components/character-card/character-card';

/**
 * Componente da página de Personagens.
 * Gerencia dois estados:
 * 1. A exibição da lista curada de personagens principais.
 * 2. A exibição dos resultados de uma busca em tempo real.
 */
@Component({
  selector: 'app-characters',
  standalone: true,
  imports: [
    CommonModule,         // Para diretivas *ngIf, *ngFor
    ReactiveFormsModule,  // Para a barra de busca [formControl]
    CharacterCard         // 2. ADICIONE O NOVO COMPONENTE AOS IMPORTS
  ],
  templateUrl: './characters.html',
  styleUrl: './characters.scss'
})
export class Characters implements OnInit {

  // --- Propriedades de Estado ---
  /** Controla a exibição do spinner de carregamento */
  public isLoading = true;
  /** Armazena a mensagem de erro, se houver */
  public error: string | null = null;
  /** Flag que controla qual view mostrar: 'true' (busca) ou 'false' (lista curada) */
  public isSearching = false; 
  
  /** Controle do Angular Forms para a barra de busca */
  public searchControl = new FormControl('');
  
  // --- Fontes de Dados ---
  /** Armazena a lista curada de 12 personagens (do 'forkJoin') */
  public initialCharacters: PotterDbData<CharacterAttributes>[] = [];
  /** Armazena os resultados da API de busca */
  public searchedCharacters: PotterDbData<CharacterAttributes>[] = [];

  constructor(private potterdbApi: PotterdbApi) {}

  /**
   * Lifecycle Hook do Angular. Chamado quando o componente é inicializado.
   */
  ngOnInit(): void {
    // Carrega a lista curada ao iniciar a página
    this.loadInitialCharacters();
    // Inicia o "ouvinte" da barra de busca
    this.setupSearchListener();
  }

  /**
   * Busca a lista curada (via forkJoin) do serviço.
   */
  loadInitialCharacters(): void {
    this.isLoading = true;
    this.error = null;
    this.isSearching = false; // Garante que estamos na visão inicial

    this.potterdbApi.getImportantCharacters().subscribe({
      next: (charactersArray) => {
        // O 'getImportantCharacters' já retorna o array "limpo"
        this.initialCharacters = charactersArray;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Falha ao carregar um ou mais personagens principais.';
        this.isLoading = false;
        console.error(err);
      }
    });
  }

  /**
   * Configura a barra de busca para chamar a API (que agora filtra imagens).
   * Usa um "pipe" reativo do RxJS para otimizar as chamadas.
   */
  setupSearchListener(): void {
    // 'valueChanges' é um Observable que emite o valor do input toda vez que ele muda
    this.searchControl.valueChanges.pipe(
      // 'debounceTime': Aguarda 300ms após o usuário PARAR de digitar
      debounceTime(300),
      
      // 'distinctUntilChanged': Só emite se o novo valor for DIFERENTE do anterior
      distinctUntilChanged(),
      
      // 'tap': "Toca" no fluxo para executar uma ação (mudar o estado)
      tap(term => {
        if (term) {
          // Se há um termo, ativa o modo de busca e o loading
          this.isSearching = true;
          this.isLoading = true;
          this.error = null;
        } else {
          // Se o termo for apagado, volta ao modo inicial (lista curada)
          this.isSearching = false;
          this.isLoading = false;
          this.error = null;
          this.searchedCharacters = []; // Limpa a busca anterior
        }
      }),
      
      // 'switchMap': Cancela a chamada de API anterior e "troca" para uma nova
      switchMap(term => {
        if (term) {
          // Se houver termo, chama a API de busca
          return this.potterdbApi.searchCharacters(term);
        } else {
          // Se o termo for vazio, retorna um Observable vazio (não faz chamada)
          return []; 
        }
      })
    ).subscribe({
      next: (response) => {
        // Verifica se estamos no modo de busca e se a resposta tem dados
        if (this.isSearching && response.data) {
          // A API já filtrou os resultados sem imagem
          this.searchedCharacters = response.data;
        }
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Falha ao realizar a busca na API.';
        this.isLoading = false;
        console.error(err);
      }
    });
  }
}