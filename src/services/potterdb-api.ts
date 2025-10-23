import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

// Importa os novos modelos genéricos
import { PotterDbResponse, PotterDbData } from '../models/character.model';

// Importa os modelos de atributos específicos
import { CharacterAttributes } from '../models/character.model';
import { SpellAttributes } from '../models/spell.model';
import { PotionAttributes } from '../models/potion.model';
import { BookAttributes } from '../models/book.model';
import { MovieAttributes } from '../models/movie.model';

/**
 * Serviço Injetável para consumir a API PotterDB (https://potterdb.com).
 * Substitui a antiga 'hp-api.onrender.com'.
 */
@Injectable({
  providedIn: 'root'
})
export class HpApi {

  /** Nova URL base para a API PotterDB v1 */
  private readonly baseUrl = 'https://api.potterdb.com/v1';

  /**
   * Lista curada de slugs de personagens principais para a página /characters.
   */
  private readonly importantCharacterSlugs = [
    'harry-potter',
    'hermione-granger',
    'ron-weasley',
    'albus-dumbledore',
    'severus-snape',
    'minerva-mcgonagall',
    'rubeus-hagrid',
    'lord-voldemort',
    'draco-malfoy',
    'sirius-black',
    'remus-lupin',
    'ginny-weasley'
  ].join(','); // Converte para 'slug1,slug2,slug3'

  constructor(private http: HttpClient) { }

  // --- MÉTODOS DE PERSONAGEM ---

  /**
   * Busca a lista curada de personagens principais.
   */
  getImportantCharacters(): Observable<PotterDbResponse<CharacterAttributes>> {
    const params = new URLSearchParams({
      'filter[slug_in]': this.importantCharacterSlugs
    }).toString();
    return this.http.get<PotterDbResponse<CharacterAttributes>>(`${this.baseUrl}/characters?${params}`);
  }

  /**
   * Busca personagens por um termo de pesquisa (filtra por nome).
   */
  searchCharacters(term: string): Observable<PotterDbResponse<CharacterAttributes>> {
    const params = new URLSearchParams({
      'filter[name_cont]': term, // 'cont' = contains (contém)
      'page[size]': '20'
    }).toString();
    return this.http.get<PotterDbResponse<CharacterAttributes>>(`${this.baseUrl}/characters?${params}`);
  }

  /**
   * Busca um único personagem pelo seu ID.
   */
  getCharacterById(id: string): Observable<PotterDbData<CharacterAttributes>> {
    // A API de ID único retorna um objeto 'data' singular, não um 'PotterDbResponse'
    return this.http.get<PotterDbData<CharacterAttributes>>(`${this.baseUrl}/characters/${id}`);
  }

  // --- MÉTODOS DE OUTRAS ROTAS ---

  /**
   * Busca feitiços, paginado ou por termo de pesquisa.
   */
  getSpells(term: string = ''): Observable<PotterDbResponse<SpellAttributes>> {
    const params = new URLSearchParams();
    if (term) {
      params.set('filter[name_cont]', term);
    }
    params.set('page[size]', '30');
    return this.http.get<PotterDbResponse<SpellAttributes>>(`${this.baseUrl}/spells?${params.toString()}`);
  }

  /**
   * Busca poções, paginado ou por termo de pesquisa.
   */
  getPotions(term: string = ''): Observable<PotterDbResponse<PotionAttributes>> {
    const params = new URLSearchParams();
    if (term) {
      params.set('filter[name_cont]', term);
    }
    params.set('page[size]', '30');
    return this.http.get<PotterDbResponse<PotionAttributes>>(`${this.baseUrl}/potions?${params.toString()}`);
  }

  /**
   * Busca todos os livros (são poucos, não precisa paginar/buscar).
   */
  getBooks(): Observable<PotterDbResponse<BookAttributes>> {
    return this.http.get<PotterDbResponse<BookAttributes>>(`${this.baseUrl}/books`);
  }

  /**
   * Busca todos os filmes (são poucos, não precisa paginar/buscar).
   */
  getMovies(): Observable<PotterDbResponse<MovieAttributes>> {
    return this.http.get<PotterDbResponse<MovieAttributes>>(`${this.baseUrl}/movies`);
  }
}