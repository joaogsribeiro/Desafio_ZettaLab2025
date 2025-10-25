import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    RouterLink,       // Necessário para [routerLink]
    RouterLinkActive  // Necessário para [routerLinkActive]
  ],
  templateUrl: './header.html',
  styleUrl: './header.scss'
})
export class Header {

}
