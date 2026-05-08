'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Heart, FileText, Shield, Globe } from 'lucide-react';

export default function TermsPage() {
  useEffect(() => {
    document.title = 'Terms of Use | Med-First';
  }, []);

  return (
    <main className="min-h-screen flex flex-col items-center p-4 sm:p-6 relative overflow-hidden bg-black">
      {/* Ambient effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white/3 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
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
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
              <FileText size={20} className="text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white">Terms of Use</h1>
          </div>
        </div>

        {/* Content */}
        <div className="glass-gray rounded-2xl p-6 sm:p-8 border border-white/10 space-y-6">
          <section>
            <div className="flex items-center gap-2 mb-3">
              <Shield size={20} className="text-blue-400" />
              <h3 className="text-lg font-semibold text-white">Acceptance of Terms</h3>
            </div>
            <p className="text-white/70 leading-relaxed">
              By accessing and using Med-First, you accept and agree to be
              bound by these Terms of Use. If you do not agree to these terms,
              please do not use the application.
            </p>
          </section>

          <section>
            <div className="flex items-center gap-2 mb-3">
              <Heart size={20} className="text-critical" />
              <h3 className="text-lg font-semibold text-white">Purpose of Service</h3>
            </div>
            <p className="text-white/70 leading-relaxed">
              Med-First is an AI-powered emergency first aid guidance application.
              It provides general informational guidance during emergency situations
              and is not intended to replace professional medical care, diagnosis,
              or treatment.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-white mb-3">User Responsibilities</h3>
            <ul className="space-y-3 text-white/70">
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-1.5">1.</span>
                <span>Use the application only for legitimate emergency guidance purposes</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-1.5">2.</span>
                <span>Do not rely solely on AI-generated guidance for medical decisions</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-1.5">3.</span>
                <span>Always seek professional medical help when needed</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-1.5">4.</span>
                <span>Do not use the application in situations that require immediate emergency services</span>
              </li>
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-white mb-3">AI Limitations</h3>
            <p className="text-white/70 leading-relaxed">
              Med-First uses Google's Gemma 4 AI model to generate responses.
              While we strive for accuracy, AI-generated content may be incomplete,
              inaccurate, or inappropriate for certain situations. The application
              cannot replace professional medical judgment.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-white mb-3">Privacy & Data</h3>
            <ul className="space-y-3 text-white/70">
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-1.5">•</span>
                <span>Messages are processed through Google's AI services</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-1.5">•</span>
                <span>API keys are stored server-side and never exposed to clients</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-1.5">•</span>
                <span>Chat sessions are stored in sessionStorage and cleared on tab close</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-1.5">•</span>
                <span>Images captured are processed in-memory and not stored permanently</span>
              </li>
            </ul>
          </section>

          <section>
            <div className="flex items-center gap-2 mb-3">
              <Globe size={20} className="text-green-400" />
              <h3 className="text-lg font-semibold text-white">Disclaimer of Warranties</h3>
            </div>
            <p className="text-white/70 leading-relaxed">
              Med-First is provided "as is" without any warranties, express or
              implied. We do not warrant that the application will be error-free,
              uninterrupted, or secure. Use at your own risk.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-white mb-3">Limitation of Liability</h3>
            <p className="text-white/70 leading-relaxed">
              In no event shall Med-First, its developers, or Google be liable
              for any damages arising from the use or inability to use this
              application, including but not limited to medical emergencies,
              misdiagnosis, or any other consequences.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-white mb-3">Changes to Terms</h3>
            <p className="text-white/70 leading-relaxed">
              We reserve the right to modify these Terms of Use at any time.
              Continued use of the application after any changes constitutes
              acceptance of the new terms.
            </p>
          </section>

          <div className="pt-6 border-t border-white/10">
            <Link
              href="/"
              className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl bg-white/10 text-white hover:bg-white/20 transition-colors"
            >
              <FileText size={18} />
              <span>I Accept - Return to Home</span>
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