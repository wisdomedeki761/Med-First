'use client';

import { useState, useRef, useEffect } from 'react';
import { X, Info, PhoneCall, Mic, Camera, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';

export function AboutModal() {
  const [isOpen, setIsOpen] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Focus trap
  useEffect(() => {
    if (isOpen && modalRef.current) {
      modalRef.current.focus();
    }
  }, [isOpen]);

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        aria-label="About Med-First"
        className="p-2 rounded-lg hover:bg-white/10 transition-colors"
      >
        <Info size={20} className="text-white/70" />
      </button>
    );
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={() => setIsOpen(false)}
      />
      <div
        ref={modalRef}
        tabIndex={-1}
        className="relative w-full max-w-md glass-gray rounded-2xl border border-white/10 overflow-hidden animate-slide-up focus:outline-none"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <PhoneCall size={20} className="text-critical" />
            <h2 id="modal-title" className="text-lg font-semibold text-white">
              Med-First
            </h2>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            aria-label="Close"
            className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X size={20} className="text-white/70" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-6 max-h-[70vh] overflow-y-auto">
          {/* Text Mode */}
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-white/10">
              <MessageSquare size={20} className="text-white" />
            </div>
            <div>
              <h3 className="text-white font-medium">Text Mode</h3>
              <p className="text-white/60 text-sm">Type your emergency description</p>
            </div>
          </div>

          {/* Voice Mode */}
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-white/10">
              <Mic size={20} className="text-white" />
            </div>
            <div>
              <h3 className="text-white font-medium">Voice Mode</h3>
              <p className="text-white/60 text-sm">Speak your emergency — responses read aloud</p>
            </div>
          </div>

          {/* Camera Mode */}
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-white/10">
              <Camera size={20} className="text-white" />
            </div>
            <div>
              <h3 className="text-white font-medium">Camera Mode</h3>
              <p className="text-white/60 text-sm">Show the situation for AI analysis</p>
            </div>
          </div>

          {/* Medical Disclaimer */}
          <div className="p-4 rounded-xl bg-critical/10 border border-critical/30">
            <h3 className="text-sm font-semibold text-critical uppercase tracking-wider mb-3">
              Medical Disclaimer
            </h3>
            <p className="text-white text-sm leading-relaxed">
              Med-First provides general guidance only and is not a substitute
              for professional medical care, diagnosis, or treatment. Always
              seek immediate medical attention for life-threatening emergencies.
              In the US, call 911. In the UK, call 999. In the EU, call 112.
            </p>
          </div>

          {/* Challenge Attribution */}
          <p className="text-white/40 text-xs text-center space-y-2">
            <span>Built for the Gemini API Developer Challenge</span>
            <br />
            <span className="flex items-center justify-center gap-4">
              <a href="/disclaimer" className="text-white/50 hover:text-white transition-colors">
                Medical Disclaimer
              </a>
              <span className="text-white/30">•</span>
              <a href="/terms" className="text-white/50 hover:text-white transition-colors">
                Terms of Use
              </a>
            </span>
          </p>
        </div>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-white/10 flex justify-end">
          <button
            onClick={() => setIsOpen(false)}
            className="px-5 py-2 rounded-lg bg-white text-black font-medium hover:bg-white/90 transition-colors"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
}