import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { averageRating, reviews } from "@/data/reviews";

/** Étoiles pleines/vides — rendu serveur, aucune interaction. */
export function Stars({ value }: { value: number }) {
  return (
    <span className="inline-flex text-accent-500" aria-label={`${value} sur 5`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} className={i < Math.round(value) ? "" : "opacity-25"}>
          ★
        </span>
      ))}
    </span>
  );
}

/** Les 3 meilleurs avis sur l'accueil — rien ne s'affiche tant qu'il n'y a pas de vrais avis. */
export function ReviewsBlock() {
  if (reviews.length === 0) return null;
  const shown = reviews.slice(0, 3);
  const avg = averageRating();

  return (
    <Section tone="surface" spacing="compact">
      <Container size="wide">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <Badge tone="accent">Avis clients</Badge>
            <h2 className="mt-5 font-display text-[length:var(--text-h1)] leading-[var(--text-h1--line-height)]">
              Ils nous ont fait confiance.
            </h2>
            {avg !== null ? (
              <p className="mt-3 text-ink-soft">
                <Stars value={avg} />{" "}
                <span className="font-semibold text-ink">
                  {String(avg).replace(".", ",")}/5
                </span>{" "}
                sur {reviews.length} avis
              </p>
            ) : null}
          </div>
          <Link
            href="/avis"
            className="text-sm font-medium text-ink underline-offset-4 hover:underline"
          >
            Tous les avis →
          </Link>
        </div>

        <ul className="mt-10 grid gap-6 md:grid-cols-3">
          {shown.map((r) => (
            <li
              key={`${r.author}-${r.text.slice(0, 20)}`}
              className="flex flex-col rounded-2xl border border-ink/8 bg-surface-50 p-8"
            >
              <Stars value={r.rating} />
              <p className="mt-4 flex-1 text-[0.95rem] leading-relaxed text-ink-soft">
                {r.text}
              </p>
              <p className="mt-5 text-sm font-semibold text-ink">{r.author}</p>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
