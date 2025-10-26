import { CommonModule } from '@angular/common'; // Importe CommonModule para *ngIf
import { Component, HostListener, signal } from '@angular/core'; // Importe HostListener
import { RouterOutlet } from '@angular/router';
import { Footer } from '../layout/footer/footer';
import { Header } from '../layout/header/header';

/**
 * Componente raiz (root) da aplicação.
 */
@Component({
  selector: 'app-root',
  standalone: true, 
  imports: [
    CommonModule,
    RouterOutlet, 
    Header,       
    Footer        
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  /** Título da aplicação. */
  protected readonly title = signal('Lumos Data');

  /** Controla a visibilidade do botão "Voltar ao Topo". */
  showBackToTopButton = false;

  /**
   * @HostListener: Escuta o evento 'scroll' no objeto 'window'.
   * Atualiza a visibilidade do botão com base na posição do scroll.
   */
  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    // Define a quantidade de pixels que o usuário precisa rolar para o botão aparecer
    const scrollOffset = 2000; 
    // window.scrollY (ou pageYOffset) retorna a posição vertical atual do scroll
    if (window.scrollY > scrollOffset || document.documentElement.scrollTop > scrollOffset || document.body.scrollTop > scrollOffset) {
      this.showBackToTopButton = true;
    } else {
      this.showBackToTopButton = false;
    }
  }

  /**
   * Função chamada quando o botão "Voltar ao Topo" é clicado.
   * Rola a página suavemente para o topo.
   */
  scrollToTop(): void {
    window.scrollTo({
      top: 0, // Posição Y = 0
      behavior: 'smooth' // Animação suave
    });
  }
}