'use client';

import React from 'react';
import Link from 'next/link';

export function LandingFooter() {
  return (
    <footer className="bg-white border-t border-[#E2E8F0] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 pb-8 border-b border-[#F1F5F9]">
          {/* Logo & Description */}
          <div className="space-y-2 max-w-sm">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#C8E63C] text-[#0F172A] flex items-center justify-center font-black text-base shadow-sm">
                B
              </div>
              <span className="font-extrabold text-lg text-[#0F172A] tracking-tight">
                Brightloop
              </span>
            </div>
            <p className="text-xs text-[#64748B] leading-relaxed">
              Business subscription management platform designed for clarity, recurring billing reliability, and complete lifecycle governance.
            </p>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-wrap items-center gap-6 text-xs font-semibold text-[#64748B]">
            <a href="#top" className="hover:text-[#0F172A] transition-colors">
              Home
            </a>
            <a href="#features" className="hover:text-[#0F172A] transition-colors">
              Features
            </a>
            <a href="#how-it-works" className="hover:text-[#0F172A] transition-colors">
              How It Works
            </a>
            <a href="#benefits" className="hover:text-[#0F172A] transition-colors">
              Benefits
            </a>
            <a href="#about" className="hover:text-[#0F172A] transition-colors">
              About
            </a>
            <Link href="/login" className="hover:text-[#0F172A] transition-colors">
              Login
            </Link>
          </nav>
        </div>

        {/* Bottom Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#94A3B8]">
          <p>© 2026 Brightloop. All rights reserved.</p>
          <p className="font-medium">Subscription Management System</p>
        </div>
      </div>
    </footer>
  );
}

