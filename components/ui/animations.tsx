'use client'

import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface FadeInProps {
  children: ReactNode
  delay?: number
  className?: string
}

export function FadeIn({ children, delay = 0, className = '' }: FadeInProps) {
  return (
    <div
      className={cn('animate-slide-up', className)}
      style={{ animationDelay: `${delay}ms` }}
    >
      {children}
    </div>
  )
}

interface ScaleInProps {
  children: ReactNode
  delay?: number
  className?: string
}

export function ScaleIn({ children, delay = 0, className = '' }: ScaleInProps) {
  return (
    <div
      className={cn('animate-scale-in', className)}
      style={{ animationDelay: `${delay}ms` }}
    >
      {children}
    </div>
  )
}

interface FloatProps {
  children: ReactNode
  duration?: number
  className?: string
}

export function Float({ children, duration = 3, className = '' }: FloatProps) {
  return (
    <div
      className={cn('animate-float', className)}
      style={{ animationDuration: `${duration}s` }}
    >
      {children}
    </div>
  )
}

interface PulseGlowProps {
  children: ReactNode
  color?: 'red' | 'white' | 'gray'
  className?: string
}

export function PulseGlow({ children, color = 'white', className = '' }: PulseGlowProps) {
  const colorClasses = {
    red: 'animate-pulse-glow',
    white: 'shadow-white/20',
    gray: 'shadow-white/10',
  }

  return (
    <div className={cn(colorClasses[color], className)}>
      {children}
    </div>
  )
}

interface ShimmerProps {
  className?: string
}

export function Shimmer({ className = '' }: ShimmerProps) {
  return (
    <div className={cn('relative overflow-hidden rounded-lg', className)}>
      <div className="absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent via-white/10 to-transparent" />
    </div>
  )
}

interface HoverLiftProps {
  children: ReactNode
  className?: string
  scale?: number
}

export function HoverLift({ children, className = '', scale = 1.05 }: HoverLiftProps) {
  return (
    <div
      className={cn(
        'transition-all duration-300 ease-out hover:-translate-y-2 cursor-pointer',
        className
      )}
      style={{
        '--tw-scale': scale,
      } as React.CSSProperties}
    >
      {children}
    </div>
  )
}

interface StaggeredListProps {
  children: ReactNode
  className?: string
  staggerDelay?: number
}

export function StaggeredList({ children, className = '', staggerDelay = 100 }: StaggeredListProps) {
  const childArray = React.Children.toArray(children)

  return (
    <div className={cn('space-y-4', className)}>
      {childArray.map((child, index) => (
        <div
          key={index}
          className="animate-slide-up"
          style={{ animationDelay: `${index * staggerDelay}ms` }}
        >
          {child}
        </div>
      ))}
    </div>
  )
}

import React from 'react'