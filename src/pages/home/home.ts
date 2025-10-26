import { Component } from '@angular/core';
import { RouterLink } from '@angular/router'; // 1. Importar RouterLink

/**
 * Componente da Home Page (página inicial).
 * Exibe conteúdo estático e links de navegação para outras seções.
 */
@Component({
  selector: 'app-home', // Seletor padrão
  standalone: true,    // Componente standalone
  imports: [
    RouterLink // 2. Adicionar RouterLink aos imports
    // Adicione CommonModule aqui se usar *ngIf ou *ngFor futuramente
  ],
  templateUrl: './home.html', // Template HTML
  styleUrl: './home.scss'      // Estilos SCSS
})
export class Home {
  // Nenhuma lógica TypeScript extra é necessária por enquanto,
  // pois a página é estática e a navegação é feita pelo RouterLink.
}