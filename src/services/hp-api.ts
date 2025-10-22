import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

// Importação dos modelos de dados
import { Character } from '../models/character.model';
import { Spell } from '../models/spell.model';

/**
 * Serviço Injetável (Singleton).
 * Centraliza toda a lógica de comunicação com a HP-API (https://hp-api.onrender.com).
 * Fornecido na raiz ('root'), estando disponível para toda a aplicação.
 */
@Injectable({
  providedIn: 'root'
})
export class HpApi {

  /** URL base da API. Usar uma constante evita repetição (DRY) e facilita manutenção. */
  private readonly baseUrl = 'https://hp-api.onrender.com/api';

  /**
   * Construtor do serviço.
   * @param http - O cliente HttpClient do Angular, injetado automaticamente
   * para realizar requisições web.
   */
  constructor(private http: HttpClient) { }

  // --- Métodos de Busca (Endpoints) ---

  /**
   * Busca a lista completa de todos os personagens.
   * @returns Um Observable contendo um array de 'Character'.
   */
  getAllCharacters(): Observable<Character[]> {
    return this.http.get<Character[]>(`${this.baseUrl}/characters`);
  }

  /**
   * Busca a lista completa de feitiços.
   * @returns Um Observable contendo um array de 'Spell'.
   */
  getSpells(): Observable<Spell[]> {
    return this.http.get<Spell[]>(`${this.baseUrl}/spells`);
  }

  /**
   * Busca personagens filtrados por uma casa específica.
   * @param houseName - O nome da casa (ex: 'gryffindor', 'slytherin').
   * @returns Um Observable contendo um array de 'Character' daquela casa.
   */
  getCharactersByHouse(houseName: string): Observable<Character[]> {
    return this.http.get<Character[]>(`${this.baseUrl}/characters/house/${houseName}`);
  }

  /**
   * Busca os detalhes de um único personagem pelo seu ID.
   * @param id - O ID único (UUID) do personagem.
   * @returns Um Observable contendo um *único* objeto 'Character'.
   */
  getCharacterById(id: string): Observable<Character> {
    // Nota: Este endpoint da API (/character/:id) retorna um único objeto, não um array.
    return this.http.get<Character>(`${this.baseUrl}/character/${id}`);
  }
}