/**
 * Atributos específicos para uma Poção (Potion).
 */
export interface PotionAttributes {
  name: string;
  slug: string;
  image: string | null;
  effect: string | null;
  characteristics: string | null;
}