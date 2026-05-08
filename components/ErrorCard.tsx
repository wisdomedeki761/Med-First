'use client';

import { useState, useEffect } from 'react';
import { AlertTriangle, RefreshCw, Wifi, WifiOff, Camera, Mic, Globe } from 'lucide-react';
import { cn } from '@/lib/utils';

type ErrorType = 'camera' | 'voice' | 'api' | 'offline' | null;

interface ErrorCardProps {
  type: ErrorType;
  message?: string;
  onRetry?: () => void;
}

export function ErrorCard({ type, message, onRetry }: ErrorCardProps) {
  if (!type) return null;

  const renderContent = () => {
    switch (type) {
      case 'camera':
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Camera size={24} className="text-amber-400" />
              <h3 className="text-lg font-semibold text-white">Camera Access Denied</h3>
            </div>

            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
              <p className="text-white/80 mb-4">
                Med-First needs camera access to capture photos of the emergency situation.
              </p>

              <div className="space-y-4 text-sm">
                <div>
                  <p className="text-white/60 mb-2 font-medium">Chrome (Desktop):</p>
                  <ol className="text-white/50 list-decimal list-inside space-y-1">
                    <li>Click the lock/camera icon in the address bar</li>
                    <li>Select "Allow" for Camera</li>
                    <li>Refresh the page</li>
                  </ol>
                </div>

                <div>
                  <p className="text-white/60 mb-2 font-medium">Safari (iOS):</p>
                  <ol className="text-white/50 list-decimal list-inside space-y-1">
                    <li>Tap the AA icon in the address bar</li>
                    <li>Tap "Website Settings"</li>
                    <li>Toggle "Camera" to Allow</li>
                    <li>Refresh the page</li>
                  </ol>
                </div>

                <div>
                  <p className="text-white/60 mb-2 font-medium">Chrome (Mobile):</p>
                  <ol className="text-white/50 list-decimal list-inside space-y-1">
                    <li>Tap the three dots menu</li>
                    <li>Tap "Settings" → "Site Settings"</li>
                    <li>Tap "Camera" → "Allow"</li>
                    <li>Refresh the page</li>
                  </ol>
                </div>
              </div>
            </div>

            {onRetry && (
              <button
                onClick={onRetry}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-white/10 text-white hover:bg-white/20 transition-colors"
              >
                <RefreshCw size={18} />
                Try Again
              </button>
            )}
          </div>
        );

      case 'voice':
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Mic size={24} className="text-amber-400" />
              <h3 className="text-lg font-semibold text-white">Voice Not Supported</h3>
            </div>

            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
              <p className="text-white/80 mb-4">
                Your browser doesn't support voice input. For the best experience, use:
              </p>

              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5">
                  <Globe size={20} className="text-white/50" />
                  <span className="text-white">Google Chrome (recommended)</span>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5">
                  <Globe size={20} className="text-white/50" />
                  <span className="text-white">Microsoft Edge</span>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5">
                  <Globe size={20} className="text-white/50" />
                  <span className="text-white">Safari 14.3+ (macOS/iOS)</span>
                </div>
              </div>

              <p className="text-white/50 text-sm mt-4">
                You can still type your emergency description using text mode.
              </p>
            </div>
          </div>
        );

      case 'api':
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <AlertTriangle size={24} className="text-red-400" />
              <h3 className="text-lg font-semibold text-white">Connection Error</h3>
            </div>

            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
              <p className="text-white/80 mb-2">
                {message || "The AI service is temporarily unavailable."}
              </p>
              <p className="text-white/50 text-sm">
                Please check your connection and try again. If the problem persists,
                the service may be experiencing high demand.
              </p>
            </div>

            {onRetry && (
              <button
                onClick={onRetry}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-white/10 text-white hover:bg-white/20 transition-colors"
              >
                <RefreshCw size={18} />
                Try Again
              </button>
            )}
          </div>
        );

      case 'offline':
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <WifiOff size={24} className="text-red-400" />
              <h3 className="text-lg font-semibold text-white">You're Offline</h3>
            </div>

            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
              <p className="text-white/80 mb-4">
                Med-First needs an internet connection to provide AI-powered guidance.
              </p>
              <div className="flex items-center gap-3 justify-center py-2">
                <Wifi size={20} className="text-white/50 animate-pulse" />
                <span className="text-white/60">Checking connection...</span>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-4">
      <div className="glass-gray rounded-2xl p-5 border border-white/10 animate-slide-up">
        {renderContent()}
      </div>
    </div>
  );
}

// Hook to detect online/offline status
export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    setIsOnline(navigator.onLine);

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOnline;
}

// Offline banner component
export function OfflineBanner() {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[100] bg-red-600 px-4 py-2 flex items-center justify-center gap-2 animate-slide-down">
      <WifiOff size={16} className="text-white" />
      <span className="text-white text-sm font-medium">No internet connection</span>
    </div>
  );
}