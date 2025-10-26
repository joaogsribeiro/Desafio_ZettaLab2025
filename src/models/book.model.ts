/**
 * Atributos específicos para um Livro (Book).
 */
export interface BookAttributes {
  title: string;
  slug: string;
  cover: string | null;
  summary: string | null;
  author: string | null; // Adicionado
  release_date: string | null;
  dedication: string | null; // Adicionado
  pages: number | null;
}