'use client';

import { useState, useCallback, useRef } from 'react';

interface TriageResponse {
  severity: string;
  steps: string[];
  watch_for: string[];
  reassurance: string;
  what_i_see?: string | null;
  call_emergency?: boolean;
}

interface SpeechSynthesis {
  speak: (text: string) => void;
  stop: () => void;
  isSpeaking: boolean;
  isSupported: boolean;
}

export function useSpeechSynthesis(): SpeechSynthesis {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const isSupported = typeof window !== 'undefined' && 'speechSynthesis' in window;

  const speak = useCallback((text: string) => {
    if (!isSupported) return;

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;
    utterance.lang = 'en-US';

    // Prefer Google UK English Female for calm, clear voice
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(
      voice => voice.name.includes('Google UK English Female') ||
               voice.name.includes('British') ||
               voice.name.includes('UK English')
    );

    if (preferredVoice) {
      utterance.voice = preferredVoice;
    } else {
      // Fallback to any English female voice
      const englishFemale = voices.find(
        voice => voice.lang.startsWith('en') && voice.name.toLowerCase().includes('female')
      );
      if (englishFemale) {
        utterance.voice = englishFemale;
      }
    }

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => {
      setIsSpeaking(false);
      utteranceRef.current = null;
    };
    utterance.onerror = () => {
      setIsSpeaking(false);
      utteranceRef.current = null;
    };

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  }, [isSupported]);

  const stop = useCallback(() => {
    if (isSupported) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      utteranceRef.current = null;
    }
  }, [isSupported]);

  return { speak, stop, isSpeaking, isSupported };
}

export function speakTriageResponse(triage: TriageResponse): string {
  let text = '';

  // Critical urgency indicator
  if (triage.severity === 'Critical') {
    text += 'CRITICAL EMERGENCY. ';
  }

  // What AI sees (if applicable)
  if (triage.what_i_see) {
    text += `I see: ${triage.what_i_see}. `;
  }

  // Call emergency first for critical/urgent
  if (triage.call_emergency) {
    text += 'Please call emergency services immediately. ';
  }

  // Steps to follow
  if (triage.steps && triage.steps.length > 0) {
    text += 'Here are the steps to follow: ';
    triage.steps.forEach((step, index) => {
      text += `Step ${index + 1}: ${step}. `;
    });
  }

  // Watch for warning signs
  if (triage.watch_for && triage.watch_for.length > 0) {
    text += 'Watch for these warning signs: ';
    triage.watch_for.forEach((warning, index) => {
      text += `${warning}. `;
    });
  }

  // Reassurance
  if (triage.reassurance) {
    text += triage.reassurance;
  }

  return text;
}