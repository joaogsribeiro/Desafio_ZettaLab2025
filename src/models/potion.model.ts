/**
 * Atributos específicos para uma Poção (Potion),
 * conforme a estrutura da PotterDB API.
 */
export interface PotionAttributes {
  name: string;
  slug: string;
  image: string | null;
  effect: string | null;
  characteristics: string | null;
  side_effects: string | null;
  inventors: string | null;
  difficulty: string | null;
}