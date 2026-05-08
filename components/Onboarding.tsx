'use client';

import { useEffect, useState } from 'react';
import { Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface OnboardingProps {
  onSelectScenario: (text: string) => void;
  hasMessages: boolean;
}

const EXAMPLE_SCENARIOS = [
  {
    emoji: '🤕',
    text: 'Someone fell and may have broken their wrist',
  },
  {
    emoji: '🔥',
    text: 'Minor burn from hot water',
  },
  {
    emoji: '😮',
    text: 'Child swallowed small object, seems fine',
  },
];

export function Onboarding({ onSelectScenario, hasMessages }: OnboardingProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!hasMessages) {
      // Small delay for smooth entrance
      const timer = setTimeout(() => setIsVisible(true), 300);
      return () => clearTimeout(timer);
    }
  }, [hasMessages]);

  if (hasMessages) return null;

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center h-full py-20 text-center transition-all duration-500',
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      )}
    >
      <div className="w-20 h-20 rounded-2xl bg-white/5 flex items-center justify-center mb-4">
        <Sparkles size={40} className="text-white/40" />
      </div>

      <h2 className="text-xl font-semibold text-white mb-2">
        How can I help you?
      </h2>
      <p className="text-white/50 text-sm max-w-md mb-6">
        Describe your emergency situation and I will provide guidance.
      </p>

      <div className="space-y-3 max-w-md w-full">
        <p className="text-xs text-white/40 uppercase tracking-wider mb-2">
          Or try an example:
        </p>
        {EXAMPLE_SCENARIOS.map((scenario, index) => (
          <button
            key={index}
            onClick={() => onSelectScenario(scenario.text)}
            className={cn(
              'w-full p-4 rounded-xl text-left transition-all duration-200',
              'bg-white/5 border border-white/10 hover:bg-white/10',
              'hover:border-white/20 hover:scale-[1.02]'
            )}
          >
            <span className="text-lg mr-3">{scenario.emoji}</span>
            <span className="text-white/80 text-sm">{scenario.text}</span>
          </button>
        ))}
      </div>

      <p className="text-white/30 text-xs mt-8 max-w-sm">
        Med-First provides guidance only. Always seek professional medical care.
      </p>
    </div>
  );
}