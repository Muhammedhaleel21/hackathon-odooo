'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth, getDashboardPath } from '@/hooks/use-auth';
import { Menu, X, ArrowRight, LayoutDashboard } from 'lucide-react';

export function LandingNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, isAuthenticated } = useAuth();

  const navLinks = [
    { label: 'Home', href: '#top' },
    { label: 'Features', href: '#features' },
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'Benefits', href: '#benefits' },
    { label: 'About', href: '#about' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-[#E2E8F0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="#top" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-[#C8E63C] flex items-center justify-center shadow-sm text-[#0F172A] font-black text-lg transition-transform group-hover:scale-105">
            B
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-lg text-[#0F172A] tracking-tight leading-tight">
              Brightloop
            </span>
            <span className="text-[10px] text-[#64748B] font-medium leading-none">
              Subscription Management
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-7">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-xs font-semibold text-[#64748B] hover:text-[#0F172A] transition-colors"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Right CTA Actions */}
        <div className="hidden md:flex items-center gap-3">
          {isAuthenticated && user ? (
            <Link
              href={getDashboardPath(user.role)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-[#C8E63C] text-[#0F172A] hover:bg-[#B8DC30] transition-all shadow-sm"
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              Go to Dashboard
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="px-3.5 py-2 text-xs font-semibold text-[#475569] hover:text-[#0F172A] transition-colors"
              >
                Login
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-[#0F172A] text-white hover:bg-slate-800 transition-all shadow-sm"
              >
                Get Started
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex md:hidden">
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            aria-expanded={isOpen}
            aria-label="Toggle navigation menu"
            className="p-2 rounded-xl text-[#64748B] hover:text-[#0F172A] hover:bg-slate-100 transition-colors cursor-pointer"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isOpen && (
        <div className="md:hidden border-b border-[#E2E8F0] bg-white px-4 pt-3 pb-5 space-y-3 shadow-lg">
          <nav className="flex flex-col space-y-2">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="px-3 py-2 rounded-lg text-sm font-semibold text-[#475569] hover:text-[#0F172A] hover:bg-slate-50 transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="pt-3 border-t border-[#F1F5F9] flex flex-col gap-2">
            {isAuthenticated && user ? (
              <Link
                href={getDashboardPath(user.role)}
                onClick={() => setIsOpen(false)}
                className="w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold bg-[#C8E63C] text-[#0F172A]"
              >
                <LayoutDashboard className="w-4 h-4" />
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setIsOpen(false)}
                  className="w-full text-center py-2 text-xs font-semibold text-[#475569] hover:bg-slate-50 rounded-lg"
                >
                  Login
                </Link>
                <Link
                  href="/login"
                  onClick={() => setIsOpen(false)}
                  className="w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold bg-[#0F172A] text-white"
                >
                  Get Started
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

