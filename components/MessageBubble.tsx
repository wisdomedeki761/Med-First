'use client';

import { format } from 'date-fns';
import { Sparkles, User, AlertTriangle, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { TriageCard } from './TriageCard';
import { PulseGlow } from '@/components/ui/animations';
import type { Message } from '@/lib/types';

interface MessageBubbleProps {
  message: Message;
  index: number;
  showSpeakButton?: boolean;
  onRetry?: () => void;
}

export function MessageBubble({ message, showSpeakButton = false, onRetry }: MessageBubbleProps) {
  const isUser = message.role === 'user';
  const showTriage = message.role === 'assistant' && message.triage;
  const showError = message.role === 'assistant' && !message.triage && message.content?.includes('error');

  const getProviderLabel = () => {
    if (!message.provider) return 'Gemma 4';
    if (message.provider === 'gemini') return 'Gemma 4 · Gemini API';
    return 'Gemma 4 31B · OpenRouter';
  };

  return (
    <div className={cn('flex w-full mb-3 sm:mb-4', isUser ? 'justify-end' : 'justify-start')}>
      {!isUser && message.role === 'assistant' && !message.content && !showTriage && (
        <PulseGlow color="white">
          <div className="glass-gray rounded-xl px-4 py-3 flex items-center gap-2 border border-white/10 max-w-[85%]">
            <div className="flex gap-1.5">
              <span className="w-2 h-2 bg-white/50 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-2 h-2 bg-white/50 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-2 h-2 bg-white/50 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
            <span className="text-sm text-white/60">Gemma 4 is analysing...</span>
          </div>
        </PulseGlow>
      )}

      {(message.content || showTriage || showError) && (
        <div className={cn('flex max-w-[90%] sm:max-w-[75%]', isUser ? 'flex-row-reverse' : 'flex-row')}>
          <div className={cn(
            'flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center',
            isUser
              ? 'bg-white/20 ml-2 sm:ml-3 border border-white/20'
              : showError
                ? 'bg-red-500/20 border border-red-500/30'
                : 'bg-white/10 mr-2 sm:mr-3 border border-white/10'
          )}>
            {isUser ? (
              <User size={16} className="text-white sm:size-20" />
            ) : showError ? (
              <AlertTriangle size={16} className="text-red-400 sm:size-20" />
            ) : (
              <Sparkles size={16} className="text-white/70 sm:size-20" />
            )}
          </div>

          <div className={cn('flex flex-col', isUser ? 'items-end' : 'items-start')}>
            {/* Error card */}
            {showError && (
              <div className="glass-gray rounded-xl p-3 sm:p-4 border border-red-500/30 max-w-full animate-slide-up">
                <div className="flex items-start gap-2 sm:gap-3">
                  <AlertTriangle size={16} className="text-red-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-white text-sm">{message.content}</p>
                    {onRetry && (
                      <button
                        onClick={onRetry}
                        className="flex items-center gap-2 px-3 py-1.5 mt-2 rounded-lg bg-white/10 text-white/80 hover:bg-white/20 transition-colors text-xs sm:text-sm"
                      >
                        <RefreshCw size={12} />
                        Try Again
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Triage card */}
            {showTriage && (
              <div className="mb-2 animate-slide-up w-full">
                <TriageCard
                  triage={message.triage!}
                  modelProvider={getProviderLabel()}
                />
              </div>
            )}

            {/* Regular text content */}
            {(message.content && !showTriage && !showError) && (
              <div className={cn(
                'relative rounded-xl sm:rounded-2xl px-3 py-2 sm:px-4 sm:py-3 max-w-full',
                'transition-all duration-300',
                isUser
                  ? 'bg-white/20 text-white border border-white/20'
                  : 'bg-black/40 text-white border border-white/10'
              )}>
                {message.imageUrl && (
                  <div className="mb-2">
                    <img
                      src={message.imageUrl}
                      alt="Attached"
                      className="max-w-full rounded-lg border border-white/10"
                    />
                  </div>
                )}
                <p className="text-sm sm:text-base leading-relaxed whitespace-pre-wrap text-white">
                  {message.content}
                </p>
              </div>
            )}

            <span className="text-[10px] sm:text-xs text-white/30 mt-1 px-1">
              {format(new Date(message.timestamp), 'h:mm a')}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}