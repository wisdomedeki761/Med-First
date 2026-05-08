'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Heart, AlertTriangle, Phone } from 'lucide-react';

export default function DisclaimerPage() {
  useEffect(() => {
    document.title = 'Medical Disclaimer | Med-First';
  }, []);

  return (
    <main className="min-h-screen flex flex-col items-center p-4 sm:p-6 relative overflow-hidden bg-black">
      {/* Ambient effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white/3 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-critical/10 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-2xl relative z-10">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link
            href="/"
            className="p-2 rounded-lg hover:bg-white/10 transition-colors"
            aria-label="Go back"
          >
            <ArrowLeft size={24} className="text-white/70" />
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-critical to-critical/70 flex items-center justify-center">
              <AlertTriangle size={20} className="text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white">Medical Disclaimer</h1>
          </div>
        </div>

        {/* Content */}
        <div className="glass-gray rounded-2xl p-6 sm:p-8 border border-white/10 space-y-6">
          <div className="p-4 rounded-xl bg-critical/10 border border-critical/30">
            <div className="flex items-start gap-3">
              <AlertTriangle size={24} className="text-critical flex-shrink-0 mt-0.5" />
              <div>
                <h2 className="text-lg font-semibold text-critical mb-2">Important Warning</h2>
                <p className="text-white/80 leading-relaxed">
                  Med-First is not a replacement for professional medical care,
                  diagnosis, or treatment. The information provided is for
                  educational and informational purposes only.
                </p>
              </div>
            </div>
          </div>

          <section>
            <h3 className="text-lg font-semibold text-white mb-3">Limitations of Service</h3>
            <ul className="space-y-3 text-white/70">
              <li className="flex items-start gap-2">
                <span className="text-critical mt-1.5">•</span>
                <span>Med-First uses AI technology and may not always provide accurate or complete medical information</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-critical mt-1.5">•</span>
                <span>AI-generated responses should never be used as a substitute for professional medical advice</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-critical mt-1.5">•</span>
                <span>The app cannot perform physical examinations or diagnose medical conditions</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-critical mt-1.5">•</span>
                <span>Always verify AI-generated guidance with qualified healthcare professionals</span>
              </li>
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-white mb-3">Emergency Situations</h3>
            <p className="text-white/70 leading-relaxed mb-4">
              For life-threatening emergencies, immediately call your local
              emergency services. Do not rely on this app for immediate
              medical assistance in critical situations.
            </p>
            <div className="grid grid-cols-3 gap-3">
              <a
                href="tel:911"
                className="flex flex-col items-center gap-2 p-4 rounded-xl bg-critical/20 border border-critical/30 hover:bg-critical/30 transition-colors"
              >
                <Phone size={24} className="text-critical" />
                <span className="text-white font-bold">911</span>
                <span className="text-white/50 text-xs">US</span>
              </a>
              <a
                href="tel:999"
                className="flex flex-col items-center gap-2 p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
              >
                <Phone size={24} className="text-white/70" />
                <span className="text-white font-bold">999</span>
                <span className="text-white/50 text-xs">UK</span>
              </a>
              <a
                href="tel:112"
                className="flex flex-col items-center gap-2 p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
              >
                <Phone size={24} className="text-white/70" />
                <span className="text-white font-bold">112</span>
                <span className="text-white/50 text-xs">EU</span>
              </a>
            </div>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-white mb-3">No Medical Advice</h3>
            <p className="text-white/70 leading-relaxed">
              By using Med-First, you acknowledge that the app does not provide
              medical advice, diagnosis, or treatment. Any information provided
              should be used as a general guide only. Always consult with
              qualified healthcare professionals for medical decisions.
            </p>
          </section>

          <div className="pt-6 border-t border-white/10">
            <Link
              href="/"
              className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl bg-white/10 text-white hover:bg-white/20 transition-colors"
            >
              <Heart size={18} />
              <span>I Understand - Return to Home</span>
            </Link>
          </div>
        </div>

        <p className="text-center text-white/30 text-xs mt-6">
          Last updated: May 2024
        </p>
      </div>
    </main>
  );
}