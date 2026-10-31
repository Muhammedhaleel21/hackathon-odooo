'use client';

import React from 'react';
import { Package, UserCheck, Sparkles, CreditCard } from 'lucide-react';

export function LandingHowItWorks() {
  const steps = [
    {
      number: '01',
      icon: Package,
      title: 'Create Your Products',
      description:
        'Set up your products and subscription plans with the pricing and billing options your business needs.',
    },
    {
      number: '02',
      icon: UserCheck,
      title: 'Manage Customers',
      description:
        'Organize customer information and prepare quotations for your products and services.',
    },
    {
      number: '03',
      icon: Sparkles,
      title: 'Manage Subscriptions',
      description:
        'Create subscriptions, monitor billing cycles and manage customer subscription activity.',
    },
    {
      number: '04',
      icon: CreditCard,
      title: 'Track Payments',
      description:
        'Generate invoices, record payments and understand your financial performance.',
    },
  ];

  return (
    <section id="how-it-works" className="py-20 sm:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Section Header */}
        <div className="max-w-2xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-[#475569]">
            Step-by-Step Flow
          </div>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-[#0F172A]">
            Your Subscription Workflow, Simplified
          </h2>
          <p className="text-sm sm:text-base text-[#64748B] leading-relaxed">
            Manage your subscription business through one connected workflow.
          </p>
        </div>

        {/* Steps: Horizontal on Desktop, Vertical on Mobile */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
          {/* Desktop Connecting Line */}
          <div className="hidden md:block absolute top-7 left-12 right-12 h-0.5 bg-[#E2E8F0] -z-0" />

          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={step.number}
                className="relative z-10 flex flex-col items-start md:items-center text-left md:text-center space-y-4 group"
              >
                {/* Step Circle & Icon */}
                <div className="w-14 h-14 rounded-2xl bg-white border-2 border-[#E2E8F0] shadow-sm flex items-center justify-center text-[#0F172A] group-hover:border-[#C8E63C] group-hover:bg-[#C8E63C]/10 transition-all">
                  <Icon className="w-6 h-6 text-[#0F172A]" />
                </div>

                <div className="space-y-1.5">
                  <div className="text-[11px] font-black uppercase tracking-wider text-[#94A3B8]">
                    Step {step.number}
                  </div>
                  <h3 className="text-base font-bold text-[#0F172A]">
                    {step.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

