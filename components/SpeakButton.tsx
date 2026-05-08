'use client';

import { useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSpeechSynthesis, speakTriageResponse } from '@/hooks/useSpeechSynthesis';
import type { TriageResponse } from '@/lib/types';

interface SpeakButtonProps {
  triage: TriageResponse;
  size?: 'sm' | 'md' | 'lg';
}

export function SpeakButton({ triage, size = 'md' }: SpeakButtonProps) {
  const { speak, stop, isSpeaking, isSupported } = useSpeechSynthesis();
  const [showStop, setShowStop] = useState(false);

  const handleClick = () => {
    if (isSpeaking) {
      stop();
      setShowStop(false);
    } else {
      const text = speakTriageResponse(triage);
      speak(text);
      setShowStop(true);
    }
  };

  if (!isSupported) return null;

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
  };

  const iconSizes = {
    sm: 14,
    md: 18,
    lg: 22,
  };

  return (
    <button
      onClick={handleClick}
      onMouseEnter={() => isSpeaking && setShowStop(true)}
      onMouseLeave={() => setShowStop(false)}
      className={cn(
        'rounded-full flex items-center justify-center',
        'transition-all duration-200',
        'bg-white/10 border border-white/20',
        'hover:bg-white/20',
        sizeClasses[size]
      )}
      aria-label={isSpeaking ? 'Stop speaking' : 'Read aloud'}
    >
      {isSpeaking ? (
        <>
          {showStop ? (
            <VolumeX size={iconSizes[size]} className="text-white" />
          ) : (
            <div className="flex items-center gap-0.5">
              <span className="w-0.5 h-3 bg-white rounded-full animate-pulse" />
              <span className="w-0.5 h-4 bg-white rounded-full animate-pulse" style={{ animationDelay: '100ms' }} />
              <span className="w-0.5 h-2 bg-white rounded-full animate-pulse" style={{ animationDelay: '200ms' }} />
            </div>
          )}
        </>
      ) : (
        <Volume2 size={iconSizes[size]} className="text-white/70" />
      )}
    </button>
  );
}