'use client';

import React from 'react';
import { useAuth, getDashboardPath } from '../../../hooks/use-auth';
import {
  UserCheck,
  FileText,
  CreditCard,
  Users,
  AlertTriangle,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';
import Link from 'next/link';

export default function StaffDashboardPage() {
  const { user } = useAuth();

  // Role Guard: Only Staff and Admin can view staff dashboard
  if (user && user.role === 'customer') {
    return (
      <div className="max-w-xl mx-auto my-16 p-8 rounded-2xl bg-red-500/10 border border-red-500/20 text-center">
        <AlertTriangle className="w-12 h-12 text-red-400 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-white mb-2">Access Denied (403)</h2>
        <p className="text-sm text-gray-400 mb-6">
          The Staff Dashboard is reserved for internal business operations. Customers
          do not have permission to access operational tools.
        </p>
        <Link
          href={getDashboardPath(user.role)}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm bg-white/10 hover:bg-white/15 text-white transition-all"
        >
          Go to Customer Portal
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-blue-900/30 via-indigo-900/20 to-black border border-blue-500/20">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/15 text-blue-300 border border-blue-500/30 mb-3">
          <UserCheck className="w-3.5 h-3.5" />
          Staff Operations
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-white">
          Operational Workspace
        </h1>
        <p className="text-gray-400 text-sm mt-1 max-w-xl">
          Manage subscriptions, prepare customer quotations, record payments, and handle
          invoices.
        </p>
      </div>

      {/* Staff Role Boundary Notice */}
      <div className="p-4 rounded-xl bg-blue-950/30 border border-blue-500/20 flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
        <div className="text-xs text-gray-300 leading-relaxed">
          <strong className="text-white">Role Scope:</strong> As a staff member, you have
          operational access to customer records, quotations, and subscriptions. Administrative
          tasks (such as creating other staff members, altering tax policies, and managing global
          settings) require an Administrator account.
        </div>
      </div>

      {/* Operational Modules Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl bg-gray-900/60 border border-white/10 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/15 text-blue-400 flex items-center justify-center">
            <Users className="w-5 h-5" />
          </div>
          <h3 className="font-semibold text-white">Customers</h3>
          <p className="text-xs text-gray-400">
            View customer directories, contact details, and assigned subscription tiers.
          </p>
          <span className="inline-block text-[11px] font-medium text-blue-400">
            Phase 3 Integration
          </span>
        </div>

        <div className="p-6 rounded-2xl bg-gray-900/60 border border-white/10 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-purple-500/15 text-purple-400 flex items-center justify-center">
            <FileText className="w-5 h-5" />
          </div>
          <h3 className="font-semibold text-white">Quotations & Orders</h3>
          <p className="text-xs text-gray-400">
            Draft subscription quotations, calculate custom pricing, and send to customers.
          </p>
          <span className="inline-block text-[11px] font-medium text-purple-400">
            Phase 4 Integration
          </span>
        </div>

        <div className="p-6 rounded-2xl bg-gray-900/60 border border-white/10 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center">
            <CreditCard className="w-5 h-5" />
          </div>
          <h3 className="font-semibold text-white">Invoices & Payments</h3>
          <p className="text-xs text-gray-400">
            Track subscription recurring invoices and record incoming payments.
          </p>
          <span className="inline-block text-[11px] font-medium text-emerald-400">
            Phase 5 Integration
          </span>
        </div>
      </div>
    </div>
  );
}
