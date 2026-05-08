'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useState, ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface PageTransitionProps {
  children: ReactNode
}

export function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname()
  const [isAnimating, setIsAnimating] = useState(false)
  const [displayLocation, setDisplayLocation] = useState(pathname)

  useEffect(() => {
    if (pathname !== displayLocation) {
      setIsAnimating(true)
    }
  }, [pathname, displayLocation])

  const onAnimationEnd = () => {
    setIsAnimating(false)
    setDisplayLocation(pathname)
  }

  return (
    <div className="relative">
      {isAnimating && (
        <div
          className="absolute inset-0 z-0"
          style={{
            animation: `exit 300ms ease-out forwards`,
          }}
        >
          {children}
        </div>
      )}

      <div
        className={cn(
          'transition-all duration-300',
          isAnimating ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'
        )}
        onAnimationEnd={onAnimationEnd}
      >
        {children}
      </div>
    </div>
  )
}

const exitAnimation = `
  @keyframes exit {
    from {
      opacity: 1;
      transform: translateX(0);
    }
    to {
      opacity: 0;
      transform: translateX(-20px);
    }
  }
`

// Slide page transition component
export function SlidePageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname()
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) return null

  return (
    <div
      className="animate-slide-up"
      style={{ animationDelay: '100ms' }}
    >
      {children}
    </div>
  )
}

// Fade in on mount
export function FadeInOnMount({ children }: { children: ReactNode }) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 50)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div
      className={cn(
        'transition-all duration-500 ease-out',
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      )}
    >
      {children}
    </div>
  )
}