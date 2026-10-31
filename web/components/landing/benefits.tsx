'use client';

import React from 'react';
import { Database, Eye, RefreshCw, BarChart2 } from 'lucide-react';

export function LandingBenefits() {
  const benefits = [
    {
      icon: Database,
      title: 'Centralized Management',
      description:
        'Keep customer records, products, subscriptions and invoices organized in one place.',
    },
    {
      icon: Eye,
      title: 'Better Visibility',
      description:
        'Understand subscription activity, payment status and outstanding invoices without switching between tools.',
    },
    {
      icon: RefreshCw,
      title: 'Simplified Billing',
      description:
        'Reduce repetitive billing tasks through structured subscription and invoice workflows.',
    },
    {
      icon: BarChart2,
      title: 'Smarter Decisions',
      description:
        'Use financial reports and subscription insights to make better business decisions.',
    },
  ];

  return (
    <section id="benefits" className="py-20 sm:py-28 bg-[#F8FAFC] border-t border-[#E2E8F0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Section Header */}
        <div className="max-w-2xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white border border-[#E2E8F0] text-[#475569]">
            Operational Value
          </div>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-[#0F172A]">
            Built to Make Subscription Management Easier
          </h2>
          <p className="text-sm sm:text-base text-[#64748B] leading-relaxed">
            Spend less time managing billing operations and more time focusing on your business.
          </p>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((b) => {
            const Icon = b.icon;
            return (
              <div
                key={b.title}
                className="p-6 rounded-2xl bg-white border border-[#E2E8F0] shadow-sm hover:border-slate-300 transition-all space-y-3.5 group"
              >
                <div className="w-10 h-10 rounded-xl bg-slate-100 text-[#0F172A] flex items-center justify-center group-hover:bg-[#C8E63C] transition-colors">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-[#0F172A]">
                  {b.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed">
                  {b.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

