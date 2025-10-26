import { CommonModule } from '@angular/common'; // Para *ngIf
import { Component, Input } from '@angular/core';
import { PotterDbData } from '../../models/character.model'; // Modelo genérico
import { PotionAttributes } from '../../models/potion.model'; // Modelo específico

/**
 * Componente reutilizável para exibir informações de uma única poção
 * em um card.
 */
@Component({
  selector: 'app-potion-card',
  standalone: true,
  imports: [CommonModule], // Importa CommonModule para usar *ngIf
  templateUrl: './potion-card.html',
  styleUrl: './potion-card.scss'
})
export class PotionCard {
  /**
   * Propriedade de entrada que recebe os dados da poção do componente pai.
   */
  @Input() potion!: PotterDbData<PotionAttributes>;

  /**
   * Caminho para o ícone placeholder padrão para poções sem imagem.
   * Substitua 'potion-icon.svg' pelo nome do ícone que você escolher.
   */
  placeholderIconPath = 'icons/potion-icon.svg'; // Exemplo
}