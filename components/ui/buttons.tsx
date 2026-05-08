'use client'

import { forwardRef, ButtonHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'
import { Loader2 } from 'lucide-react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'emergency' | 'glass' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  icon?: ReactNode
}

interface Button3DProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'emergency' | 'glass' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  icon?: ReactNode
}

import { ReactNode } from 'react'

// 3D Button with press effect
export const Button3D = forwardRef<HTMLButtonElement, Button3DProps>(
  ({
    className,
    variant = 'default',
    size = 'md',
    loading = false,
    icon,
    children,
    disabled,
    ...props
  }, ref) => {

    const variants = {
      default: 'bg-gradient-to-b from-white/10 to-white/5 hover:from-white/15 hover:to-white/10 text-white border border-white/10',
      emergency: 'bg-gradient-to-b from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white border border-red-500/50',
      glass: 'glass-gray hover:bg-white/10 text-white border border-white/20',
      outline: 'bg-transparent hover:bg-white/5 text-white border border-white/20',
    }

    const sizes = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-5 py-2.5 text-base',
      lg: 'px-8 py-4 text-lg',
    }

    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          'relative rounded-xl font-semibold transition-all duration-200',
          'active:scale-[0.98] active:translate-y-0.5',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          'shadow-lg hover:shadow-xl',
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {loading ? (
          <Loader2 className="animate-spin mr-2 inline-block" size={18} />
        ) : icon ? (
          <span className="mr-2 inline-block">{icon}</span>
        ) : null}
        {children}
      </button>
    )
  }
)
Button3D.displayName = 'Button3D'

// Pulse emergency button
interface EmergencyButtonProps {
  children: ReactNode
  onClick?: () => void
  className?: string
}

export function EmergencyButton({ children, onClick, className = '' }: EmergencyButtonProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'relative group rounded-full',
        'bg-gradient-to-br from-red-600 to-red-700',
        'text-white font-bold',
        'shadow-lg shadow-red-500/30',
        'transition-all duration-300',
        'hover:shadow-xl hover:shadow-red-500/50',
        'hover:scale-105 active:scale-95',
        'overflow-hidden',
        className
      )}
    >
      {/* Animated pulse ring */}
      <div className="absolute inset-0 rounded-full">
        <div className="absolute inset-0 rounded-full animate-ping bg-red-500/50 opacity-75" />
      </div>

      {/* Content */}
      <div className="relative px-6 py-3 flex items-center gap-2">
        {children}
      </div>

      {/* Shine effect */}
      <div className="absolute inset-0 rounded-full overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full animate-shimmer" />
      </div>
    </button>
  )
}

// Glass icon button
interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  size?: 'sm' | 'md' | 'lg'
  glowing?: boolean
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ className, size = 'md', glowing = false, children, ...props }, ref) => {
    const sizes = {
      sm: 'p-2',
      md: 'p-3',
      lg: 'p-4',
    }

    return (
      <button
        ref={ref}
        className={cn(
          'relative rounded-xl',
          'glass-gray border border-white/10',
          'hover:bg-white/10',
          'transition-all duration-200',
          'active:scale-95',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          sizes[size],
          glowing && 'shadow-lg shadow-white/10',
          className
        )}
        {...props}
      >
        {children}
      </button>
    )
  }
)
IconButton.displayName = 'IconButton'