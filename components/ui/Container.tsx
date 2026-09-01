import type { HTMLAttributes } from 'react'

type ContainerProps = HTMLAttributes<HTMLDivElement> & {
  size?: 'narrow' | 'default' | 'wide'
}

const sizeMap = {
  narrow: 'max-w-2xl',
  default: 'max-w-5xl',
  wide: 'max-w-6xl',
} as const

export function Container({
  size = 'default',
  className = '',
  children,
  ...rest
}: ContainerProps) {
  return (
    <div
      {...rest}
      className={`mx-auto w-full px-6 sm:px-8 ${sizeMap[size]} ${className}`}
    >
      {children}
    </div>
  )
}
