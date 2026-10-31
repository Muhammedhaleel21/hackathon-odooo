'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { getSubscriptionsApi } from '@/lib/queries/subscriptions';
import { formatINR } from '@/lib/queries/catalog';
import { Subscription } from '@/types/subscriptions';
import {
  FileText,
  Plus,
  Search,
  ExternalLink,
  Layers,
  Clock,
  CheckCircle2,
  Loader2,
  FileSpreadsheet,
  ArrowRight,
} from 'lucide-react';

export default function QuotationsListPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const { data: allItems, isLoading } = useQuery<Subscription[]>({
    queryKey: ['subscriptions', statusFilter, search],
    queryFn: () =>
      getSubscriptionsApi({
        status: statusFilter === 'all' ? undefined : statusFilter,
        search: search || undefined,
      }),
  });

  // For this quotations page, focus on draft, quotation, and confirmed offers
  const quotations = allItems?.filter((item: Subscription) =>
    statusFilter === 'all'
      ? ['draft', 'quotation', 'confirmed'].includes(item.status)
      : item.status === statusFilter,
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'draft':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
            Draft
          </span>
        );
      case 'quotation':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
            <Clock className="w-3 h-3 text-blue-600" />
            Issued
          </span>
        );
      case 'confirmed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            Confirmed
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
            <FileText className="w-3.5 h-3.5 text-[#0F172A]" />
            Sales Quotations
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#0F172A]">
            Customer Quotations
          </h1>
          <p className="text-[#64748B] text-sm mt-1 max-w-xl">
            Prepare customer-specific offers with snapshot pricing and GST tax calculations. Progress offers from Draft to Issued, Confirmed, and Subscriptions.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/quotations/templates"
            className="inline-flex items-center gap-2 rounded-xl border border-[#E2E8F0] bg-white px-4 py-2.5 text-xs font-bold text-[#334155] hover:bg-slate-50 transition-all"
          >
            <FileSpreadsheet className="w-4 h-4 text-[#64748B]" />
            Templates
          </Link>
          <Link
            href="/quotations/new"
            className="inline-flex items-center gap-2 rounded-xl bg-[#C8E63C] px-5 py-2.5 text-xs font-bold text-[#0F172A] hover:bg-[#B8DC30] shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            New Quotation
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
            placeholder="Search by quote # (QT-2026-...) or customer name..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E2E8F0] bg-white text-xs text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#C8E63C]"
          />
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-white border border-[#E2E8F0] self-start sm:self-auto text-xs font-semibold overflow-x-auto">
          {['all', 'draft', 'quotation', 'confirmed'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg capitalize transition-all whitespace-nowrap cursor-pointer ${
                statusFilter === st
                  ? 'bg-[#0F172A] text-white shadow-sm'
                  : 'text-[#64748B] hover:text-[#0F172A]'
              }`}
            >
              {st === 'all' ? 'All Offers' : st === 'quotation' ? 'Issued' : st}
            </button>
          ))}
        </div>
      </div>

      {/* Quotations Table */}
      <div className="rounded-2xl border border-[#F1F5F9] bg-white shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-xs text-[#94A3B8] flex flex-col items-center gap-3">
            <Loader2 className="w-6 h-6 animate-spin text-[#C8E63C]" />
            <span>Loading quotations...</span>
          </div>
        ) : quotations && quotations.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#F1F5F9] bg-slate-50/50 text-[10px] font-bold uppercase tracking-wider text-[#94A3B8]">
                  <th className="py-3.5 px-6">Quote Number</th>
                  <th className="py-3.5 px-6">Customer</th>
                  <th className="py-3.5 px-6">Billing Plan</th>
                  <th className="py-3.5 px-6">Total Amount (Inc. GST)</th>
                  <th className="py-3.5 px-6">Validity</th>
                  <th className="py-3.5 px-6">Status</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F8FAFC]">
                {quotations.map((q: Subscription) => (
                  <tr key={q.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-4 px-6">
                      <Link
                        href={`/quotations/${q.id}`}
                        className="font-bold text-sm text-[#0F172A] hover:text-blue-600 transition-colors flex items-center gap-1.5 group font-mono"
                      >
                        {q.quotationNumber}
                        <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 text-blue-600 transition-opacity" />
                      </Link>
                      <div className="text-[10px] text-[#94A3B8] mt-0.5">
                        Created {new Date(q.createdAt).toLocaleDateString()}
                      </div>
                    </td>

                    <td className="py-4 px-6">
                      <div className="font-semibold text-xs text-[#0F172A]">
                        {q.customerName}
                      </div>
                      <div className="text-[11px] text-[#94A3B8]">
                        {q.customerEmail}
                      </div>
                    </td>

                    <td className="py-4 px-6">
                      <div className="font-medium text-xs text-[#0F172A] flex items-center gap-1.5">
                        <Layers className="w-3.5 h-3.5 text-blue-600" />
                        {q.planName}
                      </div>
                      <div className="text-[10px] text-[#94A3B8] capitalize">
                        Interval: {q.billingInterval}
                      </div>
                    </td>

                    <td className="py-4 px-6">
                      <div className="font-extrabold text-sm text-[#0F172A]">
                        {formatINR(q.totalAmount)}
                      </div>
                      <div className="text-[10px] text-[#94A3B8]">
                        Subtotal: {formatINR(q.subtotal)} + GST: {formatINR(q.taxTotal)}
                      </div>
                    </td>

                    <td className="py-4 px-6">
                      {q.quotationValidUntil ? (
                        <div className="inline-flex items-center gap-1.5 text-xs text-[#475569] font-medium">
                          <Clock className="w-3.5 h-3.5 text-amber-600" />
                          Until {new Date(q.quotationValidUntil).toLocaleDateString()}
                        </div>
                      ) : (
                        <span className="text-[11px] text-[#94A3B8] italic">
                          Draft (unset)
                        </span>
                      )}
                    </td>

                    <td className="py-4 px-6">
                      {getStatusBadge(q.status)}
                    </td>

                    <td className="py-4 px-6 text-right">
                      <Link
                        href={`/quotations/${q.id}`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-[#0F172A] bg-[#C8E63C]/30 hover:bg-[#C8E63C] transition-colors"
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
              <FileText className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-[#0F172A]">No Quotations Found</h3>
            <p className="text-xs text-[#64748B] max-w-sm mx-auto">
              Create a new customer offer directly or start from an existing quotation template.
            </p>
            <Link
              href="/quotations/new"
              className="inline-flex items-center gap-2 rounded-xl bg-[#0F172A] px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800 transition-all mt-2"
            >
              <Plus className="w-3.5 h-3.5" />
              Create First Quotation
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
