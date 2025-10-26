import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core'; // Importa HostListener
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, finalize, switchMap, tap } from 'rxjs/operators';
// Modelos, Serviço, Card
import { PotionCard } from '../../components/potion-card/potion-card';
import { PotterDbData } from '../../models/character.model'; // Importa PotterDbMeta para paginação
import { PotionAttributes } from '../../models/potion.model';
import { PotterdbApi } from '../../services/potterdb-api';

/**
 * Componente da página de Poções.
 * Exibe lista curada, lista paginada com scroll infinito e permite busca.
 */
@Component({
  selector: 'app-potions',
  standalone: true,
  imports: [ CommonModule, ReactiveFormsModule, PotionCard ],
  templateUrl: './potions.html',
  styleUrl: './potions.scss' // Crie este arquivo se precisar
})
export class Potions implements OnInit {

  // --- Estado da UI ---
  public isLoadingInitial = true; // Loading da carga inicial (populares + 1ª página)
  public isLoadingMore = false;   // Loading ao carregar mais itens no scroll
  public error: string | null = null;
  public isSearching = false;     // Controla se a view é de busca

  public searchControl = new FormControl('');

  // --- Dados ---
  /** Lista inicial curada de poções populares. */
  public popularPotions: PotterDbData<PotionAttributes>[] = [];
  /** Lista principal que acumula todas as poções carregadas (paginadas ou busca). */
  public allPotions: PotterDbData<PotionAttributes>[] = [];

  // --- Paginação ---
  private currentPage = 1;
  private totalPages = 1; // Será atualizado pela API
  private readonly pageSize = 20; // Quantos itens carregar por vez

  constructor(private potterdbApi: PotterdbApi) {}

  ngOnInit(): void {
    this.loadInitialData();     // Carrega populares + 1ª página
    this.setupSearchListener(); // Configura a busca
  }

  /**
   * Carrega os dados iniciais: Poções populares e a primeira página da lista completa.
   */
  loadInitialData(): void {
    this.isLoadingInitial = true;
    this.error = null;
    this.isSearching = false;
    this.currentPage = 1; // Reseta a página
    this.allPotions = []; // Limpa a lista principal

    // Busca as poções populares (forkJoin)
    this.potterdbApi.getImportantPotions().subscribe({
      next: (potionsArray) => {
        this.popularPotions = potionsArray;
        // Não desliga o isLoadingInitial ainda, espera a primeira página carregar
      },
      error: (_err) => {
        // Erro ao carregar populares não impede carregar a lista principal
        this.error = 'Falha ao carregar poções populares.';
      }
    });

    // Busca a primeira página da lista completa
    this.loadPotionsPage(this.currentPage);
  }

  /**
   * Busca uma página específica de poções (ou resultados de busca).
   * @param page Número da página a buscar.
   * @param searchTerm Termo de busca (opcional).
   */
  loadPotionsPage(page: number, searchTerm: string = ''): void {
    // Define o estado de loading apropriado (inicial ou 'carregando mais')
    if (page === 1 && !searchTerm) {
       this.isLoadingInitial = true; // Carga inicial completa
    } else if (!searchTerm) { // Apenas se não for busca
       this.isLoadingMore = true;   // Carregando mais no scroll
    } else { // Se for busca
        this.isLoadingInitial = true; // Mostra spinner principal na busca
    }
    this.error = null; // Limpa erros

    this.potterdbApi.searchPotions(searchTerm, page, this.pageSize)
      .pipe(
        // finalize() é executado sempre que o Observable completa (sucesso ou erro)
        finalize(() => {
          this.isLoadingInitial = false;
          this.isLoadingMore = false;
        })
      )
      .subscribe({
        next: (response) => {
          if (response && response.data) {
            // Se for a primeira página (busca ou inicial), substitui a lista
            if (page === 1) {
              this.allPotions = response.data;
            } else {
              // Senão (scroll), anexa os novos resultados à lista existente
              this.allPotions = [...this.allPotions, ...response.data];
            }
            // Atualiza informações de paginação
            this.totalPages = response.meta?.pagination?.last ?? this.currentPage;
            this.currentPage = response.meta?.pagination?.current ?? this.currentPage;

             // Define erro se a busca ativa não encontrar nada na primeira página
             if (searchTerm && page === 1 && this.allPotions.length === 0) {
                this.error = `Nenhuma poção encontrada para "${searchTerm}".`;
             }

          } else if (searchTerm && page === 1) {
             // Caso a busca inicial não retorne dados
             this.allPotions = [];
             this.error = `Nenhuma poção encontrada para "${searchTerm}".`;
          }
        },
        error: (_err) => {
          this.error = 'Falha ao carregar poções.';
        }
      });
  }

  /**
   * Configura o listener da barra de busca.
   * Ao buscar, reseta a paginação e carrega a primeira página de resultados.
   */
  setupSearchListener(): void {
    this.searchControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      tap(term => { // Atualiza estado da UI
        this.isSearching = !!term;
        this.isLoadingInitial = true; // Mostra spinner principal para busca
        this.isLoadingMore = false;
        this.error = null;
        this.currentPage = 1; // Reseta paginação para nova busca
        this.allPotions = []; // Limpa lista anterior
      }),
      // Chama a função que carrega a página (sempre página 1 para busca)
      switchMap(term => {
         // Não chama a API diretamente, chama o método que já trata loading/erro
         this.loadPotionsPage(1, term || '');
         return []; // Retorna Observable vazio pois loadPotionsPage já faz a chamada
      })
    ).subscribe(); // Apenas se inscreve para ativar o pipe
  }

  /**
   * Método chamado pelo HostListener quando o usuário rola a janela.
   * Carrega a próxima página se o usuário chegar perto do final e houver mais páginas.
   */
  loadMorePotions(): void {
    // Só carrega mais se:
    // 1. Não estiver carregando nada no momento (inicial ou 'more')
    // 2. Não estiver no modo de busca (scroll infinito só na lista completa)
    // 3. Ainda houver páginas para carregar
    if (!this.isLoadingInitial && !this.isLoadingMore && !this.isSearching && this.currentPage < this.totalPages) {
      const nextPage = this.currentPage + 1;
      this.loadPotionsPage(nextPage); // Carrega a próxima página da lista completa
    }
  }

  /**
   * @HostListener: Escuta o evento 'scroll' no objeto 'window'.
   * Verifica se o usuário chegou perto do final da página para carregar mais.
   * @param event - O objeto do evento de scroll (necessário por causa do ['$event'])
   */
  @HostListener('window:scroll', ['$event'])
  onWindowScroll(event: Event): void {
    const threshold = 100;
    const position = window.innerHeight + window.scrollY;
    const height = document.body.offsetHeight;

    if (position >= height - threshold) {
      this.loadMorePotions();
    }
  }
}