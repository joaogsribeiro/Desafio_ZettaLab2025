/**
 * Atributos específicos para um Livro (Book).
 */
export interface BookAttributes {
  title: string;
  slug: string;
  cover: string | null;
  summary: string | null;
  author: string | null;
  release_date: string | null;
  dedication: string | null;
  pages: number | null;
}