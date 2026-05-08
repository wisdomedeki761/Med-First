'use client';

import { useState } from 'react';
import { CheckCircle2, AlertTriangle, Eye, Heart, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SeverityBadge } from './SeverityBadge';
import type { TriageResponse } from '@/lib/types';

interface TriageCardProps {
  triage: TriageResponse;
  modelProvider?: string;
}

export function TriageCard({ triage, modelProvider = 'Gemma 4' }: TriageCardProps) {
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());

  const toggleStep = (index: number) => {
    const newCompleted = new Set(completedSteps);
    if (newCompleted.has(index)) {
      newCompleted.delete(index);
    } else {
      newCompleted.add(index);
    }
    setCompletedSteps(newCompleted);
  };

  return (
    <div
      className={cn(
        'w-full max-w-[680px] mx-auto rounded-2xl',
        'bg-white/20 border border-white/20',
        'transition-all duration-300'
      )}
      role="region"
      aria-label={`${triage.severity} emergency guidance`}
    >
      {/* Header Row */}
      <div className="flex items-center justify-between p-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <SeverityBadge severity={triage.severity} />
        </div>
        <div className="flex items-center gap-1.5 text-xs text-white/40">
          <Sparkles size={12} className="text-white/50" aria-hidden="true" />
          <span>{modelProvider}</span>
        </div>
      </div>

      {/* Emergency Call Banner */}
      {triage.call_emergency && (
        <div
          className="relative overflow-hidden bg-red-600 p-4 border-b border-red-400 animate-pulse-slow"
          role="alert"
          aria-live="assertive"
        >
          <div className="absolute inset-0 bg-white/10 animate-shimmer" />
          <div className="relative flex flex-col items-center gap-4">
            <div className="flex items-center gap-2 font-bold text-white text-lg">
              <AlertTriangle size={24} aria-hidden="true" />
              <span>Call Emergency Services Immediately</span>
            </div>
            <div className="flex gap-2 sm:gap-3" role="group" aria-label="Emergency phone numbers">
              <a
                href="tel:911"
                className="px-4 py-3 sm:px-5 sm:py-2.5 bg-white text-red-600 rounded-lg font-bold hover:bg-white/90 transition-colors text-center min-w-[70px] sm:min-w-[80px] touch-manipulation"
                aria-label="Call 911 emergency services (US)"
              >
                📞 911
              </a>
              <a
                href="tel:999"
                className="px-4 py-3 sm:px-5 sm:py-2.5 bg-white/20 text-white rounded-lg font-bold hover:bg-white/30 transition-colors text-center min-w-[70px] sm:min-w-[80px] touch-manipulation"
                aria-label="Call 999 emergency services (UK)"
              >
                999
              </a>
              <a
                href="tel:112"
                className="px-4 py-3 sm:px-5 sm:py-2.5 bg-white/20 text-white rounded-lg font-bold hover:bg-white/30 transition-colors text-center min-w-[70px] sm:min-w-[80px] touch-manipulation"
                aria-label="Call 112 emergency services (EU)"
              >
                112
              </a>
            </div>
          </div>
        </div>
      )}

      {/* What I See */}
      {triage.what_i_see && (
        <div className="p-4 border-b border-white/5">
          <div className="flex gap-3 items-start">
            <Eye className="flex-shrink-0 text-white/50 mt-0.5" size={20} aria-hidden="true" />
            <span className="text-sm text-white/60 italic">
              What I see: {triage.what_i_see}
            </span>
          </div>
        </div>
      )}

      {/* Content */}
      {true && (
        <div className="p-4 space-y-5">
          {/* First Aid Steps */}
          <div>
            <h3 className="text-xs font-semibold text-blue-400 uppercase tracking-wider mb-3 flex items-center gap-2">
              <span className="w-2 h-2 bg-blue-400 rounded-full" aria-hidden="true" />
              Steps to Follow
            </h3>
            <div className="space-y-2" role="list" aria-label="First aid steps">
              {triage.steps.map((step, index) => {
                const isCompleted = completedSteps.has(index);
                return (
                  <button
                    key={index}
                    onClick={() => toggleStep(index)}
                    className={cn(
                      'w-full flex items-start gap-3 p-3 rounded-lg text-left transition-all duration-200',
                      'border border-white/10 min-h-[56px]',
                      'touch-manipulation',
                      isCompleted
                        ? 'bg-green-500/10 border-green-500/30'
                        : 'bg-white/5 border-white/10 hover:bg-white/10'
                    )}
                    role="listitem"
                    aria-pressed={isCompleted}
                    aria-label={`Step ${index + 1}: ${step}${isCompleted ? ' (completed)' : ''}`}
                  >
                    <div
                      className={cn(
                        'flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-all duration-200',
                        isCompleted
                          ? 'bg-green-500 text-white'
                          : 'bg-blue-500/20 text-blue-400'
                      )}
                      aria-hidden="true"
                    >
                      {isCompleted ? (
                        <CheckCircle2 size={18} />
                      ) : (
                        <span className="text-sm font-bold">{index + 1}</span>
                      )}
                    </div>
                    <span
                      className={cn(
                        'flex-1 text-base sm:text-lg leading-relaxed transition-all duration-200 text-white',
                        isCompleted && 'line-through text-white/40'
                      )}
                    >
                      {step}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Watch For */}
          {triage.watch_for.length > 0 && (
            <div>
              <h3 className="text-xs font-semibold text-amber-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                <AlertTriangle size={14} className="text-amber-500" aria-hidden="true" />
                Watch For These Warning Signs
              </h3>
              <div className="space-y-2" role="list" aria-label="Warning signs to watch for">
                {triage.watch_for.map((warning, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 rounded-lg bg-amber-500/5 border-l-2 border-amber-500/30"
                    role="listitem"
                  >
                    <AlertTriangle size={16} className="text-amber-500 flex-shrink-0" aria-hidden="true" />
                    <span className="text-white/80">{warning}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Reassurance */}
          <div className="pt-4 border-t border-white/10">
            <div className="flex items-start gap-3">
              <Heart className="flex-shrink-0 text-white/30 mt-0.5" size={20} aria-hidden="true" />
              <p className="text-white/50 italic">{triage.reassurance}</p>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="px-4 py-3 bg-white/5 border-t border-white/5">
        <p className="text-[10px] text-white/30 text-center leading-relaxed">
          Med-First provides guidance only. Always seek professional medical care.
          In life-threatening emergencies, call 911/999/112 first.
        </p>
      </div>

      <style jsx global>{`
        @media print {
          button[role="listitem"] {
            border: 1px solid #333 !important;
            background: none !important;
          }
          button[role="listitem"]:after {
            content: " [" attr(aria-pressed) "]";
            display: none;
          }
        }
      `}</style>
    </div>
  );
}

const expanded = true;