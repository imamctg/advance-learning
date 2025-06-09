// components/ui/card.tsx
import { cn } from 'lib/utils'
import { ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  className?: string
}

export function Card({ children, className }: CardProps) {
  return (
    <div className={cn('rounded-2xl border bg-white shadow-sm', className)}>
      {children}
    </div>
  )
}

export function CardContent({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return <div className={cn('p-6', className)}>{children}</div>
}
