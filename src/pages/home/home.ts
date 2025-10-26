import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

/**
 * Componente da Home Page (página inicial).
 * Exibe conteúdo estático e links de navegação para outras seções.
 */
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    RouterLink
  ],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class Home {

}