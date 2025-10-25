/**
 * Define os atributos específicos para um Feitiço (Spell),
 * conforme a estrutura da PotterDB API.
 */
export interface SpellAttributes {
  slug: string;
  name: string;
  incantation: string | null;
  category: string | null;
  effect: string | null;
  light: string | null;
  hand: string | null;
  creator: string | null;
  image: string | null;
  wiki: string | null;
}