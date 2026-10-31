'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getQuotationTemplatesApi,
  toggleQuotationTemplateStatusApi,
  duplicateQuotationTemplateApi,
} from '@/lib/queries/subscriptions';
import { formatINR } from '@/lib/queries/catalog';
import { QuotationTemplate } from '@/types/subscriptions';
import {
  FileSpreadsheet,
  Plus,
  Search,
  Copy,
  ToggleLeft,
  ToggleRight,
  ExternalLink,
  Layers,
  Clock,
  CheckCircle2,
  XCircle,
  Loader2,
} from 'lucide-react';

export default function QuotationTemplatesPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');

  const { data: templates, isLoading } = useQuery<QuotationTemplate[]>({
    queryKey: ['quotation-templates'],
    queryFn: getQuotationTemplatesApi,
  });

  const toggleMutation = useMutation({
    mutationFn: toggleQuotationTemplateStatusApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quotation-templates'] });
    },
  });

  const duplicateMutation = useMutation({
    mutationFn: duplicateQuotationTemplateApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quotation-templates'] });
    },
  });

  const filteredTemplates = templates?.filter((tpl: QuotationTemplate) => {
    const matchesSearch =
      tpl.name.toLowerCase().includes(search.toLowerCase()) ||
      (tpl.description && tpl.description.toLowerCase().includes(search.toLowerCase())) ||
      (tpl.defaultPlanName && tpl.defaultPlanName.toLowerCase().includes(search.toLowerCase()));

    if (!matchesSearch) return false;
    if (statusFilter === 'active') return tpl.isActive;
    if (statusFilter === 'inactive') return !tpl.isActive;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="rounded-3xl bg-white border border-[#F1F5F9] p-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-[#C8E63C]/30 text-[#0F172A] border border-[#C8E63C] mb-3">
            <FileSpreadsheet className="w-3.5 h-3.5 text-[#0F172A]" />
            Sales Operations
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#0F172A]">
            Quotation Templates
          </h1>
          <p className="text-[#64748B] text-sm mt-1 max-w-xl">
            Pre-configure standard customer packages, default subscription plans, line items, and quote validity periods for fast offer creation.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/quotations/templates/new"
            className="inline-flex items-center gap-2 rounded-xl bg-[#C8E63C] px-5 py-2.5 text-xs font-bold text-[#0F172A] hover:bg-[#B8DC30] shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            New Template
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
            placeholder="Search templates by name, plan or description..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E2E8F0] bg-white text-xs text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#C8E63C]"
          />
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-white border border-[#E2E8F0] self-start sm:self-auto text-xs font-semibold">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              statusFilter === 'all'
                ? 'bg-[#0F172A] text-white shadow-sm'
                : 'text-[#64748B] hover:text-[#0F172A]'
            }`}
          >
            All ({templates?.length || 0})
          </button>
          <button
            onClick={() => setStatusFilter('active')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              statusFilter === 'active'
                ? 'bg-[#0F172A] text-white shadow-sm'
                : 'text-[#64748B] hover:text-[#0F172A]'
            }`}
          >
            Active ({templates?.filter((t: QuotationTemplate) => t.isActive).length || 0})
          </button>
          <button
            onClick={() => setStatusFilter('inactive')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              statusFilter === 'inactive'
                ? 'bg-[#0F172A] text-white shadow-sm'
                : 'text-[#64748B] hover:text-[#0F172A]'
            }`}
          >
            Inactive ({templates?.filter((t: QuotationTemplate) => !t.isActive).length || 0})
          </button>
        </div>
      </div>

      {/* Templates Table Card */}
      <div className="rounded-2xl border border-[#F1F5F9] bg-white shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-xs text-[#94A3B8] flex flex-col items-center gap-3">
            <Loader2 className="w-6 h-6 animate-spin text-[#C8E63C]" />
            <span>Loading quotation templates...</span>
          </div>
        ) : filteredTemplates && filteredTemplates.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#F1F5F9] bg-slate-50/50 text-[10px] font-bold uppercase tracking-wider text-[#94A3B8]">
                  <th className="py-3.5 px-6">Template Name</th>
                  <th className="py-3.5 px-6">Default Plan</th>
                  <th className="py-3.5 px-6">Product Lines</th>
                  <th className="py-3.5 px-6">Validity</th>
                  <th className="py-3.5 px-6">Status</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F8FAFC]">
                {filteredTemplates.map((tpl: QuotationTemplate) => (
                  <tr key={tpl.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-4 px-6">
                      <Link
                        href={`/quotations/templates/${tpl.id}`}
                        className="font-bold text-sm text-[#0F172A] hover:text-blue-600 transition-colors flex items-center gap-1.5 group"
                      >
                        {tpl.name}
                        <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 text-blue-600 transition-opacity" />
                      </Link>
                      {tpl.description && (
                        <p className="text-[11px] text-[#64748B] line-clamp-1 mt-0.5">
                          {tpl.description}
                        </p>
                      )}
                    </td>

                    <td className="py-4 px-6">
                      {tpl.defaultPlanName ? (
                        <div className="space-y-0.5">
                          <div className="font-semibold text-xs text-[#0F172A] flex items-center gap-1.5">
                            <Layers className="w-3.5 h-3.5 text-blue-600" />
                            {tpl.defaultPlanName}
                          </div>
                          {tpl.defaultPlanPrice !== null && tpl.defaultPlanPrice !== undefined && (
                            <div className="text-[10px] text-[#94A3B8]">
                              {formatINR(tpl.defaultPlanPrice)} / {tpl.defaultPlanInterval}
                            </div>
                          )}
                        </div>
                      ) : (
                        <span className="text-[11px] text-[#94A3B8] italic">
                          No default plan
                        </span>
                      )}
                    </td>

                    <td className="py-4 px-6">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 text-[#334155]">
                        {tpl.lineCount ?? 0} {tpl.lineCount === 1 ? 'line' : 'lines'}
                      </span>
                    </td>

                    <td className="py-4 px-6">
                      <div className="inline-flex items-center gap-1.5 text-xs text-[#475569] font-medium">
                        <Clock className="w-3.5 h-3.5 text-[#94A3B8]" />
                        {tpl.validityDays} days
                      </div>
                    </td>

                    <td className="py-4 px-6">
                      {tpl.isActive ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-600 border border-slate-200">
                          <XCircle className="w-3 h-3 text-slate-500" />
                          Inactive
                        </span>
                      )}
                    </td>

                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/quotations/templates/${tpl.id}`}
                          className="px-2.5 py-1 rounded-lg text-xs font-semibold text-[#0F172A] bg-slate-100 hover:bg-slate-200 transition-colors"
                        >
                          View & Edit
                        </Link>
                        <button
                          onClick={() => duplicateMutation.mutate(tpl.id)}
                          title="Duplicate template"
                          className="p-1.5 rounded-lg text-[#64748B] hover:text-[#0F172A] hover:bg-slate-100 transition-colors cursor-pointer"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => toggleMutation.mutate(tpl.id)}
                          title={tpl.isActive ? 'Deactivate template' : 'Activate template'}
                          className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                            tpl.isActive
                              ? 'text-red-500 hover:bg-red-50'
                              : 'text-emerald-600 hover:bg-emerald-50'
                          }`}
                        >
                          {tpl.isActive ? (
                            <ToggleRight className="w-4 h-4 text-emerald-600" />
                          ) : (
                            <ToggleLeft className="w-4 h-4 text-slate-400" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[#C8E63C]/30 text-[#0F172A] flex items-center justify-center mx-auto">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-[#0F172A]">No Templates Found</h3>
            <p className="text-xs text-[#64748B] max-w-sm mx-auto">
              Create your first reusable quotation template to speed up customer offer preparation.
            </p>
            <Link
              href="/quotations/templates/new"
              className="inline-flex items-center gap-2 rounded-xl bg-[#0F172A] px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800 transition-all mt-2"
            >
              <Plus className="w-3.5 h-3.5" />
              Create First Template
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
