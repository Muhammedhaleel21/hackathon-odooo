'use client';

import React from 'react';
import {
  Sparkles,
  Users,
  Repeat,
  Receipt,
  Percent,
  BarChart3,
} from 'lucide-react';

export function LandingFeatures() {
  const features = [
    {
      icon: Sparkles,
      title: 'Subscription Management',
      description:
        'Create, manage and monitor subscriptions from one centralized dashboard. Keep track of subscription status, billing cycles and renewals.',
      badge: 'Lifecycle Ops',
    },
    {
      icon: Users,
      title: 'Customer Management',
      description:
        'Maintain customer information, subscription history and billing details in one organized workspace.',
      badge: 'Directories',
    },
    {
      icon: Repeat,
      title: 'Recurring Billing',
      description:
        'Streamline recurring billing and invoice generation while reducing repetitive manual work.',
      badge: 'Automation',
    },
    {
      icon: Receipt,
      title: 'Invoices and Payments',
      description:
        'Manage invoices, record payments and monitor outstanding balances with greater visibility.',
      badge: 'Commercial',
    },
    {
      icon: Percent,
      title: 'Discounts and Taxes',
      description:
        'Configure discounts, apply pricing rules and manage tax calculations within your billing workflow.',
      badge: 'Compliance',
    },
    {
      icon: BarChart3,
      title: 'Financial Reports',
      description:
        'Understand your business performance through subscription reports, revenue summaries and payment insights.',
      badge: 'Analytics',
    },
  ];

  return (
    <section id="features" className="py-20 sm:py-28 bg-[#F8FAFC] border-y border-[#E2E8F0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Section Header */}
        <div className="max-w-2xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white border border-[#E2E8F0] text-[#475569]">
            Core Platform Capabilities
          </div>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-[#0F172A]">
            Everything You Need to Manage Subscriptions
          </h2>
          <p className="text-sm sm:text-base text-[#64748B] leading-relaxed">
            From customer onboarding to recurring payments, Brightloop simplifies every stage of your subscription lifecycle.
          </p>
        </div>

        {/* 6 Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="p-7 rounded-2xl bg-white border border-[#E2E8F0] shadow-sm hover:border-slate-300 transition-all space-y-4 group"
              >
                <div className="flex items-center justify-between">
                  <div className="w-11 h-11 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-[#0F172A] group-hover:bg-[#C8E63C] transition-colors">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#94A3B8]">
                    {feature.badge}
                  </span>
                </div>

                <div className="space-y-2">
                  <h3 className="text-base font-bold text-[#0F172A] group-hover:text-blue-600 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed">
                    {feature.description}
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

