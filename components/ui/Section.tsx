import type { HTMLAttributes } from 'react'

type SectionProps = HTMLAttributes<HTMLElement> & {
  tone?: 'surface' | 'primary' | 'panel' | 'ink'
  spacing?: 'compact' | 'default' | 'roomy'
}

const toneMap = {
  surface: 'bg-surface-50 text-ink',
  primary: 'bg-primary-800 text-surface-50',
  panel: 'bg-panel text-ink',
  ink: 'bg-ink text-surface-50',
} as const

const spacingMap = {
  compact: 'py-12 sm:py-16',
  default: 'py-20 sm:py-28',
  roomy: 'py-28 sm:py-36',
} as const

export function Section({
  tone = 'surface',
  spacing = 'default',
  className = '',
  children,
  ...rest
}: SectionProps) {
  return (
    <section
      {...rest}
      className={`${toneMap[tone]} ${spacingMap[spacing]} ${className}`}
    >
      {children}
    </section>
  )
}
