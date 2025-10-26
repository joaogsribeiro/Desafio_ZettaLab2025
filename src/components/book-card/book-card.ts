import { CommonModule } from '@angular/common'; // Para *ngIf
import { Component, Input } from '@angular/core';
import { BookAttributes } from '../../models/book.model'; // Modelo específico
import { PotterDbData } from '../../models/character.model'; // Modelo genérico

/**
 * Componente reutilizável para exibir informações de um livro
 * em um layout horizontal (imagem à esquerda, texto à direita).
 */
@Component({
  selector: 'app-book-card',
  standalone: true,
  imports: [CommonModule], // Importa CommonModule para usar *ngIf
  templateUrl: './book-card.html',
  styleUrl: './book-card.scss'
})
export class BookCard {
  /**
   * Propriedade de entrada que recebe os dados do livro do componente pai.
   */
  @Input() book!: PotterDbData<BookAttributes>;
  placeholderIconPath = 'icons/book-icon.svg'; // Exemplo
}