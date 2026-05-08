'use client';

import { useState, useEffect, useCallback } from 'react';
import { Camera, Upload, X, Check, RefreshCw, AlertTriangle, Image as ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCamera } from '@/hooks/useCamera';
import { processImageFile } from '@/lib/imageUtils';

interface CameraCaptureProps {
  onImageCaptured: (imageData: { base64: string; mimeType: string; dataUrl: string }) => void;
  onClear: () => void;
  existingImage?: string | null;
}

export function CameraCapture({ onImageCaptured, onClear, existingImage }: CameraCaptureProps) {
  const [mode, setMode] = useState<'camera' | 'upload'>('camera');
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  const {
    videoRef,
    canvasRef,
    isActive,
    isSupported,
    capturedImage,
    error,
    isInitializing,
    startCamera,
    stopCamera,
    captureFrame,
    clearCapture,
  } = useCamera();

  const handleUsePhoto = useCallback(() => {
    if (capturedImage) {
      const mimeType = 'image/jpeg';
      const base64 = capturedImage.split(',')[1];
      onImageCaptured({ base64, mimeType, dataUrl: capturedImage });
    }
  }, [capturedImage, onImageCaptured]);

  const handleRetake = useCallback(() => {
    clearCapture();
    setFileName(null);
    setUploadError(null);
  }, [clearCapture]);

  const handleFileSelect = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      setUploadError('File is too large. Please select an image under 10MB.');
      return;
    }

    setUploadError(null);

    try {
      const result = await processImageFile(file);
      setFileName(file.name);
      onImageCaptured(result);
    } catch (err) {
      setUploadError('Failed to process image. Please try again.');
    }
  }, [onImageCaptured]);

  const handleUseExisting = useCallback(() => {
    if (existingImage) {
      const mimeType = 'image/jpeg';
      const base64 = existingImage.split(',')[1];
      onImageCaptured({ base64, mimeType, dataUrl: existingImage });
    }
  }, [existingImage, onImageCaptured]);

  useEffect(() => {
    if (mode === 'camera' && !capturedImage && !existingImage) {
      startCamera();
    }

    return () => {
      if (mode === 'camera') {
        stopCamera();
      }
    };
  }, [mode, capturedImage, existingImage, startCamera, stopCamera]);

  // Show existing image if provided
  if (existingImage && !capturedImage) {
    return (
      <div className="w-full max-w-md mx-auto">
        <div className="relative rounded-xl overflow-hidden border border-white/10 bg-black">
          <img
            src={existingImage}
            alt="Captured"
            className="w-full h-auto block"
          />
          <div className="absolute top-2 right-2 flex gap-2 z-10">
            <button
              onClick={onClear}
              className="p-2 rounded-full bg-black/50 backdrop-blur-sm border border-white/20 hover:bg-black/70 transition-colors"
            >
              <X size={20} className="text-white" />
            </button>
          </div>
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
            <div className="flex gap-2">
              <button
                onClick={onClear}
                className="flex-1 py-3 px-4 rounded-lg bg-red-500/80 text-white font-medium hover:bg-red-500 transition-colors"
              >
                <RefreshCw size={18} className="inline mr-2" />
                Retake
              </button>
              <button
                onClick={handleUseExisting}
                className="flex-1 py-3 px-4 rounded-lg bg-green-500/80 text-white font-medium hover:bg-green-500 transition-colors"
              >
                <Check size={18} className="inline mr-2" />
                Use Photo
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Mode toggle */}
      <div className="flex gap-2 mb-4 justify-center">
        <button
          onClick={() => setMode('camera')}
          className={cn(
            'flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors',
            mode === 'camera'
              ? 'bg-white text-black'
              : 'bg-white/10 text-white hover:bg-white/20'
          )}
        >
          <Camera size={16} />
          Camera
        </button>
        <button
          onClick={() => setMode('upload')}
          className={cn(
            'flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors',
            mode === 'upload'
              ? 'bg-white text-black'
              : 'bg-white/10 text-white hover:bg-white/20'
          )}
        >
          <Upload size={16} />
          Upload
        </button>
      </div>

      {/* Camera mode */}
      {mode === 'camera' && (
        <>
          {error ? (
            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-center">
              <AlertTriangle size={32} className="text-red-400 mx-auto mb-2" />
              <p className="text-red-300 text-sm">{error}</p>
              <button
                onClick={startCamera}
                className="mt-3 px-4 py-2 rounded-lg bg-red-500/20 text-red-300 text-sm hover:bg-red-500/30 transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : isInitializing ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="w-10 h-10 border-2 border-white/20 border-t-white rounded-full animate-spin mb-4" />
              <p className="text-white/60 text-sm">Starting camera...</p>
            </div>
          ) : capturedImage ? (
            <div className="relative rounded-xl overflow-hidden border border-white/10 bg-black">
              <img
                src={capturedImage}
                alt="Captured"
                className="w-full h-auto block"
              />
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                <div className="flex gap-2">
                  <button
                    onClick={handleRetake}
                    className="flex-1 py-3 px-4 rounded-lg bg-red-500/80 text-white font-medium hover:bg-red-500 transition-colors"
                  >
                    <RefreshCw size={18} className="inline mr-2" />
                    Retake
                  </button>
                  <button
                    onClick={handleUsePhoto}
                    className="flex-1 py-3 px-4 rounded-lg bg-green-500/80 text-white font-medium hover:bg-green-500 transition-colors"
                  >
                    <Check size={18} className="inline mr-2" />
                    Use Photo
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="relative rounded-xl overflow-hidden border border-white/10 bg-black/50">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-auto block"
              />
              <canvas ref={canvasRef} className="hidden" />

              <div className="absolute top-4 left-0 right-0 flex justify-center pointer-events-auto">
                <div className="bg-black/40 backdrop-blur-sm px-4 py-2 rounded-full">
                  <p className="text-white text-sm">Point camera at the situation</p>
                </div>
              </div>

              <div className="absolute bottom-4 left-0 right-0 flex justify-center pointer-events-none">
                <button
                  onClick={captureFrame}
                  className="pointer-events-auto w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-lg hover:scale-105 transition-transform"
                >
                  <Camera size={32} className="text-black" />
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Upload mode */}
      {mode === 'upload' && (
        <div className="space-y-4">
          <label className="block">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
            <div className={cn(
              'border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors',
              uploadError
                ? 'border-red-500/50 bg-red-500/5'
                : 'border-white/20 hover:border-white/40 hover:bg-white/5'
            )}>
              {uploadError ? (
                <>
                  <AlertTriangle size={32} className="text-red-400 mx-auto mb-2" />
                  <p className="text-red-300 text-sm">{uploadError}</p>
                </>
              ) : fileName ? (
                <>
                  <ImageIcon size={32} className="text-green-400 mx-auto mb-2" />
                  <p className="text-white text-sm">{fileName}</p>
                  <p className="text-white/50 text-xs mt-1">Click to change</p>
                </>
              ) : (
                <>
                  <Upload size={32} className="text-white/40 mx-auto mb-2" />
                  <p className="text-white text-sm">Tap to upload a photo</p>
                  <p className="text-white/50 text-xs mt-1">or drag and drop</p>
                </>
              )}
            </div>
          </label>

          {fileName && (
            <button
              onClick={() => {
                setFileName(null);
                onClear();
              }}
              className="w-full py-2 rounded-lg bg-white/10 text-white/70 hover:bg-white/20 transition-colors"
            >
              <X size={16} className="inline mr-2" />
              Clear Image
            </button>
          )}
        </div>
      )}
    </div>
  );
}