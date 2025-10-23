/**
 * Atributos específicos para um Feitiço (Spell).
 */
export interface SpellAttributes {
  name: string;
  slug: string;
  image: string | null;
  effect: string | null;
  incantation: string | null;
}