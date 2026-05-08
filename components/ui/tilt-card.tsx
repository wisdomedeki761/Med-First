'use client'

import { useRef, useState, useCallback, useEffect, ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface TiltCardProps {
  children: ReactNode
  className?: string
  tiltStrength?: number
  resetSpeed?: number
  glare?: boolean
}

export function TiltCard({
  children,
  className = '',
  tiltStrength = 10,
  resetSpeed = 400,
  glare = true,
}: TiltCardProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const [isHovered, setIsHovered] = useState(false)

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!containerRef.current) return

    const rect = containerRef.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2

    const mouseX = e.clientX - centerX
    const mouseY = e.clientY - centerY

    const x = (mouseX / rect.width) * tiltStrength
    const y = (mouseY / rect.height) * tiltStrength

    setTilt({ x, y })
  }, [tiltStrength])

  const handleMouseLeave = useCallback(() => {
    setTilt({ x: 0, y: 0 })
    setIsHovered(false)
  }, [])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    container.addEventListener('mousemove', handleMouseMove as EventListener)
    container.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      container.removeEventListener('mousemove', handleMouseMove as EventListener)
      container.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [handleMouseMove, handleMouseLeave])

  return (
    <div
      ref={containerRef}
      className={cn(
        'relative perspective-1000',
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
    >
      {/* Glare effect */}
      {glare && isHovered && (
        <div
          className="pointer-events-none absolute inset-0 rounded-xl overflow-hidden"
          style={{
            background: `radial-gradient(
              circle at ${50 + tilt.x * 10}% ${50 + tilt.y * 10}%,
              rgba(255, 255, 255, 0.1) 0%,
              transparent 60%
            )`,
          }}
        />
      )}

      {/* 3D transformed card */}
      <div
        className="transition-transform duration-200 ease-out"
        style={{
          transform: `perspective(1000px) rotateX(${tilt.y}deg) rotateY(${-tilt.x}deg) scale3d(${isHovered ? 1.02 : 1}, ${isHovered ? 1.02 : 1}, ${isHovered ? 1.02 : 1})`,
          transformStyle: 'preserve-3d',
        }}
      >
        {children}
      </div>

      {/* Shadow */}
      <div
        className="pointer-events-none absolute -bottom-4 left-1/2 -translate-x-1/2 w-full h-full rounded-xl bg-black/20 blur-xl transition-all duration-200"
        style={{
          transform: `translateZ(-50px) translateX(${-tilt.x * 2}px) translateY(${tilt.y * 2}px)`,
        }}
      />
    </div>
  )
}