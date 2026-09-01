import Link from 'next/link'

export type BreadcrumbItem = {
  label: string
  href?: string
}

type BreadcrumbProps = {
  items: BreadcrumbItem[]
  className?: string
}

export function Breadcrumb({ items, className = '' }: BreadcrumbProps) {
  return (
    <nav aria-label="Fil d’Ariane" className={className}>
      <ol className="flex flex-wrap items-center gap-1.5 text-xs uppercase tracking-[0.14em] text-ink-soft">
        {items.map((item, index) => {
          const isLast = index === items.length - 1
          return (
            <li key={`${item.label}-${index}`} className="flex items-center gap-1.5">
              {item.href && !isLast ? (
                <Link
                  href={item.href}
                  className="transition-colors hover:text-ink"
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  aria-current={isLast ? 'page' : undefined}
                  className={isLast ? 'text-ink' : ''}
                >
                  {item.label}
                </span>
              )}
              {!isLast && (
                <span aria-hidden="true" className="text-ink/30">
                  /
                </span>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

export function breadcrumbJsonLd(
  items: BreadcrumbItem[],
  siteUrl: string,
): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.label,
      ...(item.href ? { item: `${siteUrl}${item.href}` } : {}),
    })),
  }
}
