'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Mic, MessageSquare, Camera, Heart, Phone, FileText, Shield } from 'lucide-react'
import { cn } from '@/lib/utils'
import { HoverLift, Float, FadeIn } from '@/components/ui/animations'

export default function Home() {
  const router = useRouter()

  const modes = [
    {
      id: 'text',
      label: 'Text',
      icon: MessageSquare,
      description: 'Type your emergency',
      color: 'from-white/20 to-white/10',
    },
    {
      id: 'voice',
      label: 'Voice',
      icon: Mic,
      description: 'Speak hands-free',
      color: 'from-white/20 to-white/10',
    },
    {
      id: 'camera',
      label: 'Camera',
      icon: Camera,
      description: 'Show the situation',
      color: 'from-white/20 to-white/10',
    },
  ] as const

  const handleModeSelect = (mode: 'text' | 'voice' | 'camera') => {
    router.push(`/chat?mode=${mode}`)
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-start pt-16 pb-8 px-4 sm:px-6 relative overflow-hidden bg-black">
      {/* Video Background */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src="/video_1105953_1778238004.mp4" type="video/mp4" />
      </video>

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/80" />

      {/* Ambient effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '1.5s' }} />
      </div>

      <div className="w-full max-w-4xl relative z-10 flex flex-col items-center">
        <FadeIn delay={0}>
          <div className="text-center mb-8 sm:mb-10">
            <Float duration={4}>
              <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-critical to-critical/70 shadow-critical/30 shadow-lg mb-4 sm:mb-6">
                <Heart className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
              </div>
            </Float>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-2">
              Med-First
            </h1>
            <p className="text-lg sm:text-xl font-medium text-white/80 mb-1">
              Powered by{' '}
              <span className="text-white font-bold">Google Gemma 4</span>
            </p>
            <p className="text-white/50 text-sm sm:text-base">
              Multimodal AI for Emergency First Aid Guidance
            </p>
          </div>
        </FadeIn>

        <FadeIn delay={200}>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5 mb-8">
            {modes.map((mode) => {
              const Icon = mode.icon

              return (
                <HoverLift key={mode.id} scale={1.02}>
                  <button
                    onClick={() => handleModeSelect(mode.id)}
                    className={cn(
                      'relative w-full p-5 sm:p-6 rounded-2xl',
                      'glass-gray border border-white/10',
                      'transition-all duration-300',
                      'hover:border-white/25 hover:bg-white/10',
                      'flex flex-col items-center gap-3',
                      'group'
                    )}
                  >
                    <div className={cn(
                      'absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300',
                      'bg-gradient-to-br from-white/5 to-transparent',
                      'group-hover:opacity-100'
                    )} />

                    <div
                      className={cn(
                        'relative p-3 rounded-xl',
                        'bg-gradient-to-br shadow-lg border border-white/20',
                        'transition-transform duration-300',
                        'from-white/20 to-white/10',
                        'group-hover:scale-110 group-hover:-translate-y-1'
                      )}
                    >
                      <Icon size={24} className="text-white" />
                    </div>

                    <div className="text-center z-10">
                      <span className="block font-semibold text-base sm:text-lg text-white">
                        {mode.label}
                      </span>
                      <span className="block text-xs sm:text-sm text-white/50 mt-1">
                        {mode.description}
                      </span>
                    </div>
                  </button>
                </HoverLift>
              )
            })}
          </div>
        </FadeIn>

        <FadeIn delay={400}>
          <div className="text-center mb-6">
            <a
              href="tel:911"
              className={cn(
                'inline-flex items-center gap-2',
                'px-5 py-2.5 rounded-full',
                'bg-gradient-to-br from-critical to-critical/70',
                'text-white font-bold text-sm sm:text-base',
                'shadow-lg shadow-critical/30',
                'transition-all duration-300',
                'hover:shadow-xl hover:shadow-critical/50',
                'hover:scale-105 active:scale-95'
              )}
            >
              <Phone size={18} />
              <span>Call Emergency Services (911)</span>
            </a>
          </div>
        </FadeIn>

        <FadeIn delay={500}>
          <div className="flex flex-wrap justify-center gap-3 mb-6">
            <a
              href="/disclaimer"
              className={cn(
                'inline-flex items-center gap-2',
                'px-4 py-2 rounded-full',
                'glass-gray border border-white/10',
                'text-white/70 text-xs font-medium',
                'transition-all duration-300',
                'hover:bg-white/10 hover:text-white hover:border-white/20'
              )}
            >
              <Shield size={14} />
              <span>Medical Disclaimer</span>
            </a>
            <a
              href="/terms"
              className={cn(
                'inline-flex items-center gap-2',
                'px-4 py-2 rounded-full',
                'glass-gray border border-white/10',
                'text-white/70 text-xs font-medium',
                'transition-all duration-300',
                'hover:bg-white/10 hover:text-white hover:border-white/20'
              )}
            >
              <FileText size={14} />
              <span>Terms of Use</span>
            </a>
          </div>
        </FadeIn>

        <FadeIn delay={600}>
          <p className="text-center text-white/30 text-xs max-w-md mx-auto px-4">
            Med-First guides you until help arrives. Always call emergency services
            for life-threatening emergencies.
          </p>
        </FadeIn>
      </div>
    </main>
  )
}