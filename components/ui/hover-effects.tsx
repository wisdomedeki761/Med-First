'use client'

import { cn } from '@/lib/utils'
import { ReactNode } from 'react'

interface HoverLiftProps {
  children: ReactNode
  className?: string
  scale?: number
  translateY?: number
  shadow?: 'sm' | 'md' | 'lg' | 'xl'
  disabled?: boolean
}

export function HoverLift({
  children,
  className = '',
  scale = 1.02,
  translateY = -4,
  shadow = 'lg',
  disabled = false,
}: HoverLiftProps) {
  if (disabled) return <>{children}</>

  const shadows = {
    sm: 'hover:shadow-sm',
    md: 'hover:shadow-md',
    lg: 'hover:shadow-lg',
    xl: 'hover:shadow-xl',
  }

  return (
    <div
      className={cn(
        'transition-all duration-300 ease-out cursor-pointer',
        'hover:scale-[var(--scale)] hover:-translate-y-[var(--translate-y)]',
        shadows[shadow],
        className
      )}
      style={{
        '--scale': scale,
        '--translate-y': `${translateY}px`,
      } as React.CSSProperties}
    >
      {children}
    </div>
  )
}

// Magnetic effect on hover
interface MagneticProps {
  children: ReactNode
  className?: string
  strength?: number
}

export function Magnetic({
  children,
  className = '',
  strength = 10
}: MagneticProps) {
  return (
    <div
      className={cn(
        'transition-transform duration-300 ease-out',
        'hover:translate-x-[var(--x)] hover:translate-y-[var(--y)]',
        className
      )}
      style={{
        '--x': `${strength * 0.5}px`,
        '--y': `${-strength * 0.5}px`,
      } as React.CSSProperties}
    >
      {children}
    </div>
  )
}

// Scale on click
interface ScaleClickProps {
  children: ReactNode
  className?: string
  scaleDown?: number
}

export function ScaleClick({
  children,
  className = '',
  scaleDown = 0.95
}: ScaleClickProps) {
  return (
    <div
      className={cn(
        'transition-transform duration-150 ease-out',
        'active:scale-[var(--scale-down)]',
        className
      )}
      style={{
        '--scale-down': scaleDown,
      } as React.CSSProperties}
    >
      {children}
    </div>
  )
}

// Border glow on hover
interface BorderGlowProps {
  children: ReactNode
  className?: string
  color?: 'primary' | 'critical' | 'urgent' | 'stable'
}

export function BorderGlow({
  children,
  className = '',
  color = 'primary'
}: BorderGlowProps) {
  const colors = {
    primary: 'hover:border-white/30 hover:shadow-white/10',
    critical: 'hover:border-critical/50 hover:shadow-critical/20',
    urgent: 'hover:border-urgent/50 hover:shadow-urgent/20',
    stable: 'hover:border-stable/50 hover:shadow-stable/20',
  }

  return (
    <div
      className={cn(
        'transition-all duration-300',
        'border border-white/10 rounded-xl',
        colors[color],
        className
      )}
    >
      {children}
    </div>
  )
}