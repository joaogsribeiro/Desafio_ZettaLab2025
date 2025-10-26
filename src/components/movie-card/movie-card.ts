import { CommonModule } from '@angular/common'; // Importa CommonModule e DatePipe
import { Component, Input } from '@angular/core';
import { PotterDbData } from '../../models/character.model'; // Modelo genérico
import { MovieAttributes } from '../../models/movie.model'; // Modelo específico

/**
 * Componente reutilizável para exibir informações de um filme
 * em um layout horizontal (poster à esquerda, texto à direita).
 */
@Component({
  selector: 'app-movie-card',
  standalone: true,
  imports: [CommonModule], 
  templateUrl: './movie-card.html',
  styleUrl: './movie-card.scss'
})
export class MovieCard {
  /**
   * Propriedade de entrada que recebe os dados do filme do componente pai.
   */
  @Input() movie!: PotterDbData<MovieAttributes>;

  /**
   * Caminho para o ícone placeholder padrão para filmes sem poster.
   * Substitua 'movie-icon.svg' pelo nome do ícone que você escolher.
   */
  placeholderIconPath = 'icons/movie-icon.svg'; // Exemplo

  /**
   * Formata a lista de diretores em uma string separada por vírgulas.
   * Retorna null se não houver diretores.
   */
  get directorsList(): string | null {
    if (this.movie?.attributes?.directors && this.movie.attributes.directors.length > 0) {
      return this.movie.attributes.directors.join(', ');
    }
    return null;
  }
}