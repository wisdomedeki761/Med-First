'use client';

import { useState, useEffect, useCallback } from 'react';
import { Mic, MicOff, Send, StopCircle, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';

interface VoiceInputProps {
  onSubmit: (text: string) => Promise<void>;
  isLoading: boolean;
}

export function VoiceInput({ onSubmit, isLoading }: VoiceInputProps) {
  const [editText, setEditText] = useState('');
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const {
    transcript,
    finalTranscript,
    isListening,
    isSupported,
    startListening,
    stopListening,
    resetTranscript,
    error,
  } = useSpeechRecognition();

  useEffect(() => {
    if (finalTranscript && !hasSubmitted && !isListening) {
      setEditText(finalTranscript);
      setHasSubmitted(true);
      setIsProcessing(true);
    }
  }, [finalTranscript, isListening, hasSubmitted]);

  useEffect(() => {
    if (isProcessing && !isListening && editText) {
      // Small delay to show processing state
      const timer = setTimeout(() => setIsProcessing(false), 500);
      return () => clearTimeout(timer);
    }
  }, [isProcessing, isListening, editText]);

  const handleToggleListening = useCallback(() => {
    if (isListening) {
      stopListening();
    } else {
      resetTranscript();
      setHasSubmitted(false);
      setIsProcessing(false);
      startListening();
    }
  }, [isListening, startListening, stopListening, resetTranscript]);

  const handleSubmit = useCallback(async () => {
    if (editText.trim() && !isLoading && !isProcessing) {
      await onSubmit(editText);
      setEditText('');
      setHasSubmitted(false);
      resetTranscript();
    }
  }, [editText, isLoading, isProcessing, onSubmit, resetTranscript]);

  if (!isSupported) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <MicOff size={48} className="text-white/30 mb-4" aria-hidden="true" />
        <p className="text-white/60 text-lg">Voice input is not supported</p>
        <p className="text-white/40 text-sm mt-2">Try using Chrome, Edge, or Safari</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center w-full max-w-lg mx-auto">
      {/* Status display */}
      <div className="w-full mb-4" role="status" aria-live="polite">
        {isListening && (
          <div className="flex items-center justify-center gap-2 py-3 text-red-400 animate-pulse">
            <div className="flex gap-1" aria-hidden="true">
              <span
                className="w-3 h-3 bg-red-500 rounded-full animate-bounce"
                style={{ animationDelay: '0ms' }}
              />
              <span
                className="w-3 h-3 bg-red-500 rounded-full animate-bounce"
                style={{ animationDelay: '150ms' }}
              />
              <span
                className="w-3 h-3 bg-red-500 rounded-full animate-bounce"
                style={{ animationDelay: '300ms' }}
              />
            </div>
            <span className="font-medium text-lg">Listening...</span>
          </div>
        )}

        {isProcessing && (
          <div className="flex items-center justify-center gap-2 py-3 text-amber-400">
            <Sparkles size={20} className="animate-spin" aria-hidden="true" />
            <span className="font-medium">Processing your voice...</span>
          </div>
        )}

        {isLoading && !isProcessing && (
          <div className="flex items-center justify-center gap-2 py-3 text-white/60">
            <Sparkles size={20} className="animate-spin" aria-hidden="true" />
            <span className="font-medium">Analysing your emergency...</span>
          </div>
        )}

        {!isListening && !isProcessing && !isLoading && (
          <p className="center text-white/50 py-2 text-lg">
            {editText ? 'Review your message' : 'Tap to speak your emergency'}
          </p>
        )}
      </div>

      {/* Transcript preview */}
      {(editText || transcript) && (
        <div className="w-full mb-4">
          <label htmlFor="voice-transcript" className="sr-only">
            Your message
          </label>
          <textarea
            id="voice-transcript"
            value={isListening ? (transcript || editText) : editText}
            onChange={(e) => setEditText(e.target.value)}
            placeholder="Your message will appear here..."
            className={cn(
              'w-full min-h-[100px] p-4 rounded-xl',
              'bg-black/50 backdrop-blur-xl',
              'border border-white/15',
              'text-white text-lg leading-relaxed',
              'placeholder:text-white/30',
              'focus:outline-none focus:border-white/30',
              'resize-none touch-manipulation'
            )}
            disabled={isListening || isProcessing || isLoading}
            aria-describedby="transcript-hint"
          />
          <p id="transcript-hint" className="sr-only">
            You can edit your message before sending
          </p>
        </div>
      )}

      {/* Mic button - large touch target for emergency use */}
      <button
        onClick={handleToggleListening}
        disabled={isProcessing || isLoading}
        className={cn(
          'relative w-28 h-28 rounded-full',
          'flex items-center justify-center',
          'transition-all duration-300',
          'mb-4',
          'touch-manipulation',
          isListening
            ? 'bg-red-500/20 border-2 border-red-500 animate-pulse'
            : 'bg-white/10 border border-white/20 hover:bg-white/20 active:scale-95'
        )}
        aria-label={isListening ? 'Stop listening' : 'Start voice input'}
        aria-pressed={isListening}
      >
        {isListening ? (
          <>
            <div className="absolute inset-0 rounded-full bg-red-500/30 animate-ping" />
            <Mic size={48} className="text-red-500 relative z-10" aria-hidden="true" />
          </>
        ) : (
          <Mic size={48} className="text-white/70" aria-hidden="true" />
        )}
      </button>

      {/* Error message */}
      {error && (
        <div className="w-full p-4 rounded-lg bg-red-500/10 border border-red-500/30 mb-4" role="alert">
          <p className="text-red-400 text-sm text-center">{error}</p>
        </div>
      )}

      {/* Send button */}
      {editText && !isListening && !isProcessing && (
        <button
          onClick={handleSubmit}
          disabled={isLoading || !editText.trim()}
          className={cn(
            'flex items-center gap-3 px-10 py-4 rounded-xl',
            'bg-white text-black font-semibold',
            'min-h-[56px] touch-manipulation',
            'hover:bg-white/90 transition-colors',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            'active:scale-95'
          )}
          aria-label="Send message"
        >
          {isLoading ? (
            <>
              <StopCircle size={22} className="animate-spin" aria-hidden="true" />
              Processing...
            </>
          ) : (
            <>
              <Send size={22} aria-hidden="true" />
              Send
            </>
          )}
        </button>
      )}
    </div>
  );
}