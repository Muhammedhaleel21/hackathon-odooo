'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getSubscriptionApi,
  issueQuotationApi,
  confirmQuotationApi,
  activateSubscriptionApi,
} from '@/lib/queries/subscriptions';
import { formatINR } from '@/lib/queries/catalog';
import {
  Subscription,
  SubscriptionLine,
  SubscriptionStatusHistoryItem,
} from '@/types/subscriptions';
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  Sparkles,
  Layers,
  User,
  CreditCard,
  Printer,
  Loader2,
  AlertCircle,
  History,
  ShieldCheck,
  ArrowRight,
} from 'lucide-react';

export default function QuotationDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);

  const { data: quotation, isLoading } = useQuery<Subscription>({
    queryKey: ['subscription', id],
    queryFn: () => getSubscriptionApi(id),
    enabled: !!id,
  });

  const issueMutation = useMutation({
    mutationFn: () => issueQuotationApi(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscription', id] });
      queryClient.invalidateQueries({ queryKey: ['subscriptions'] });
    },
    onError: (err: Error) => setError(err.message),
  });

  const confirmMutation = useMutation({
    mutationFn: () => confirmQuotationApi(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscription', id] });
      queryClient.invalidateQueries({ queryKey: ['subscriptions'] });
    },
    onError: (err: Error) => setError(err.message),
  });

  const activateMutation = useMutation({
    mutationFn: () => activateSubscriptionApi(id),
    onSuccess: (sub: Subscription) => {
      queryClient.invalidateQueries({ queryKey: ['subscription', id] });
      queryClient.invalidateQueries({ queryKey: ['subscriptions'] });
      router.push(`/subscriptions/${sub.id}`);
    },
    onError: (err: Error) => setError(err.message),
  });

  if (isLoading) {
    return (
      <div className="p-16 text-center text-xs text-[#94A3B8] flex flex-col items-center gap-3">
        <Loader2 className="w-6 h-6 animate-spin text-[#C8E63C]" />
        <span>Loading quotation details...</span>
      </div>
    );
  }

  if (!quotation) {
    return (
      <div className="p-8 text-center text-sm text-[#0F172A]">
        Quotation not found.
      </div>
    );
  }

  // Lifecycle steps progression
  const steps = [
    { key: 'draft', label: 'Draft' },
    { key: 'quotation', label: 'Quotation (Issued)' },
    { key: 'confirmed', label: 'Confirmed' },
    { key: 'active', label: 'Active Subscription' },
    { key: 'closed', label: 'Closed' },
  ];

  const currentStepIdx = steps.findIndex((s) => s.key === quotation.status);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header and Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/quotations"
            className="p-2 rounded-xl bg-white border border-[#E2E8F0] text-[#64748B] hover:text-[#0F172A] hover:bg-slate-50 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-[#94A3B8] flex items-center gap-2">
              <span>Customer Quotation</span>
              {quotation.subscriptionNumber && (
                <span className="font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-[10px] font-bold">
                  Active: {quotation.subscriptionNumber}
                </span>
              )}
            </div>
            <h1 className="text-2xl font-black text-[#0F172A] font-mono">
              {quotation.quotationNumber}
            </h1>
          </div>
        </div>

        {/* Action Buttons based on status */}
        <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
          {quotation.status === 'draft' && (
            <>
              <button
                onClick={() => issueMutation.mutate()}
                disabled={issueMutation.isPending}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-[#C8E63C] text-[#0F172A] hover:bg-[#B8DC30] transition-all shadow-sm cursor-pointer disabled:opacity-50"
              >
                {issueMutation.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Clock className="w-3.5 h-3.5" />
                )}
                Issue Quotation
              </button>
              <button
                onClick={() => confirmMutation.mutate()}
                disabled={confirmMutation.isPending}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-[#0F172A] text-white hover:bg-slate-800 transition-all shadow-sm cursor-pointer disabled:opacity-50"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                Confirm Order
              </button>
            </>
          )}

          {quotation.status === 'quotation' && (
            <button
              onClick={() => confirmMutation.mutate()}
              disabled={confirmMutation.isPending}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-[#C8E63C] text-[#0F172A] hover:bg-[#B8DC30] transition-all shadow-sm cursor-pointer disabled:opacity-50"
            >
              {confirmMutation.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <CheckCircle2 className="w-4 h-4" />
              )}
              Confirm Offer
            </button>
          )}

          {quotation.status === 'confirmed' && (
            <button
              onClick={() => activateMutation.mutate()}
              disabled={activateMutation.isPending}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-[#C8E63C] text-[#0F172A] hover:bg-[#B8DC30] transition-all shadow-sm cursor-pointer disabled:opacity-50"
            >
              {activateMutation.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Sparkles className="w-4 h-4" />
              )}
              Activate Subscription
            </button>
          )}

          {quotation.status === 'active' && quotation.subscriptionNumber && (
            <Link
              href={`/subscriptions/${quotation.id}`}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-700 transition-all shadow-sm"
            >
              View Active Subscription
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          )}

          <button
            onClick={() => window.print()}
            className="p-2.5 rounded-xl border border-[#E2E8F0] bg-white text-[#64748B] hover:text-[#0F172A] hover:bg-slate-50 transition-colors cursor-pointer"
            title="Print Quotation"
          >
            <Printer className="w-4 h-4" />
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-600 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Lifecycle Progress Bar */}
      <div className="p-6 rounded-2xl bg-white border border-[#F1F5F9] shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-bold uppercase tracking-wider text-[#94A3B8]">
            Quotation & Subscription Lifecycle
          </span>
          <span className="text-xs font-bold text-[#0F172A] capitalize">
            Status: {quotation.status}
          </span>
        </div>

        <div className="grid grid-cols-5 gap-2 relative">
          {steps.map((step, idx) => {
            const isCompleted = idx <= currentStepIdx;
            const isCurrent = idx === currentStepIdx;
            return (
              <div key={step.key} className="flex flex-col items-center text-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all mb-2 ${
                    isCurrent
                      ? 'bg-[#C8E63C] text-[#0F172A] ring-4 ring-[#C8E63C]/30'
                      : isCompleted
                      ? 'bg-[#0F172A] text-white'
                      : 'bg-slate-100 text-[#94A3B8]'
                  }`}
                >
                  {idx + 1}
                </div>
                <span
                  className={`text-[11px] font-semibold ${
                    isCurrent
                      ? 'text-[#0F172A] font-bold'
                      : isCompleted
                      ? 'text-[#334155]'
                      : 'text-[#94A3B8]'
                  }`}
                >
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quotation Details Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main 2 Cols: Customer, Plan & Lines */}
        <div className="lg:col-span-2 space-y-6">
          {/* Metadata Card */}
          <div className="p-6 rounded-2xl bg-white border border-[#F1F5F9] shadow-sm grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <span className="text-[11px] font-semibold text-[#94A3B8] uppercase block">
                Customer Recipient
              </span>
              <div className="text-sm font-bold text-[#0F172A] mt-1 flex items-center gap-1.5">
                <User className="w-4 h-4 text-blue-600" />
                {quotation.customerName}
              </div>
              <div className="text-xs text-[#64748B] mt-0.5">{quotation.customerEmail}</div>
            </div>

            <div>
              <span className="text-[11px] font-semibold text-[#94A3B8] uppercase block">
                Target Subscription Plan
              </span>
              <div className="text-sm font-bold text-[#0F172A] mt-1 flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-emerald-600" />
                {quotation.planName}
              </div>
              <div className="text-xs text-[#64748B] mt-0.5 capitalize">
                Recurring {quotation.billingInterval} billing
              </div>
            </div>

            <div>
              <span className="text-[11px] font-semibold text-[#94A3B8] uppercase block">
                Quotation Validity
              </span>
              <div className="text-sm font-semibold text-[#0F172A] mt-1 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-amber-600" />
                {quotation.quotationValidUntil
                  ? new Date(quotation.quotationValidUntil).toLocaleDateString()
                  : 'Valid upon issuance'}
              </div>
            </div>

            <div>
              <span className="text-[11px] font-semibold text-[#94A3B8] uppercase block">
                Payment Terms
              </span>
              <div className="text-sm font-semibold text-[#0F172A] mt-1 flex items-center gap-1.5 capitalize">
                <CreditCard className="w-4 h-4 text-purple-600" />
                {quotation.paymentTerms.replace('_', ' ')}
              </div>
            </div>
          </div>

          {/* Line Items Table */}
          <div className="rounded-2xl border border-[#F1F5F9] bg-white shadow-sm overflow-hidden">
            <div className="p-4 px-6 border-b border-[#F1F5F9] flex items-center justify-between">
              <h2 className="text-xs font-bold uppercase tracking-wider text-[#94A3B8]">
                Snapshotted Offer Lines
              </h2>
              <span className="text-xs font-semibold text-[#475569]">
                {quotation.lines?.length || 0} Lines
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-50/50 text-[10px] font-bold uppercase text-[#94A3B8] border-b border-[#F1F5F9]">
                    <th className="py-3 px-6">Product & Options</th>
                    <th className="py-3 px-6">Qty</th>
                    <th className="py-3 px-6 text-right">Unit Price</th>
                    <th className="py-3 px-6 text-right">GST (18%)</th>
                    <th className="py-3 px-6 text-right">Line Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F8FAFC]">
                  {quotation.lines?.map((line: SubscriptionLine) => (
                    <tr key={line.id}>
                      <td className="py-4 px-6">
                        <div className="font-bold text-sm text-[#0F172A]">
                          {line.productName}
                        </div>
                        {line.variantName && (
                          <div className="text-[11px] text-[#64748B] mt-0.5">
                            {line.variantName}
                          </div>
                        )}
                      </td>
                      <td className="py-4 px-6 font-semibold text-[#0F172A]">
                        {line.quantity}
                      </td>
                      <td className="py-4 px-6 text-right font-medium text-[#0F172A]">
                        {formatINR(line.unitPrice)}
                      </td>
                      <td className="py-4 px-6 text-right font-medium text-[#64748B]">
                        {formatINR(line.taxAmount)}
                      </td>
                      <td className="py-4 px-6 text-right font-black text-[#0F172A]">
                        {formatINR(line.lineTotal)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Audit History Timeline */}
          <div className="p-6 rounded-2xl bg-white border border-[#F1F5F9] shadow-sm space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-[#F1F5F9]">
              <History className="w-4 h-4 text-[#64748B]" />
              <h2 className="text-sm font-bold text-[#0F172A]">Status History & Audit Trail</h2>
            </div>

            <div className="space-y-4">
              {quotation.statusHistory && quotation.statusHistory.length > 0 ? (
                quotation.statusHistory.map((item: SubscriptionStatusHistoryItem) => (
                  <div key={item.id} className="flex items-start gap-3 relative">
                    <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center shrink-0 mt-0.5 text-[#0F172A]">
                      <ShieldCheck className="w-3.5 h-3.5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[#0F172A] capitalize">
                          {item.newStatus} State
                        </span>
                        <span className="text-[10px] text-[#94A3B8]">
                          {new Date(item.createdAt).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-xs text-[#64748B] mt-0.5">{item.reason}</p>
                      {item.changedByName && (
                        <div className="text-[10px] text-[#94A3B8] mt-0.5">
                          Triggered by: {item.changedByName}
                        </div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-xs text-[#94A3B8]">No history recorded yet.</div>
              )}
            </div>
          </div>
        </div>

        {/* Right Col: Totals & Summary */}
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-white border border-[#F1F5F9] shadow-sm space-y-4 sticky top-24">
            <h2 className="text-sm font-bold text-[#0F172A] pb-3 border-b border-[#F1F5F9]">
              Commercial Summary
            </h2>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between text-[#64748B]">
                <span>Lines Subtotal</span>
                <span className="font-semibold text-[#0F172A]">{formatINR(quotation.subtotal)}</span>
              </div>

              <div className="flex items-center justify-between text-[#64748B]">
                <span>Taxes (18% GST)</span>
                <span className="font-semibold text-[#0F172A]">{formatINR(quotation.taxTotal)}</span>
              </div>

              <div className="pt-3 border-t border-[#F1F5F9] flex items-center justify-between">
                <div>
                  <span className="font-bold text-sm text-[#0F172A] block">Total Amount</span>
                  <span className="text-[10px] text-[#94A3B8]">Paise precision</span>
                </div>
                <div className="text-xl font-black text-[#0F172A]">
                  {formatINR(quotation.totalAmount)}
                </div>
              </div>
            </div>

            {quotation.notes && (
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs text-[#64748B] mt-4">
                <span className="font-bold text-[#0F172A] block mb-1">Terms & Notes:</span>
                {quotation.notes}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
