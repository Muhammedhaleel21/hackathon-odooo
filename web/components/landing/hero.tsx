'use client';

import React from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  Sparkles,
  Layers,
  CheckCircle2,
  Clock,
  CreditCard,
  TrendingUp,
  Receipt,
  Users,
  ChevronRight,
} from 'lucide-react';

export function LandingHero() {
  return (
    <section className="pt-12 pb-20 sm:pt-20 sm:pb-28 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Copy & CTAs (6 cols) */}
          <div className="lg:col-span-6 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-[#C8E63C]/30 text-[#0F172A] border border-[#C8E63C]">
              <Sparkles className="w-3.5 h-3.5 text-[#0F172A]" />
              Enterprise Subscription Platform
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-[#0F172A] leading-[1.1]">
              Manage Your Subscriptions.{' '}
              <span className="text-[#475569]">Simplify Your Business.</span>
            </h1>

            <p className="text-base sm:text-lg text-[#64748B] leading-relaxed max-w-xl">
              Brightloop brings your customers, subscriptions, recurring billing, invoices and payments together in one powerful platform. Manage your entire subscription workflow with clarity and control.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
              <Link
                href="/login"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm bg-[#0F172A] text-white hover:bg-slate-800 transition-all shadow-sm"
              >
                Get Started
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="#features"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-sm border border-[#E2E8F0] bg-white text-[#334155] hover:bg-slate-50 transition-all"
              >
                Explore Features
                <ChevronRight className="w-4 h-4 text-[#94A3B8]" />
              </a>
            </div>

            {/* Trust Points */}
            <div className="pt-4 flex flex-wrap items-center gap-5 text-xs text-[#64748B] font-medium border-t border-[#F1F5F9]">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Zero Manual Billing Errors</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Automated 18% GST Precision</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Full Audit Trail Tracking</span>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Dashboard Mockup (6 cols) */}
          <div className="lg:col-span-6 relative">
            <div className="rounded-3xl border border-[#E2E8F0] bg-white p-5 sm:p-6 shadow-sm space-y-4">
              {/* Dashboard Preview Header */}
              <div className="flex items-center justify-between pb-3 border-b border-[#F1F5F9]">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#C8E63C] text-[#0F172A] flex items-center justify-center font-bold text-xs">
                    B
                  </div>
                  <div>
                    <span className="text-xs font-bold text-[#0F172A] block leading-tight">
                      Brightloop Workspace
                    </span>
                    <span className="text-[10px] text-[#94A3B8]">
                      Production Overview
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Live System
                  </span>
                </div>
              </div>

              {/* 3 Metric Cards */}
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-[10px] uppercase font-bold text-[#94A3B8] block">
                    Active Subs
                  </span>
                  <div className="text-lg font-black text-[#0F172A] mt-0.5">
                    1,248
                  </div>
                  <span className="text-[10px] text-emerald-600 font-medium">
                    +12% this month
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-[10px] uppercase font-bold text-[#94A3B8] block">
                    Monthly Rev
                  </span>
                  <div className="text-lg font-black text-[#0F172A] mt-0.5">
                    ₹24.8L
                  </div>
                  <span className="text-[10px] text-emerald-600 font-medium">
                    Recurring Run-Rate
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-[10px] uppercase font-bold text-[#94A3B8] block">
                    Collection
                  </span>
                  <div className="text-lg font-black text-[#0F172A] mt-0.5">
                    98.4%
                  </div>
                  <span className="text-[10px] text-[#64748B] font-medium">
                    On-time payments
                  </span>
                </div>
              </div>

              {/* Active Subscription Contract Row Item */}
              <div className="p-3.5 rounded-xl border border-slate-200 bg-white space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <Layers className="w-4 h-4 text-blue-600" />
                    <span className="font-bold text-[#0F172A]">Acme Global Enterprises</span>
                    <span className="font-mono text-[10px] text-[#94A3B8]">SUB-2026-0042</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Active
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-[#64748B] pt-1 border-t border-slate-100">
                  <span>Business Software Pro + Cloud Hosting</span>
                  <span className="font-bold text-[#0F172A]">₹3,540 / mo</span>
                </div>
              </div>

              {/* Recent Payment & Invoicing Stream */}
              <div className="space-y-2 pt-1">
                <span className="text-[10px] uppercase font-bold text-[#94A3B8] tracking-wider block">
                  Recent Invoicing & Payment Activity
                </span>
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50/80 text-xs">
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="font-medium text-[#0F172A]">Payment Received · INV-2026-089</span>
                    </div>
                    <span className="font-bold text-[#0F172A]">₹2,360</span>
                  </div>

                  <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50/80 text-xs">
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-blue-600" />
                      <span className="font-medium text-[#0F172A]">Quotation Issued · QT-2026-0158</span>
                    </div>
                    <span className="text-[11px] text-[#64748B]">Valid 15 Days</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

