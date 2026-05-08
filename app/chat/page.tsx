'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { ArrowLeft, Phone, PhoneCall, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ModeSelector } from '@/components/ModeSelector';
import { ChatWindow } from '@/components/ChatWindow';
import { TextInput } from '@/components/TextInput';
import { VoiceInput } from '@/components/VoiceInput';
import { CameraCapture } from '@/components/CameraCapture';
import { triageEmergency } from '@/actions/action';
import { useSpeechSynthesis, speakTriageResponse } from '@/hooks/useSpeechSynthesis';
import { AboutModal } from '@/components/AboutModal';
import { Onboarding } from '@/components/Onboarding';
import { OfflineBanner, useOnlineStatus } from '@/components/ErrorCard';
import type { Message, ChatState } from '@/lib/types';

const SESSION_KEY = 'Med-First_session';

export default function ChatPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const isOnline = useOnlineStatus();

  const [activeMode, setActiveMode] = useState<ChatState['activeMode']>(
    (searchParams.get('mode') as 'text' | 'voice' | 'camera') || 'text'
  );

  const [chatState, setChatState] = useState<ChatState>({
    messages: [],
    isLoading: false,
    error: null,
    activeMode,
  });

  const [autoReadEnabled, setAutoReadEnabled] = useState(true);
  const { speak, stop, isSpeaking } = useSpeechSynthesis();
  const lastTriageRef = useRef<string | null>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Camera mode state
  const [pendingImage, setPendingImage] = useState<{
    base64: string;
    mimeType: string;
    dataUrl: string;
  } | null>(null);

  // Session persistence
  useEffect(() => {
    const saved = sessionStorage.getItem(SESSION_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.messages && Array.isArray(parsed.messages)) {
          const messages = parsed.messages.map((m: any) => ({
            ...m,
            timestamp: new Date(m.timestamp),
          }));
          setChatState((prev) => ({ ...prev, messages }));
        }
      } catch (e) {
        console.error('Failed to load session:', e);
      }
    }
  }, []);

  useEffect(() => {
    if (chatState.messages.length > 0) {
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(chatState));
    }
  }, [chatState.messages]);

  const clearSession = useCallback(() => {
    sessionStorage.removeItem(SESSION_KEY);
    setChatState({
      messages: [],
      isLoading: false,
      error: null,
      activeMode,
    });
    setPendingImage(null);
  }, [activeMode]);

  // Auto-speak when receiving triage response
  useEffect(() => {
    const messages = chatState.messages;
    if (messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.role === 'assistant' && lastMessage.triage) {
        const triageKey = `${lastMessage.id}-${lastMessage.triage.severity}`;
        if (triageKey !== lastTriageRef.current && autoReadEnabled) {
          lastTriageRef.current = triageKey;
          const text = speakTriageResponse(lastMessage.triage);
          setTimeout(() => speak(text), 500);
        }
      }
    }
  }, [chatState.messages, autoReadEnabled, speak]);

  // Stop speaking when leaving voice mode
  useEffect(() => {
    if (activeMode !== 'voice') {
      stop();
    }
  }, [activeMode, stop]);

  const handleSend = useCallback(async (text: string, imageBase64?: string) => {
    setTimeout(() => inputRef.current?.focus(), 100);

    const finalImage = imageBase64 || pendingImage?.base64;
    const finalMimeType = finalImage ? (imageBase64 ? 'image/jpeg' : pendingImage?.mimeType) : undefined;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      triage: null,
      imageUrl: finalImage ? `data:image/jpeg;base64,${finalImage}` : null,
      timestamp: new Date(),
      mode: activeMode,
    };

    setChatState((prev) => ({
      ...prev,
      messages: [...prev.messages, userMessage],
      isLoading: true,
      error: null,
    }));

    const result = await triageEmergency({
      messages: chatState.messages,
      userText: text,
      imageBase64: finalImage,
      imageMimeType: finalMimeType,
    });

    if (result.success && result.triage) {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: result.triage.reassurance,
        triage: result.triage,
        imageUrl: null,
        timestamp: new Date(),
        mode: activeMode,
        provider: result.provider || undefined,
        model: result.model || undefined,
      };

      setChatState((prev) => ({
        ...prev,
        messages: [...prev.messages, assistantMessage],
        isLoading: false,
      }));
    } else {
      setChatState((prev) => ({
        ...prev,
        isLoading: false,
        error: result.error || 'An error occurred',
      }));
    }

    setPendingImage(null);
  }, [chatState.messages, activeMode, pendingImage]);

  const handleCameraSend = useCallback(async (text: string) => {
    await handleSend(text, pendingImage?.base64);
  }, [handleSend, pendingImage]);

  const handleScenarioSelect = useCallback((text: string) => {
    handleSend(text);
  }, [handleSend]);

  const getModeLabel = () => {
    const labels: Record<string, string> = {
      text: 'Text Mode',
      voice: 'Voice Mode',
      camera: 'Camera Mode',
    };
    return labels[activeMode] || activeMode;
  };

  return (
    <div className="min-h-screen flex flex-col bg-black relative overflow-hidden touch-manipulation">
      <style jsx global>{`
        @media (max-width: 768px) {
          input, textarea, select, button {
            font-size: 16px !important;
            touch-action: manipulation;
          }
        }
      `}</style>

      <OfflineBanner />

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-gray-900/30 via-black to-gray-900/20" />
        <div className="absolute -top-20 -left-20 w-64 h-64 bg-white/3 rounded-full blur-3xl animate-float" />
        <div className="absolute top-1/3 -right-20 w-56 h-56 bg-white/2 rounded-full blur-3xl animate-float" style={{ animationDelay: '1.5s' }} />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Header - Fixed at top */}
        <div className="fixed top-0 left-0 right-0 z-50 glass-gray border-b border-white/10">
          <div className="flex items-center justify-between px-4 py-3 max-w-4xl mx-auto">
            <div className="flex items-center gap-3">
              <button
                onClick={() => router.push('/')}
                className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                aria-label="Go back"
              >
                <ArrowLeft size={20} className="text-white/70" />
              </button>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-critical to-critical/70 flex items-center justify-center">
                  <PhoneCall size={16} className="text-white" />
                </div>
                <span className="font-semibold text-white hidden sm:inline">Med-First</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5">
                <span className="text-xs text-white/50 capitalize">{getModeLabel()}</span>
              </div>

              <AboutModal />

              <button
                onClick={clearSession}
                className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                aria-label="Clear session"
              >
                <Trash2 size={18} className="text-white/50" />
              </button>

              <a
                href="tel:911"
                className={cn(
                  'flex items-center gap-1.5 px-3 py-2 rounded-full',
                  'bg-gradient-to-br from-critical to-critical/70',
                  'text-white font-bold text-xs sm:text-sm',
                  'shadow-lg shadow-critical/30',
                  'transition-all duration-300',
                  'hover:shadow-xl hover:shadow-critical/50 hover:scale-105'
                )}
                aria-label="Call 911 emergency services"
              >
                <Phone size={14} className="sm:size-16" />
                <span className="hidden sm:inline">911</span>
              </a>
            </div>
          </div>

          <div className="px-2 pb-2">
            <ModeSelector activeMode={activeMode} onModeChange={(mode) => {
              setActiveMode(mode);
              setPendingImage(null);
            }} />
          </div>
        </div>

        {/* Chat Area */}
        <div className={cn(
          'flex-1 overflow-hidden',
          activeMode === 'voice' ? 'text-lg' : ''
        )}>
          <ChatWindow
            messages={chatState.messages}
            isLoading={chatState.isLoading}
          >
            <Onboarding
              hasMessages={chatState.messages.length > 0}
              onSelectScenario={handleScenarioSelect}
            />
          </ChatWindow>
        </div>

        {/* Input Area - Fixed at bottom */}
        <div className="fixed bottom-0 left-0 right-0 p-4 space-y-4 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
          {chatState.error && (
            <div className="p-3 rounded-xl bg-red-500/20 border border-red-500/30 text-red-200 text-sm">
              {chatState.error}
            </div>
          )}

          {activeMode === 'voice' ? (
            <div className="flex flex-col items-center">
              {autoReadEnabled && (
                <div className="flex items-center gap-2 mb-3 px-4 py-2 rounded-full bg-white/5 border border-white/10">
                  <span className="text-xs text-white/60">Responses read aloud</span>
                  <button
                    onClick={() => setAutoReadEnabled(false)}
                    className="text-xs text-white/40 hover:text-white/60"
                  >
                    Disable
                  </button>
                </div>
              )}
              <VoiceInput onSubmit={handleSend} isLoading={chatState.isLoading} />
            </div>
          ) : activeMode === 'camera' ? (
            <CameraInputWrapper
              pendingImage={pendingImage}
              onImageCaptured={setPendingImage}
              onClear={() => setPendingImage(null)}
              onSend={handleCameraSend}
              isLoading={chatState.isLoading}
              inputRef={inputRef}
            />
          ) : (
            <TextInput
              onSend={handleSend}
              isLoading={chatState.isLoading}
              inputRef={inputRef}
            />
          )}
        </div>
      </div>
    </div>
  );
}

// Camera mode input wrapper
function CameraInputWrapper({
  pendingImage,
  onImageCaptured,
  onClear,
  onSend,
  isLoading,
  inputRef,
}: {
  pendingImage: { dataUrl: string } | null;
  onImageCaptured: (img: { base64: string; mimeType: string; dataUrl: string }) => void;
  onClear: () => void;
  onSend: (text: string) => void;
  isLoading: boolean;
  inputRef?: React.RefObject<HTMLTextAreaElement | null>;
}) {
  const [text, setText] = useState('');

  const handleSubmit = () => {
    const finalText = text.trim() || 'Please analyse this situation and provide first aid guidance.';
    onSend(finalText);
    setText('');
  };

  return (
    <div className="w-full max-w-lg mx-auto space-y-4">
      <CameraCapture
        onImageCaptured={onImageCaptured}
        onClear={onClear}
        existingImage={pendingImage ? pendingImage.dataUrl : null}
      />

      <TextInput
        onSend={handleSubmit}
        isLoading={isLoading}
        value={text}
        onChange={setText}
        placeholder={pendingImage ? 'Describe what you see (optional)' : 'Take or upload a photo first'}
        inputRef={inputRef}
      />
    </div>
  );
}