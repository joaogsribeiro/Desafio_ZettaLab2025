/**
 * Atributos específicos para um Livro (Book).
 */
export interface BookAttributes {
  title: string;
  slug: string;
  cover: string | null;
  summary: string | null;
  release_date: string | null;
  pages: number | null;
}