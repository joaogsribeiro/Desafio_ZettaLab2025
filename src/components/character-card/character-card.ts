import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PotterDbData, CharacterAttributes } from '../../models/character.model';

@Component({
  selector: 'app-character-card',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink
  ],
  templateUrl: './character-card.html',
  styleUrl: './character-card.scss'
})
export class CharacterCard {

  @Input() char!: PotterDbData<CharacterAttributes>;
}