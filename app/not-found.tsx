import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { siteConfig } from "@/lib/config";

export default function NotFound() {
  return (
    <main>
      <div className="flex min-h-[70vh] items-center justify-center bg-surface-50">
        <Container size="narrow" className="text-center">
          <p className="font-display text-[length:var(--text-display)] leading-none text-primary-700">
            404
          </p>
          <h1 className="mt-6 font-display text-[length:var(--text-h1)] leading-[var(--text-h1--line-height)] tracking-[var(--text-h1--letter-spacing)] text-ink">
            Cette page n&apos;existe pas ou a été déplacée.
          </h1>
          <p className="mt-4 text-ink-soft">
            Peut-être cherchiez-vous l&apos;un de nos services&nbsp;?
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Button href="/" variant="primary" size="md">
              Retour à l&apos;accueil
            </Button>
            <Button
              href={`/${siteConfig.sectionRoot}`}
              variant="secondary"
              size="md"
            >
              {siteConfig.sectionLabel}
            </Button>
          </div>
        </Container>
      </div>
    </main>
  );
}
