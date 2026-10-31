'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { getSubscriptionsApi } from '@/lib/queries/subscriptions';
import { formatINR } from '@/lib/queries/catalog';
import { Subscription } from '@/types/subscriptions';
import {
  Sparkles,
  Search,
  ExternalLink,
  Layers,
  Calendar,
  XCircle,
  Clock,
  Loader2,
  ArrowRight,
} from 'lucide-react';

export default function SubscriptionsListPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'confirmed' | 'closed'>('all');

  const { data: allSubscriptions, isLoading } = useQuery<Subscription[]>({
    queryKey: ['subscriptions', statusFilter, search],
    queryFn: () =>
      getSubscriptionsApi({
        status: statusFilter === 'all' ? undefined : statusFilter,
        search: search || undefined,
      }),
  });

  // Filter subscriptions that have progressed to confirmed, active, or closed
  const subscriptions = allSubscriptions?.filter((sub: Subscription) => {
    if (statusFilter === 'all') {
      return ['confirmed', 'active', 'closed'].includes(sub.status) || !!sub.subscriptionNumber;
    }
    return sub.status === statusFilter;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Active
          </span>
        );
      case 'confirmed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
            <Clock className="w-3 h-3 text-blue-600" />
            Confirmed
          </span>
        );
      case 'closed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-100 text-slate-600 border border-slate-200">
            <XCircle className="w-3 h-3 text-slate-500" />
            Closed
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-purple-50 text-purple-700 border border-purple-200 capitalize">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="rounded-3xl bg-white border border-[#F1F5F9] p-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-[#C8E63C]/30 text-[#0F172A] border border-[#C8E63C] mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#0F172A]" />
            Recurring Subscriptions
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#0F172A]">
            Subscriptions Center
          </h1>
          <p className="text-[#64748B] text-sm mt-1 max-w-xl">
            Track active customer contracts, renewal schedules, assigned subscription identifiers, and contract lifecycle transitions.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/quotations/new"
            className="inline-flex items-center gap-2 rounded-xl bg-[#C8E63C] px-5 py-2.5 text-xs font-bold text-[#0F172A] hover:bg-[#B8DC30] shadow-sm transition-all"
          >
            Create New Offer
          </Link>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by subscription # (SUB-2026-...) or customer..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E2E8F0] bg-white text-xs text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#C8E63C]"
          />
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-white border border-[#E2E8F0] self-start sm:self-auto text-xs font-semibold">
          {(['all', 'active', 'confirmed', 'closed'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg capitalize transition-all whitespace-nowrap cursor-pointer ${
                statusFilter === st
                  ? 'bg-[#0F172A] text-white shadow-sm'
                  : 'text-[#64748B] hover:text-[#0F172A]'
              }`}
            >
              {st === 'all' ? 'All Subscriptions' : st}
            </button>
          ))}
        </div>
      </div>

      {/* Subscriptions Table */}
      <div className="rounded-2xl border border-[#F1F5F9] bg-white shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-xs text-[#94A3B8] flex flex-col items-center gap-3">
            <Loader2 className="w-6 h-6 animate-spin text-[#C8E63C]" />
            <span>Loading subscriptions...</span>
          </div>
        ) : subscriptions && subscriptions.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#F1F5F9] bg-slate-50/50 text-[10px] font-bold uppercase tracking-wider text-[#94A3B8]">
                  <th className="py-3.5 px-6">Subscription #</th>
                  <th className="py-3.5 px-6">Quote Ref</th>
                  <th className="py-3.5 px-6">Customer</th>
                  <th className="py-3.5 px-6">Plan & Interval</th>
                  <th className="py-3.5 px-6">Active Term</th>
                  <th className="py-3.5 px-6">Recurring Total</th>
                  <th className="py-3.5 px-6">Status</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F8FAFC]">
                {subscriptions.map((sub: Subscription) => (
                  <tr key={sub.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-4 px-6 font-mono font-bold text-sm text-[#0F172A]">
                      <Link
                        href={`/subscriptions/${sub.id}`}
                        className="hover:text-blue-600 transition-colors flex items-center gap-1.5 group"
                      >
                        {sub.subscriptionNumber || (
                          <span className="text-[#94A3B8] italic font-sans text-xs">
                            Pending Activation
                          </span>
                        )}
                        <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 text-blue-600 transition-opacity" />
                      </Link>
                    </td>

                    <td className="py-4 px-6 font-mono text-xs text-[#64748B]">
                      <Link
                        href={`/quotations/${sub.id}`}
                        className="hover:underline text-blue-600"
                      >
                        {sub.quotationNumber}
                      </Link>
                    </td>

                    <td className="py-4 px-6">
                      <div className="font-semibold text-xs text-[#0F172A]">
                        {sub.customerName}
                      </div>
                      <div className="text-[11px] text-[#94A3B8]">
                        {sub.customerEmail}
                      </div>
                    </td>

                    <td className="py-4 px-6">
                      <div className="font-medium text-xs text-[#0F172A] flex items-center gap-1.5">
                        <Layers className="w-3.5 h-3.5 text-blue-600" />
                        {sub.planName}
                      </div>
                      <div className="text-[10px] text-[#94A3B8] capitalize">
                        Every {sub.billingInterval}
                      </div>
                    </td>

                    <td className="py-4 px-6">
                      {sub.startDate && sub.expiryDate ? (
                        <div className="space-y-0.5">
                          <div className="text-[11px] font-semibold text-[#0F172A] flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-[#94A3B8]" />
                            {new Date(sub.startDate).toLocaleDateString()} →{' '}
                            {new Date(sub.expiryDate).toLocaleDateString()}
                          </div>
                        </div>
                      ) : (
                        <span className="text-[11px] text-[#94A3B8] italic">
                          Term not started
                        </span>
                      )}
                    </td>

                    <td className="py-4 px-6">
                      <div className="font-extrabold text-sm text-[#0F172A]">
                        {formatINR(sub.totalAmount)}
                      </div>
                      <div className="text-[10px] text-[#94A3B8]">
                        / {sub.billingInterval}
                      </div>
                    </td>

                    <td className="py-4 px-6">
                      {getStatusBadge(sub.status)}
                    </td>

                    <td className="py-4 px-6 text-right">
                      <Link
                        href={`/subscriptions/${sub.id}`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-[#0F172A] bg-slate-100 hover:bg-slate-200 transition-colors"
                      >
                        Manage
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[#C8E63C]/30 text-[#0F172A] flex items-center justify-center mx-auto">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-[#0F172A]">No Active Subscriptions</h3>
            <p className="text-xs text-[#64748B] max-w-sm mx-auto">
              Subscriptions are generated once quotations are confirmed and activated.
            </p>
            <Link
              href="/quotations"
              className="inline-flex items-center gap-2 rounded-xl bg-[#0F172A] px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800 transition-all mt-2"
            >
              Browse Quotations
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
