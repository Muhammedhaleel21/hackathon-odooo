'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../../hooks/use-auth';
import {
  Package,
  Layers,
  LayoutDashboard,
  Users,
  Settings,
  FileText,
  CreditCard,
  UserCheck,
  Tag,
  BarChart3,
  Receipt,
  Sparkles,
} from 'lucide-react';

export function DashboardSidebar() {
  const pathname = usePathname();
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  const navItems = [
    {
      label: 'Overview',
      href: isAdmin ? '/admin' : '/staff',
      icon: LayoutDashboard,
      active: pathname === '/admin' || pathname === '/staff',
    },
    {
      label: 'Products',
      href: '/admin/products',
      icon: Package,
      active: pathname.startsWith('/admin/products'),
    },
    {
      label: 'Subscription Plans',
      href: '/admin/plans',
      icon: Layers,
      active: pathname.startsWith('/admin/plans'),
    },
    ...(isAdmin
      ? [
          {
            label: 'Staff Members',
            href: '/admin/staff',
            icon: UserCheck,
            active: pathname === '/admin/staff',
          },
        ]
      : []),
  ];

  const upcomingPhases = [
    { label: 'Quotations', icon: FileText, phase: 'Phase 4' },
    { label: 'Subscriptions', icon: Sparkles, phase: 'Phase 5' },
    { label: 'Invoices', icon: Receipt, phase: 'Phase 6' },
    { label: 'Discounts', icon: Tag, phase: 'Phase 7' },
    { label: 'Payments', icon: CreditCard, phase: 'Phase 8' },
    { label: 'Reports', icon: BarChart3, phase: 'Phase 9' },
  ];

  return (
    <aside className="w-64 bg-white border-r border-[#E2E8F0] flex flex-col justify-between shrink-0 h-[calc(100vh-4rem)] sticky top-16 select-none overflow-y-auto">
      <div className="p-4 space-y-6">
        {/* Main Navigation Group */}
        <div className="space-y-1.5">
          <div className="px-3 text-[11px] font-semibold uppercase tracking-wider text-[#94A3B8] mb-2">
            Catalog & Ops
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm transition-all ${
                  item.active
                    ? 'bg-[#C8E63C] text-[#0F172A] font-semibold shadow-sm'
                    : 'text-[#64748B] hover:text-[#0F172A] hover:bg-slate-100/70 font-medium'
                }`}
              >
                <Icon className={`w-4 h-4 ${item.active ? 'text-[#0F172A]' : 'text-[#64748B]'}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>

        {/* Future Hackathon Modules Group */}
        <div className="space-y-1">
          <div className="px-3 text-[11px] font-semibold uppercase tracking-wider text-[#94A3B8] mb-2">
            Upcoming Phases
          </div>
          {upcomingPhases.map((phase) => {
            const Icon = phase.icon;
            return (
              <div
                key={phase.label}
                className="flex items-center justify-between px-3.5 py-2 rounded-xl text-xs text-[#94A3B8] hover:text-[#64748B] transition-colors"
                title={`${phase.label} will be active in ${phase.phase}`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-3.5 h-3.5 text-[#CBD5E1]" />
                  <span>{phase.label}</span>
                </div>
                <span className="text-[10px] bg-slate-100 text-[#64748B] px-1.5 py-0.5 rounded font-mono">
                  {phase.phase}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Pinned Settings & Role */}
      <div className="p-4 border-t border-[#F1F5F9] space-y-2">
        <div className="flex items-center justify-between px-3 py-2 rounded-xl text-xs text-[#64748B]">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-medium text-[#334155]">Neon Postgres</span>
          </div>
          <span className="text-[10px] text-emerald-600 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded-full font-medium">
            Connected
          </span>
        </div>
      </div>
    </aside>
  );
}

