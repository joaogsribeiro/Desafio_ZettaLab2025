import { Routes } from '@angular/router';

import { Books } from '../pages/books/books';
import { CharacterDetail } from '../pages/character-detail/character-detail';
import { Characters } from '../pages/characters/characters';
import { Home } from '../pages/home/home';
import { Movies } from '../pages/movies/movies';
import { Potions } from '../pages/potions/potions';
import { Spells } from '../pages/spells/spells';

/**
 * Define as rotas principais da aplicação, agora focadas na API PotterDB.
 */
export const routes: Routes = [
  // Rota principal (página inicial)
  { path: '', component: Home },

  // --- Rotas com Funcionalidades ---
  { path: 'characters', component: Characters }, // Página curada + Busca
  { path: 'spells', component: Spells },         // Lista + Busca
  { path: 'potions', component: Potions },       // Lista + Busca
  
  // --- Rotas de Listagem Simples ---
  { path: 'books', component: Books },           
  { path: 'movies', component: Movies },         

  // --- Rota de Detalhe ---
  { path: 'character/:id', component: CharacterDetail },

  // --- Rota "Catch-all" (Not Found) ---
  { path: '**', redirectTo: '', pathMatch: 'full' },
];