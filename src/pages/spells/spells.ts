import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, switchMap, tap } from 'rxjs/operators';
import { SpellCard } from '../../components/spell-card/spell-card'; // Componente Card
import { PotterDbData } from '../../models/character.model'; // Modelo genérico
import { SpellAttributes } from '../../models/spell.model'; // Modelo Spell
import { PotterdbApi } from '../../services/potterdb-api';

/**
 * Componente da página de Feitiços.
 * Exibe lista curada inicial e permite busca.
 */
@Component({
  selector: 'app-spells',
  standalone: true,
  imports: [ CommonModule, ReactiveFormsModule, SpellCard ],
  templateUrl: './spells.html',
  styleUrl: './spells.scss'
})
export class Spells implements OnInit {

  // --- Estado da UI ---
  public isLoading = true;
  public error: string | null = null;
  public isSearching = false; // Controla a view

  public searchControl = new FormControl('');

  // --- Dados ---
  /** Lista inicial curada de feitiços populares. */
  public initialSpells: PotterDbData<SpellAttributes>[] = [];
  /** Lista de resultados da busca na API. */
  public searchedSpells: PotterDbData<SpellAttributes>[] = [];

  constructor(private potterdbApi: PotterdbApi) {}

  ngOnInit(): void {
    this.loadInitialSpells();    // Carrega a lista curada
    this.setupSearchListener(); // Configura a busca
  }

  /**
   * Busca a lista curada de feitiços via `forkJoin`.
   */
  loadInitialSpells(): void {
    this.isLoading = true;
    this.error = null;
    this.isSearching = false;

    this.potterdbApi.getImportantSpells().subscribe({
      next: (spellsArray) => {
        this.initialSpells = spellsArray;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Falha ao carregar feitiços populares.';
        this.isLoading = false;
        console.error('Erro loadInitialSpells:', err);
      }
    });
  }

  /**
   * Configura o listener da barra de busca para chamar searchSpells.
   */
  setupSearchListener(): void {
    this.searchControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      tap(term => { // Atualiza estado da UI
        this.isSearching = !!term;
        this.isLoading = !!term;
        this.error = null;
        if (!term) this.searchedSpells = [];
      }),
      // Chama searchSpells (renomeado no serviço)
      switchMap(term => (term ? this.potterdbApi.searchSpells(term) : []))
    ).subscribe({
      next: (response) => {
        if (this.isSearching && response.data) {
          this.searchedSpells = response.data;
        } else if (this.isSearching && !response.data) {
           // Caso a busca retorne algo inesperado sem 'data'
           this.searchedSpells = [];
        }
        // Verifica se a busca (com termo) não retornou resultados
        if (this.isSearching && this.searchedSpells.length === 0 && this.searchControl.value) {
           this.error = `Nenhum feitiço encontrado para "${this.searchControl.value}".`;
        }
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Falha ao realizar a busca por feitiços.';
        this.isLoading = false;
        console.error('Erro setupSearchListener (Spells):', err);
      }
    });
  }
}