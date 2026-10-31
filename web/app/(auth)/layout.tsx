import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Sparkles, CheckCircle2 } from 'lucide-react';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
      <div className="min-h-screen bg-white text-[#0F172A] flex flex-col justify-between selection:bg-[#C8E63C] selection:text-[#0F172A]">
        {/* Top Header */}
        <header className="px-6 py-5 flex items-center justify-between border-b border-[#F1F5F9]">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-xl bg-[#C8E63C] text-[#0F172A] flex items-center justify-center font-black text-base shadow-sm transition-transform group-hover:scale-105">
              B
            </div>
            <span className="font-extrabold text-lg text-[#0F172A] tracking-tight">
              Brightloop
            </span>
          </Link>

            <Link
              href="/"
              className="inline-flex items-center gap-2 text-xs font-semibold text-[#64748B] hover:text-[#0F172A] transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to Home
            </Link>
          </header>

            {/* Main Content Area: Split on Desktop */}
            <main className="flex-1 flex items-stretch">
              <div className="w-full grid grid-cols-1 lg:grid-cols-12 min-h-[calc(100vh-8rem)]">
                {/* Left / Center: Auth Form Container */}
                <div className="lg:col-span-6 xl:col-span-5 flex items-center justify-center p-6 sm:p-12">
                  <div className="w-full max-w-md">{children}</div>
                </div>

                {/* Right: Minimalist Brand Illustration Panel (Desktop Only) */}
                <div className="hidden lg:flex lg:col-span-6 xl:col-span-7 bg-[#F8FAFC] border-l border-[#F1F5F9] items-center justify-center p-12 relative overflow-hidden">
                  {/* Subtle light ambient glow */}
                  <div className="absolute w-[450px] h-[450px] rounded-full bg-[#C8E63C]/15 blur-[120px] pointer-events-none" />

                  <div className="max-w-md space-y-8 relative z-10 text-center">
                    {/* Minimal SVG Graphic inspired by the Cirkkl design */}
                    <div className="relative mx-auto w-64 h-64 flex items-center justify-center">
                      {/* Soft ground line */}
                      <div className="absolute bottom-6 left-0 right-0 h-0.5 bg-slate-200" />

                      {/* Person silhouette / walking figure illustration */}
                      <div className="absolute bottom-6 left-12 flex flex-col items-center">
                        <div className="w-4 h-4 rounded-full bg-[#0F172A]" />
                        <div className="w-7 h-10 bg-slate-100 border border-slate-300 rounded-t-lg -mt-0.5" />
                        <div className="w-6 h-12 bg-[#0F172A] rounded-b-sm" />
                      </div>

                      {/* Big Pin / Map Marker in #C8E63C Lime with inner circle */}
                      <div className="absolute bottom-6 right-10 flex flex-col items-center">
                        <div className="w-24 h-32 rounded-t-full rounded-b-3xl bg-[#C8E63C] border-2 border-[#0F172A] shadow-sm flex items-center justify-center">
                          <div className="w-8 h-8 rounded-full bg-white border-2 border-[#0F172A]" />
                        </div>
                        <div className="w-8 h-2 rounded-full bg-[#C8E63C]/60 mt-1 blur-[1px]" />
                      </div>

                      {/* Decorative floating minimal cloud/shape */}
                      <div className="absolute top-8 left-6 w-10 h-16 rounded-full bg-slate-100/80 border border-slate-200/60" />
                    </div>

                    <div className="space-y-2">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-[#C8E63C]/30 text-[#0F172A] border border-[#C8E63C]">
                        <Sparkles className="w-3.5 h-3.5" />
                        Enterprise Subscription Operations
                      </div>
                      <h2 className="text-xl font-bold text-[#0F172A]">
                        Clarity & Control in Every Subscription
                      </h2>
                      <p className="text-xs text-[#64748B] leading-relaxed max-w-sm mx-auto">
                        From proposal generation to active contract governance and recurring billing, all your commercial workflows in one unified system.
                      </p>
                    </div>

                    <div className="pt-2 flex items-center justify-center gap-6 text-[11px] font-medium text-[#475569]">
                      <span className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        Paise-Precision GST
                      </span>
                      <span className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        Full Audit History
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </main>

              {/* Footer */}
              <footer className="px-6 py-4 text-center text-xs text-[#94A3B8] border-t border-[#F1F5F9]">
                © 2026 Brightloop. All rights reserved.
              </footer>
            </div>
            );
}
