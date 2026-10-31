'use client';

import React from 'react';
import { Sparkles, RefreshCw, BarChart3, CheckCircle2 } from 'lucide-react';

export function LandingAbout() {
  const capabilities = [
    {
      icon: Sparkles,
      title: 'Manage subscriptions',
      description:
        'Track contracts from initial draft quote to active recurring status with sequential identifiers.',
    },
    {
      icon: RefreshCw,
      title: 'Simplify billing',
      description:
        'Structure renewal schedules, tax rates and payment terms without spreadsheets or manual re-entry.',
    },
    {
      icon: BarChart3,
      title: 'Track financial activity',
      description:
        'Maintain complete visibility into invoicing, payment confirmations and customer account balances.',
    },
  ];

  return (
    <section id="about" className="py-20 sm:py-28 bg-white border-t border-[#E2E8F0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column (6 cols): Copy & 3 Capabilities */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-[#475569]">
              About Brightloop
            </div>

            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-[#0F172A] leading-tight">
              One Platform. A More Organized Subscription Business.
            </h2>

            <p className="text-sm sm:text-base text-[#64748B] leading-relaxed">
              Brightloop is designed to simplify the way businesses manage subscriptions. By connecting customers, products, quotations, billing and payments in one platform, Brightloop helps teams maintain a clear and organized subscription workflow.
            </p>

            <div className="space-y-4 pt-2">
              {capabilities.map((cap) => {
                const Icon = cap.icon;
                return (
                  <div
                    key={cap.title}
                    className="flex items-start gap-3.5 p-3.5 rounded-xl bg-slate-50 border border-slate-100"
                  >
                    <div className="w-8 h-8 rounded-lg bg-white border border-[#E2E8F0] flex items-center justify-center text-[#0F172A] shrink-0 mt-0.5">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-[#0F172A]">
                        {cap.title}
                      </h3>
                      <p className="text-xs text-[#64748B] mt-0.5">
                        {cap.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column (6 cols): Platform Architecture / Unified Workflow View */}
          <div className="lg:col-span-6">
            <div className="p-6 sm:p-8 rounded-3xl bg-[#0F172A] text-white shadow-sm space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#C8E63C] text-[#0F172A] flex items-center justify-center font-bold text-xs">
                    B
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white block">
                      Brightloop Unified Engine
                    </span>
                    <span className="text-[10px] text-slate-400">
                      Connected Business Operations
                    </span>
                  </div>
                </div>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800 px-2 py-0.5 rounded-full">
                  PostgreSQL · Neon Live
                </span>
              </div>

              {/* Connected Layers */}
              <div className="space-y-3">
                <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-4 h-4 text-[#C8E63C]" />
                    <span className="text-xs font-semibold text-slate-200">
                      Product Catalog & Variant Configuration
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400">Phase 3 Ready</span>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-4 h-4 text-[#C8E63C]" />
                    <span className="text-xs font-semibold text-slate-200">
                      Quotation Templates & Customer Offers
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400">Phase 4 Ready</span>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-4 h-4 text-[#C8E63C]" />
                    <span className="text-xs font-semibold text-slate-200">
                      Subscription Lifecycles & Audit Timeline
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400">Active Engine</span>
                </div>
              </div>

              <div className="pt-2 text-[11px] text-slate-400 leading-relaxed border-t border-slate-800">
                Designed to operate cleanly without multi-tenant friction or manual synchronization bottlenecks.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

