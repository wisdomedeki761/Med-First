'use client';

import { useState, useRef, useCallback, useEffect } from 'react';

interface CameraState {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  isActive: boolean;
  isSupported: boolean;
  capturedImage: string | null;
  error: string | null;
  isInitializing: boolean;
}

export function useCamera(): CameraState & {
  startCamera: () => Promise<void>;
  stopCamera: () => void;
  captureFrame: () => void;
  clearCapture: () => void;
} {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [isActive, setIsActive] = useState(false);
  const [isSupported, setIsSupportedState] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(false);

  // Check support on mount
  useEffect(() => {
    const supported = typeof window !== 'undefined' &&
      navigator.mediaDevices &&
      typeof navigator.mediaDevices.getUserMedia === 'function';
    setIsSupportedState(supported);
  }, []);

  const startCamera = useCallback(async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      setError('Camera is not supported in your browser');
      return;
    }

    setIsInitializing(true);
    setError(null);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }

      setIsActive(true);
    } catch (err: any) {
      if (err.name === 'NotAllowedError') {
        setError('Camera permission denied. Please allow camera access to use this feature.');
      } else if (err.name === 'NotFoundError') {
        setError('No camera found. Please connect a camera and try again.');
      } else {
        setError('Failed to access camera. Please check your permissions.');
      }
    } finally {
      setIsInitializing(false);
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    setIsActive(false);
  }, []);

  const captureFrame = useCallback(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (!video || !canvas || !isActive) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(video, 0, 0);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
    setCapturedImage(dataUrl);
  }, [isActive]);

  const clearCapture = useCallback(() => {
    setCapturedImage(null);
  }, []);

  return {
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
  };
}