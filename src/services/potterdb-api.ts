import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';

// Importa os novos modelos genéricos
import { PotterDbData, PotterDbResponse } from '../models/character.model';

// Importa os modelos de atributos específicos
import { CharacterAttributes } from '../models/character.model';
import { SpellAttributes } from '../models/spell.model';

/**
 * Serviço Injetável para consumir a API PotterDB (https://potterdb.com).
 * Este serviço centraliza toda a lógica de acesso a dados da aplicação.
 */
@Injectable({
  providedIn: 'root'
})
export class PotterdbApi {

  /** URL base da API PotterDB v1. */
  private readonly baseUrl = 'https://api.potterdb.com/v1';

  /**
   * Lista curada de slugs dos personagens principais.
   * Usada para carregar a lista inicial na página de Personagens.
   */
  private readonly importantCharacterSlugs = [
    'harry-potter',
    'hermione-granger',
    'ronald-weasley',
    'albus-dumbledore',
    'severus-snape',
    'minerva-mcgonagall',
    'rubeus-hagrid',
    'tom-riddle', // Slug correto para Voldemort (como Tom Riddle)
    'draco-malfoy',
    'sirius-black',
    'remus-lupin',
    'ginevra-weasley' // Slug correto para Ginny
  ];

  constructor(private http: HttpClient) { }

  // --- MÉTODOS DE PERSONAGEM ---

  /**
   * Busca um único personagem pelo seu ID ou SLUG.
   * Este método é o "trabalhador" para o 'forkJoin' abaixo.
   * @param idOrSlug O UUID ou o Slug (ex: 'harry-potter') do personagem.
   * @returns Um Observable contendo os dados "desembrulhados" do personagem.
   */
  getCharacterByIdOrSlug(idOrSlug: string): Observable<PotterDbData<CharacterAttributes>> {
    
    // A API para um ID/slug retorna um objeto { "data": {...} }
    // Especificamos esse tipo de retorno para o HttpClient.
    return this.http.get<{ data: PotterDbData<CharacterAttributes> }>(`${this.baseUrl}/characters/${idOrSlug}`)
      .pipe(
        // O operador 'map' (RxJS) transforma o resultado.
        // Nós "desembrulhamos" a resposta, pegando apenas o 'response.data',
        // para que o componente não precise saber sobre essa estrutura aninhada.
        map(response => response.data)
      );
  }

  /**
   * Busca a lista curada de personagens principais.
   * Dispara 12 chamadas de API em paralelo e as une em uma única resposta.
   * @returns Um Observable contendo um ARRAY com os 12 personagens principais.
   */
  getImportantCharacters(): Observable<PotterDbData<CharacterAttributes>[]> {
    
    // 1. Cria um array de "planos de trabalho" (Observables), um para cada slug.
    const requests: Observable<PotterDbData<CharacterAttributes>>[] = 
      this.importantCharacterSlugs.map(slug => {
        // Cada "plano" é uma chamada ao nosso método 'getCharacterByIdOrSlug'
        return this.getCharacterByIdOrSlug(slug);
      });

    // 2. 'forkJoin' executa todos os Observables no array 'requests' em paralelo.
    //    Ele só emitirá um valor (o array de resultados) quando TODAS as 12 chamadas
    //    tiverem sido concluídas com sucesso.
    return forkJoin(requests);
  }

  /**
   * Busca personagens pelo termo de pesquisa (filtra por nome).
   * Usa os filtros 'name_cont' e 'image_not_null' da API.
   * @param term O texto digitado pelo usuário na barra de busca.
   * @returns Um Observable com a resposta padrão da API (paginada).
   */
  searchCharacters(term: string): Observable<PotterDbResponse<CharacterAttributes>> {
    const params = new URLSearchParams({
      'filter[name_cont]': term,         // Filtro: nome CONTÉM o termo
      'filter[image_not_null]': 'true',  // Filtro: APENAS se a imagem NÃO FOR NULA
      'page[size]': '20'                 // Limita os resultados da busca
    }).toString();
    
    const url = `${this.baseUrl}/characters?${params}`;
    return this.http.get<PotterDbResponse<CharacterAttributes>>(url);
  }

  /**
   * Busca um único personagem pelo seu ID (UUID).
   * (Este método é separado caso seja necessário em outras partes, 
   * embora 'getCharacterByIdOrSlug' também o cubra)
   */
  getCharacterById(id: string): Observable<PotterDbData<CharacterAttributes>> {
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
    params.set('filter[image_not_null]', 'true'); // Filtra feitiços sem imagem
    params.set('page[size]', '30');
    return this.http.get<PotterDbResponse<SpellAttributes>>(`${this.baseUrl}/spells?${params.toString()}`);
  }
}