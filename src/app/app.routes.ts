import { Routes } from '@angular/router';

// Importação dos componentes "Página" que serão roteados
import { CharacterDetail } from '../pages/character-detail/character-detail';
import { Characters } from '../pages/characters/characters';
import { Home } from '../pages/home/home';
import { House } from '../pages/house/house';
import { Spells } from '../pages/spells/spells';

/**
 * Define as rotas principais da aplicação.
 * Cada rota mapeia uma URL (path) para um componente específico.
 */
export const routes: Routes = [
  // Rota principal (página inicial)
  { path: '', component: Home },

  // --- Rotas de Listagem ---
  { path: 'characters', component: Characters },
  { path: 'spells', component: Spells },

  // --- Rotas Dinâmicas (com parâmetros na URL) ---

  /** Rota de detalhe: Carrega um personagem específico por seu ':id'. */
  { path: 'character/:id', component: CharacterDetail },

  /** Rota de filtro: Carrega personagens filtrados por ':houseName' (ex: /house/gryffindor). */
  { path: 'house/:houseName', component: House },

  // --- Rota "Catch-all" (Not Found) ---
  /**
   * Redireciona qualquer URL desconhecida (que não deu "match" com as rotas acima)
   * para a página inicial ('').
   * 'pathMatch: full' é necessário para rotas de redirecionamento.
   */
  { path: '**', redirectTo: '', pathMatch: 'full' },
];