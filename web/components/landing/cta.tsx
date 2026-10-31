'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, ArrowUp } from 'lucide-react';

export function LandingCTA() {
  return (
    <section className="py-20 sm:py-28 bg-[#F8FAFC] border-t border-[#E2E8F0]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-[#0F172A] text-white p-8 sm:p-14 text-center space-y-6 shadow-sm">
          <div className="max-w-2xl mx-auto space-y-4">
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white leading-tight">
              Ready to Simplify Your Subscription Management?
            </h2>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-xl mx-auto">
              Bring your subscription workflow together with Brightloop. Manage customers, subscriptions, invoices and payments from one centralized platform.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link
              href="/login"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-bold text-sm bg-[#C8E63C] text-[#0F172A] hover:bg-[#B8DC30] transition-all shadow-sm"
            >
              Get Started
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="#top"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-sm border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 transition-all"
            >
              Back to Home
              <ArrowUp className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

