import { CommonModule } from '@angular/common'; // Importa CommonModule e DatePipe
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
// Modelos, Serviço, Card
import { MovieCard } from '../../components/movie-card/movie-card'; // Importa o MovieCard
import { PotterDbData, PotterDbResponse } from '../../models/character.model'; // Modelo genérico
import { MovieAttributes } from '../../models/movie.model'; // Modelo específico
import { PotterdbApi } from '../../services/potterdb-api';

/**
 * Componente da página de Filmes.
 * Exibe uma lista de todos os filmes da franquia.
 */
@Component({
  selector: 'app-movies',
  standalone: true,
  imports: [
    CommonModule, // Para *ngIf, *ngFor
    MovieCard,    // Para usar <app-movie-card>
  ],
  templateUrl: './movies.html',
  styleUrl: './movies.scss' // Crie se precisar de estilos específicos
})
export class Movies implements OnInit {

  // --- Estado da UI ---
  public isLoading = true; // Controla o spinner
  public error: string | null = null; // Mensagem de erro

  // --- Dados ---
  /** Array para armazenar os filmes carregados. */
  public movies: PotterDbData<MovieAttributes>[] = [];

  constructor(private potterdbApi: PotterdbApi) {} // Injeção do serviço

  /**
   * Método do ciclo de vida: Executa na inicialização.
   */
  ngOnInit(): void {
    this.loadMovies(); // Carrega a lista de filmes
  }

  /**
   * Busca a lista completa de filmes usando o serviço da API.
   */
  loadMovies(): void {
    this.isLoading = true;
    this.error = null;

    this.potterdbApi.getMovies().subscribe({ // Chama o novo método getMovies
      next: (response: PotterDbResponse<MovieAttributes>) => { // Tipo explícito
        if (response && response.data) {
          this.movies = response.data; // Armazena os filmes
        } else {
          this.movies = []; // Garante lista vazia se resposta inesperada
        }
        this.isLoading = false; // Desativa loading
      },
      error: (_err: HttpErrorResponse | any) => { // Tipo explícito
        this.error = 'Falha ao carregar os filmes.';
        this.isLoading = false;
      }
    });
  }
}