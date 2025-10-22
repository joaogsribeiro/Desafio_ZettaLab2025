/**
 * Define a estrutura de dados para um personagem,
 * conforme retornado pela HP-API.
 *
 * Esta interface garante a tipagem correta em toda a aplicação.
 */
export interface Character {
  id: string;
  name: string;
  alternate_names: string[];
  species: string;
  gender: string;
  house: string;
  dateOfBirth: string | null;
  yearOfBirth: number | null;
  wizard: boolean;
  ancestry: string;
  eyeColour: string;
  hairColour: string;
  /** Objeto aninhado contendo detalhes da varinha */
  wand: Wand;
  patronus: string;
  hogwartsStudent: boolean;
  hogwartsStaff: boolean;
  actor: string;
  alternate_actors: string[];
  alive: boolean;
  image: string;
}

/**
 * Define a estrutura aninhada para a varinha de um personagem.
 */
export interface Wand {
  wood: string;
  core: string;
  length: number | null;
}