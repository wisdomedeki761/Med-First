'use client';

import { PhoneCall } from 'lucide-react';

export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black">
      <div className="relative">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-critical to-critical/70 flex items-center justify-center animate-pulse">
          <PhoneCall size={28} className="text-white" />
        </div>
        <div className="absolute inset-0 rounded-2xl bg-critical/30 blur-xl animate-pulse" />
      </div>
      <p className="text-white/50 mt-4">Loading Med-First...</p>
    </div>
  );
}