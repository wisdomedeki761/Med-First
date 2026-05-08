'use client';

import { Mic, MessageSquare, Camera, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ModeSelectorProps {
  activeMode: 'text' | 'voice' | 'camera';
  onModeChange: (mode: 'text' | 'voice' | 'camera') => void;
}

const modes = [
  {
    id: 'text' as const,
    label: 'Text',
    icon: MessageSquare,
    description: 'Type your emergency',
  },
  {
    id: 'voice' as const,
    label: 'Voice',
    icon: Mic,
    description: 'Speak hands-free',
  },
  {
    id: 'camera' as const,
    label: 'Camera',
    icon: Camera,
    description: 'Show the situation',
  },
];

export function ModeSelector({ activeMode, onModeChange }: ModeSelectorProps) {
  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="glass-gray rounded-2xl p-1.5">
        <div className="grid grid-cols-3 gap-1">
          {modes.map((mode) => {
            const Icon = mode.icon;
            const isActive = activeMode === mode.id;

            return (
              <button
                key={mode.id}
                onClick={() => onModeChange(mode.id)}
                className={cn(
                  'group relative flex flex-col items-center justify-center gap-1.5 p-3 sm:p-4 rounded-xl',
                  'min-h-[64px] touch-manipulation',
                  'transition-all duration-300 ease-out',
                  'border-2',
                  isActive
                    ? 'border-white/30 bg-white/10 shadow-lg'
                    : 'border-transparent hover:border-white/10 hover:bg-white/5',
                  'focus:outline-none focus:ring-2 focus:ring-white/20'
                )}
                aria-pressed={isActive}
                aria-label={`${mode.label} mode: ${mode.description}`}
              >
                {/* Active indicator */}
                {isActive && (
                  <div className="absolute inset-0 rounded-xl overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-10 h-1 bg-white/40 rounded-full" />
                  </div>
                )}

                {/* Icon container */}
                <div
                  className={cn(
                    'relative p-2.5 rounded-lg transition-all duration-300',
                    'shadow-lg',
                    isActive
                      ? 'bg-gradient-to-br from-white/20 to-white/10 text-white shadow-white/10'
                      : 'bg-gradient-to-br from-white/10 to-white/5 text-white/70 group-hover:from-white/15 group-hover:to-white/10'
                  )}
                  style={{
                    transform: isActive ? 'scale(1.05)' : 'scale(1)',
                  }}
                >
                  <Icon
                    size={20}
                    className={cn(
                      'transition-transform duration-300',
                      'group-hover:scale-110'
                    )}
                    aria-hidden="true"
                  />
                </div>

                {/* Text */}
                <div className="text-center z-10">
                  <span className={cn(
                    'block font-medium text-xs sm:text-sm transition-colors duration-300',
                    isActive ? 'text-white' : 'text-white/70 group-hover:text-white'
                  )}>
                    {mode.label}
                  </span>
                </div>

                {/* Sparkle on active */}
                {isActive && (
                  <Sparkles
                    size={12}
                    className="absolute top-2 left-2 text-white/40 animate-pulse"
                    aria-hidden="true"
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}