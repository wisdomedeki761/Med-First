'use client'

import { cn } from '@/lib/utils'

interface SeverityBadgeProps {
  severity: 'Critical' | 'Urgent' | 'Stable'
  animated?: boolean
  size?: 'sm' | 'md' | 'lg'
}

const severityConfig = {
  Critical: {
    bg: 'from-red-600 to-red-700',
    border: 'border-red-400/30',
    glow: 'shadow-red-500/30',
    icon: '🚨',
    pulse: true,
  },
  Urgent: {
    bg: 'from-amber-500 to-amber-600',
    border: 'border-amber-400/30',
    glow: 'shadow-amber-500/30',
    icon: '⚠️',
    pulse: false,
  },
  Stable: {
    bg: 'from-gray-500 to-gray-600',
    border: 'border-gray-400/30',
    glow: 'shadow-gray-500/30',
    icon: '✅',
    pulse: false,
  },
}

const sizeClasses = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-3 py-1 text-sm',
  lg: 'px-4 py-1.5 text-base',
}

export function SeverityBadge({
  severity,
  animated = true,
  size = 'md'
}: SeverityBadgeProps) {
  const config = severityConfig[severity]
  const isCritical = severity === 'Critical'

  return (
    <div className="relative inline-flex items-center gap-2">
      {isCritical && animated && (
        <div className="absolute -inset-1 rounded-full animate-pulse-glow">
          <div className="absolute inset-0 rounded-full bg-red-500/30 blur-lg" />
        </div>
      )}

      <span
        className={cn(
          'relative inline-flex items-center gap-1.5 font-bold uppercase tracking-wide',
          'rounded-full',
          'bg-gradient-to-r shadow-lg',
          config.bg,
          config.border,
          config.glow,
          sizeClasses[size],
          'text-white',
          isCritical && animated && 'animate-heartbeat'
        )}
      >
        <span className="text-base leading-none">{config.icon}</span>
        <span>{severity}</span>
        <div className="absolute inset-0 rounded-full overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-shimmer" />
        </div>
      </span>
    </div>
  )
}

export function SeverityPill({ severity }: { severity: 'Critical' | 'Urgent' | 'Stable' }) {
  const colors = {
    Critical: 'bg-red-500/20 text-red-400 border-red-500/30',
    Urgent: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    Stable: 'bg-gray-500/20 text-gray-300 border-gray-500/30',
  }

  return (
    <span className={cn(
      'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border',
      colors[severity]
    )}>
      {severity}
    </span>
  )
}