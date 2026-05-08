'use client';

import { useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { MessageBubble } from './MessageBubble';
import type { Message } from '@/lib/types';

interface ChatWindowProps {
  messages: Message[];
  isLoading: boolean;
  showSpeakButton?: boolean;
  children?: React.ReactNode;
}

export function ChatWindow({ messages, isLoading, showSpeakButton, children }: ChatWindowProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  return (
    <div
      ref={scrollRef}
      className={cn(
        'flex-1 overflow-y-auto p-4 space-y-4 pb-32',
        'scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent',
        'touch-manipulation'
      )}
    >
      {/* Onboarding / Empty State */}
      {messages.length === 0 && children}

      {messages.length === 0 && !children && (
        <div className="flex flex-col items-center justify-center h-full py-20 text-center">
          <div className="w-20 h-20 rounded-2xl bg-white/5 flex items-center justify-center mb-4">
            <svg
              className="w-10 h-10 text-white/40"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-white mb-2">
            How can I help you?
          </h2>
          <p className="text-white/50 text-sm max-w-md">
            Describe your emergency situation and I will provide guidance.
          </p>
        </div>
      )}

      {/* Messages */}
      {messages.length > 0 && (
        <>
          {messages.map((message, index) => (
            <MessageBubble
              key={message.id}
              message={message}
              index={index}
              showSpeakButton={showSpeakButton}
            />
          ))}

          {/* Loading indicator */}
          {isLoading && (
            <div className="flex justify-start" role="status" aria-live="polite">
              <div className="glass-gray rounded-2xl px-4 py-3 flex items-center gap-2 border border-white/10">
                <div className="flex gap-1" aria-hidden="true">
                  <span
                    className="w-2 h-2 bg-white/50 rounded-full animate-bounce"
                    style={{ animationDelay: '0ms' }}
                  />
                  <span
                    className="w-2 h-2 bg-white/50 rounded-full animate-bounce"
                    style={{ animationDelay: '150ms' }}
                  />
                  <span
                    className="w-2 h-2 bg-white/50 rounded-full animate-bounce"
                    style={{ animationDelay: '300ms' }}
                  />
                </div>
                <span className="text-sm text-white/60">Gemma 4 is analysing...</span>
              </div>
            </div>
          )}
        </>
      )}

      <div ref={scrollRef} />
    </div>
  );
}