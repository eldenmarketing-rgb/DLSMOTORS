import type { HTMLAttributes } from 'react'

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  tone?: 'panel' | 'primary' | 'accent' | 'surface'
}

const toneMap = {
  panel: 'bg-panel text-ink',
  primary: 'bg-primary-100 text-primary-800',
  accent: 'bg-accent-500/10 text-accent-700',
  surface: 'bg-surface-100 text-surface-700',
} as const

export function Badge({
  tone = 'panel',
  className = '',
  children,
  ...rest
}: BadgeProps) {
  return (
    <span
      {...rest}
      className={`inline-flex items-center gap-1.5 rounded px-3 py-1 text-xs font-semibold tracking-[0.08em] uppercase ${toneMap[tone]} ${className}`}
    >
      {children}
    </span>
  )
}
