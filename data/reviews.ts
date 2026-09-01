/**
 * Avis clients — UNIQUEMENT de vrais avis (copiés de la fiche Google, avec
 * accord). Le schema AggregateRating n'est émis que si ce tableau est rempli :
 * inventer des avis = pénalité + perte de confiance. Laisser vide au lancement.
 */
export interface Review {
  author: string;
  /** Note sur 5. */
  rating: number;
  text: string;
  /** Date ISO (« 2026-05-12 ») — optionnelle. */
  date?: string;
}

export const reviews: Review[] = [];

/** Lien « Laisser un avis » de la fiche Google Business Profile (vide = masqué). */
export const gbpLink = "";

export function averageRating(): number | null {
  if (reviews.length === 0) return null;
  const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
  return Math.round((sum / reviews.length) * 10) / 10;
}
