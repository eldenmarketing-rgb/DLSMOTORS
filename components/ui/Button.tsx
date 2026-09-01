import Link from 'next/link'
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react'

type Variant = 'primary' | 'secondary' | 'ghost' | 'inverse'
type Size = 'sm' | 'md' | 'lg'

type CommonProps = {
  variant?: Variant
  size?: Size
  className?: string
  children: ReactNode
}

const base =
  'inline-flex items-center justify-center gap-2 rounded-md font-semibold tracking-tight transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-accent-500 disabled:opacity-60 disabled:cursor-not-allowed'

const variantMap: Record<Variant, string> = {
  primary:
    'bg-accent-500 text-white hover:bg-accent-600 focus-visible:ring-offset-surface-50',
  secondary:
    'border-2 border-primary-700 bg-white text-primary-700 hover:bg-primary-50 focus-visible:ring-offset-surface-50',
  ghost: 'text-ink hover:text-accent-600',
  inverse:
    'bg-accent-500 text-white hover:bg-accent-600 focus-visible:ring-offset-primary-800',
}

const sizeMap: Record<Size, string> = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-5 py-3 text-[0.95rem]',
  lg: 'px-7 py-4 text-base',
}

function classes(variant: Variant, size: Size, className?: string) {
  return `${base} ${variantMap[variant]} ${sizeMap[size]} ${className ?? ''}`
}

type ButtonAsLinkProps = CommonProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof CommonProps> & {
    href: string
  }

type ButtonAsButtonProps = CommonProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof CommonProps> & {
    href?: undefined
  }

export type ButtonProps = ButtonAsLinkProps | ButtonAsButtonProps

export function Button(props: ButtonProps) {
  const { variant = 'primary', size = 'md', className, children } = props

  if ('href' in props && props.href !== undefined) {
    const { href, variant: _v, size: _s, className: _c, children: _ch, ...rest } =
      props as ButtonAsLinkProps
    void _v
    void _s
    void _c
    void _ch
    return (
      <Link href={href} className={classes(variant, size, className)} {...rest}>
        {children}
      </Link>
    )
  }

  const { variant: _v, size: _s, className: _c, children: _ch, ...rest } =
    props as ButtonAsButtonProps
  void _v
  void _s
  void _c
  void _ch
  return (
    <button className={classes(variant, size, className)} {...rest}>
      {children}
    </button>
  )
}
