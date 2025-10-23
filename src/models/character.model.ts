/**
 * Define a estrutura da resposta principal da API PotterDB (JSON:API).
 * @template T - O tipo dos atributos (ex: CharacterAttributes).
 */
export interface PotterDbResponse<T> {
  data: PotterDbData<T>[];
  meta: PotterDbMeta;
  links: PotterDbLinks;
}

/**
 * Representa um único objeto de dados no padrão JSON:API.
 */
export interface PotterDbData<T> {
  id: string;
  type: string;
  attributes: T;
}

/**
 * Atributos específicos para um Personagem.
 */
export interface CharacterAttributes {
  name: string;
  image: string | null;
  house: string | null;
  slug: string; // Importante para nossa busca
  // Adicione outros campos que queira exibir na página de detalhes
  born: string | null;
  died: string | null;
  gender: string | null;
  species: string | null;
  title: string | null;
}

// --- Estruturas Genéricas da API ---

export interface PotterDbMeta {
  pagination: {
    current: number;
    last: number;
    records: number;
  };
}

export interface PotterDbLinks {
  self: string;
  current: string;
  first: string;
  last: string;
  next: string | null;
  prev: string | null;
}