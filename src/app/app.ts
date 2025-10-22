import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Footer } from '../layout/footer/footer';
import { Header } from '../layout/header/header';

@Component({
  selector: 'app-root',
  standalone: true, // Necessário para componentes que usam 'imports'
  
  imports: [
    RouterOutlet,
    Header,       // Componente de cabeçalho
    Footer        // Componente de rodapé
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  /** Título da aplicação. Usando 'signal' (nova feature do Angular) para reatividade. */
  protected readonly title = signal('desafio-zetta');
}