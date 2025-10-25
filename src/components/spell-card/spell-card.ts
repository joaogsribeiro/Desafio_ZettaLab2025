import { CommonModule } from '@angular/common'; // Para *ngIf
import { Component, Input } from '@angular/core';
import { PotterDbData } from '../../models/character.model'; // Modelo genérico
import { SpellAttributes } from '../../models/spell.model'; // Modelo específico

/**
 * Componente reutilizável para exibir informações de um único feitiço
 * em um card.
 */
@Component({
  selector: 'app-spell-card',
  standalone: true,
  imports: [CommonModule], // Importa CommonModule para usar *ngIf
  templateUrl: './spell-card.html',
  styleUrl: './spell-card.scss'
})
export class SpellCard {
  /**
   * Propriedade de entrada que recebe os dados do feitiço do componente pai.
   */
  @Input() spell!: PotterDbData<SpellAttributes>;

  /**
   * Caminho para o ícone placeholder padrão para feitiços sem imagem.
   * Substitua 'wand-icon.svg' pelo nome do ícone que você escolher.
   */
  placeholderIconPath = 'icons/wand-icon.svg'; // Exemplo
}