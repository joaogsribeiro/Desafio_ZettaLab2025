import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';

// Importa os novos modelos genéricos
import { PotterDbData, PotterDbResponse } from '../models/character.model';

// Importa os modelos de atributos específicos
import { BookAttributes } from '../models/book.model';
import { CharacterAttributes } from '../models/character.model';
import { MovieAttributes } from '../models/movie.model';
import { PotionAttributes } from '../models/potion.model';
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
    'tom-riddle',
    'draco-malfoy',
    'sirius-black',
    'remus-lupin',
    'ginevra-weasley'
  ];

  /**
   * Lista curada de slugs dos feitiços mais populares/icônicos.
   * (Você pode ajustar esta lista)
   */
  private readonly importantSpellSlugs = [
    'lumos-maxima',
    'wand-extinguishing-charm',
    'summoning-charm',
    'disarming-charm',
    'levitation-charm',
    'unlocking-charm',
    'patronus-charm',
    'boggart-banishing-spell',
    'stunning-spell',
    'killing-curse',
    'cruciatus-curse',
    'imperius-curse'
  ];

  /**
   * Lista curada de slugs de poções populares/importantes.
   * (Exemplos: Polissuco, Felix Felicis, Veritaserum)
   */
  private readonly importantPotionSlugs = [
    'polyjuice-potion',
    'felix-felicis',
    'amortentia'
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

// --- MÉTODOS DE FEITIÇO ---

  /**
   * Busca um único feitiço pelo seu SLUG.
   * Usa o endpoint /v1/spells/{id}
   * @param slug O Slug (ex: 'lumos') do feitiço.
   * @returns Um Observable contendo os dados "desembrulhados" do feitiço.
   */
  getSpellBySlug(slug: string): Observable<PotterDbData<SpellAttributes>> {
    // A API retorna { "data": {...} } para um único item
    return this.http.get<{ data: PotterDbData<SpellAttributes> }>(`${this.baseUrl}/spells/${slug}`)
      .pipe(
        map(response => response.data) // Extrai o 'data'
      );
  }

  /**
   * Busca a lista curada de feitiços populares usando forkJoin.
   * @returns Um Observable contendo um ARRAY com os feitiços populares.
   */
  getImportantSpells(): Observable<PotterDbData<SpellAttributes>[]> {
    const requests: Observable<PotterDbData<SpellAttributes>>[] =
      this.importantSpellSlugs.map(slug => this.getSpellBySlug(slug));

    return forkJoin(requests);
  }

  /**
   * Busca feitiços por termo de pesquisa (ou todos, se termo vazio).
   * Mantém o filtro 'image_not_null'.
   */
  searchSpells(term: string = ''): Observable<PotterDbResponse<SpellAttributes>> { // Renomeado de getSpells para clareza
    const params = new URLSearchParams();
    if (term) {
      params.set('filter[incantation_cont]', term);
    }
    params.set('filter[image_not_null]', 'true');
    params.set('page[size]', '30'); // Ou outro tamanho de página
    return this.http.get<PotterDbResponse<SpellAttributes>>(`${this.baseUrl}/spells?${params.toString()}`);
  }

  // --- MÉTODOS DE POÇÃO ---

  /**
   * Busca uma única poção pelo seu SLUG.
   * Usa o endpoint /v1/potions/{id}
   * @param slug O Slug da poção (ex: 'polyjuice-potion').
   * @returns Um Observable contendo os dados "desembrulhados" da poção.
   */
  getPotionBySlug(slug: string): Observable<PotterDbData<PotionAttributes>> {
    // A API retorna { "data": {...} } para um único item
    return this.http.get<{ data: PotterDbData<PotionAttributes> }>(`${this.baseUrl}/potions/${slug}`)
      .pipe(
        map(response => response.data) // Extrai o 'data'
      );
  }

  /**
   * Busca a lista curada de poções populares usando forkJoin.
   * @returns Um Observable contendo um ARRAY com as poções populares.
   */
  getImportantPotions(): Observable<PotterDbData<PotionAttributes>[]> {
    const requests: Observable<PotterDbData<PotionAttributes>>[] =
      this.importantPotionSlugs.map(slug => this.getPotionBySlug(slug));

    return forkJoin(requests);
  }

  /**
   * Busca poções por termo de pesquisa E/OU por página.
   * Inclui filtro para trazer apenas resultados com imagem.
   * @param term O termo de busca (opcional).
   * @param page O número da página a ser buscada (padrão: 1).
   * @param pageSize O número de itens por página (padrão: 20).
   * @returns Um Observable com a resposta padrão da API (paginada).
   */
  searchPotions(term: string = '', page: number = 1, pageSize: number = 15): Observable<PotterDbResponse<PotionAttributes>> {
    const params = new URLSearchParams();

    // Adiciona filtro de nome se houver termo de busca
    if (term) {
      params.set('filter[name_cont]', term);
    }

    // Adiciona filtro para imagem não nula
    params.set('filter[image_not_null]', 'true');

    // Adiciona parâmetros de paginação
    params.set('page[number]', page.toString());
    params.set('page[size]', pageSize.toString());

    const url = `${this.baseUrl}/potions?${params.toString()}`;

    return this.http.get<PotterDbResponse<PotionAttributes>>(url);
  }

  // --- MÉTODO DE LIVROS  ---

  /**
   * Busca todos os livros.
   * Não precisa de paginação ou filtros complexos, pois são poucos.
   * @returns Um Observable com a resposta da API contendo a lista de livros.
   */
  getBooks(): Observable<PotterDbResponse<BookAttributes>> {
    const url = `${this.baseUrl}/books`;
    return this.http.get<PotterDbResponse<BookAttributes>>(url);
  }

  // --- MÉTODO DE FILMES  ---

  /**
   * Busca todos os filmes.
   * Não precisa de paginação ou filtros complexos.
   * @returns Um Observable com a resposta da API contendo a lista de filmes.
   */
  getMovies(): Observable<PotterDbResponse<MovieAttributes>> {
    const url = `${this.baseUrl}/movies`;
    // Usa o endpoint /v1/movies
    return this.http.get<PotterDbResponse<MovieAttributes>>(url);
  }
}