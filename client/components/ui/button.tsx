// components/ui/button.tsx

import { cn } from 'lib/utils'
import { ButtonHTMLAttributes, forwardRef } from 'react'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | 'default'
    | 'outline'
    | 'ghost'
    | 'destructive'
    | 'success'
    | 'warning'
  size?: 'sm' | 'md' | 'lg'
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, children, variant = 'default', size = 'md', ...props },
    ref
  ) => {
    const base =
      'inline-flex items-center justify-center font-medium transition-colors focus:outline-none'
    const variants = {
      default: 'bg-blue-600 text-white hover:bg-blue-700',
      outline: 'border border-gray-300 text-gray-700 hover:bg-gray-100',
      ghost: 'text-gray-700 hover:bg-gray-100',
    }
    const sizes = {
      sm: 'px-3 py-1 text-sm rounded',
      md: 'px-4 py-2 text-base rounded-md',
      lg: 'px-6 py-3 text-lg rounded-lg',
    }

    return (
      <button
        ref={ref}
        className={cn(base, variants[variant], sizes[size], className)}
        {...props}
      >
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'
