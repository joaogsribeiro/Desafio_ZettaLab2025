/**
 * Atributos específicos para um Filme (Movie).
 */
export interface MovieAttributes {
  title: string;
  slug: string;
  poster: string | null;
  summary: string | null;
  release_date: string | null;
  running_time: string | null;
}