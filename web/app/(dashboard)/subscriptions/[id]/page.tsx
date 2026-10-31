'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getSubscriptionApi,
  closeSubscriptionApi,
} from '@/lib/queries/subscriptions';
import { formatINR } from '@/lib/queries/catalog';
import {
  Subscription,
  SubscriptionLine,
  SubscriptionStatusHistoryItem,
} from '@/types/subscriptions';
import {
  ArrowLeft,
  Calendar,
  Layers,
  User,
  Loader2,
  AlertCircle,
  History,
  ShieldCheck,
  Ban,
  Printer,
} from 'lucide-react';

export default function SubscriptionDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const queryClient = useQueryClient();

  const [isClosingModalOpen, setIsClosingModalOpen] = useState(false);
  const [closeReason, setCloseReason] = useState('');
  const [error, setError] = useState<string | null>(null);

  const { data: subscription, isLoading } = useQuery<Subscription>({
    queryKey: ['subscription', id],
    queryFn: () => getSubscriptionApi(id),
    enabled: !!id,
  });

  const closeMutation = useMutation({
    mutationFn: () => closeSubscriptionApi(id, closeReason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscription', id] });
      queryClient.invalidateQueries({ queryKey: ['subscriptions'] });
      setIsClosingModalOpen(false);
      setCloseReason('');
    },
    onError: (err: Error) => setError(err.message),
  });

  if (isLoading) {
    return (
      <div className="p-16 text-center text-xs text-[#94A3B8] flex flex-col items-center gap-3">
        <Loader2 className="w-6 h-6 animate-spin text-[#C8E63C]" />
        <span>Loading subscription details...</span>
      </div>
    );
  }

  if (!subscription) {
    return (
      <div className="p-8 text-center text-sm text-[#0F172A]">
        Subscription not found.
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/subscriptions"
            className="p-2 rounded-xl bg-white border border-[#E2E8F0] text-[#64748B] hover:text-[#0F172A] hover:bg-slate-50 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-[#94A3B8] flex items-center gap-2">
              <span>Subscription Contract</span>
              <span className="text-slate-400">·</span>
              <Link
                href={`/quotations/${subscription.id}`}
                className="text-blue-600 hover:underline font-mono"
              >
                Quote: {subscription.quotationNumber}
              </Link>
            </div>
            <h1 className="text-2xl font-black text-[#0F172A] font-mono">
              {subscription.subscriptionNumber || 'Pending Number Assignment'}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {subscription.status === 'active' && (
            <button
              onClick={() => setIsClosingModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 transition-colors cursor-pointer"
            >
              <Ban className="w-3.5 h-3.5" />
              Close Subscription
            </button>
          )}

          <button
            onClick={() => window.print()}
            className="p-2.5 rounded-xl border border-[#E2E8F0] bg-white text-[#64748B] hover:text-[#0F172A] hover:bg-slate-50 transition-colors cursor-pointer"
            title="Print Contract"
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

      {/* Subscription Status & Term Banner */}
      <div className="p-6 rounded-2xl bg-white border border-[#F1F5F9] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#94A3B8]">
            Subscription Status
          </span>
          <div className="flex items-center gap-3">
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold capitalize ${
                subscription.status === 'active'
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : subscription.status === 'closed'
                  ? 'bg-slate-100 text-slate-600 border border-slate-200'
                  : 'bg-blue-50 text-blue-700 border border-blue-200'
              }`}
            >
              {subscription.status === 'active' && (
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              )}
              {subscription.status}
            </span>

            {subscription.activatedAt && (
              <span className="text-xs text-[#64748B]">
                Activated on {new Date(subscription.activatedAt).toLocaleDateString()}
              </span>
            )}
          </div>
        </div>

        {subscription.startDate && subscription.expiryDate && (
          <div className="flex items-center gap-6 p-3 px-5 rounded-xl bg-slate-50 border border-slate-100">
            <div>
              <span className="text-[10px] font-bold uppercase text-[#94A3B8] block">
                Start Date
              </span>
              <span className="text-xs font-semibold text-[#0F172A]">
                {new Date(subscription.startDate).toLocaleDateString()}
              </span>
            </div>
            <div className="text-slate-300">→</div>
            <div>
              <span className="text-[10px] font-bold uppercase text-[#94A3B8] block">
                Renewal / Expiry Date
              </span>
              <span className="text-xs font-semibold text-[#0F172A]">
                {new Date(subscription.expiryDate).toLocaleDateString()}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Grid: Details & Snapshot Lines */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Metadata Card */}
          <div className="p-6 rounded-2xl bg-white border border-[#F1F5F9] shadow-sm grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <span className="text-[11px] font-semibold text-[#94A3B8] uppercase block">
                Customer Account
              </span>
              <div className="text-sm font-bold text-[#0F172A] mt-1 flex items-center gap-1.5">
                <User className="w-4 h-4 text-blue-600" />
                {subscription.customerName}
              </div>
              <div className="text-xs text-[#64748B] mt-0.5">{subscription.customerEmail}</div>
            </div>

            <div>
              <span className="text-[11px] font-semibold text-[#94A3B8] uppercase block">
                Plan Structure
              </span>
              <div className="text-sm font-bold text-[#0F172A] mt-1 flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-emerald-600" />
                {subscription.planName}
              </div>
              <div className="text-xs text-[#64748B] mt-0.5 capitalize">
                Recurrence: Every {subscription.billingInterval}
              </div>
            </div>

            <div>
              <span className="text-[11px] font-semibold text-[#94A3B8] uppercase block">
                Payment Terms
              </span>
              <div className="text-sm font-semibold text-[#0F172A] mt-1 capitalize">
                {subscription.paymentTerms.replace('_', ' ')}
              </div>
            </div>

            <div>
              <span className="text-[11px] font-semibold text-[#94A3B8] uppercase block">
                Quotation Source
              </span>
              <div className="text-sm font-mono font-semibold text-blue-600 mt-1">
                <Link href={`/quotations/${subscription.id}`} className="hover:underline">
                  {subscription.quotationNumber}
                </Link>
              </div>
            </div>
          </div>

          {/* Subscribed Product Lines */}
          <div className="rounded-2xl border border-[#F1F5F9] bg-white shadow-sm overflow-hidden">
            <div className="p-4 px-6 border-b border-[#F1F5F9] flex items-center justify-between">
              <h2 className="text-xs font-bold uppercase tracking-wider text-[#94A3B8]">
                Contract Line Items
              </h2>
              <span className="text-xs font-semibold text-[#475569]">
                {subscription.lines?.length || 0} Lines
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-50/50 text-[10px] font-bold uppercase text-[#94A3B8] border-b border-[#F1F5F9]">
                    <th className="py-3 px-6">Product Item</th>
                    <th className="py-3 px-6">Quantity</th>
                    <th className="py-3 px-6 text-right">Unit Price</th>
                    <th className="py-3 px-6 text-right">Line Total (Inc. 18% GST)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F8FAFC]">
                  {subscription.lines?.map((line: SubscriptionLine) => (
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
                      <td className="py-4 px-6 text-right text-[#0F172A] font-medium">
                        {formatINR(line.unitPrice)}
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
              <h2 className="text-sm font-bold text-[#0F172A]">Subscription Lifecycle Audit History</h2>
            </div>

            <div className="space-y-4">
              {subscription.statusHistory && subscription.statusHistory.length > 0 ? (
                subscription.statusHistory.map((item: SubscriptionStatusHistoryItem) => (
                  <div key={item.id} className="flex items-start gap-3 relative">
                    <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center shrink-0 mt-0.5 text-[#0F172A]">
                      <ShieldCheck className="w-3.5 h-3.5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[#0F172A] capitalize">
                          Transition: {item.previousStatus ? `${item.previousStatus} → ` : ''}{item.newStatus}
                        </span>
                        <span className="text-[10px] text-[#94A3B8]">
                          {new Date(item.createdAt).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-xs text-[#64748B] mt-0.5">{item.reason}</p>
                      {item.changedByName && (
                        <div className="text-[10px] text-[#94A3B8] mt-0.5">
                          Actor: {item.changedByName}
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

        {/* Right Col: Commercial Billing */}
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-white border border-[#F1F5F9] shadow-sm space-y-4 sticky top-24">
            <h2 className="text-sm font-bold text-[#0F172A] pb-3 border-b border-[#F1F5F9]">
              Recurring Commercial Amount
            </h2>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between text-[#64748B]">
                <span>Base Recurring Price</span>
                <span className="font-semibold text-[#0F172A]">{formatINR(subscription.subtotal)}</span>
              </div>

              <div className="flex items-center justify-between text-[#64748B]">
                <span>GST (18%)</span>
                <span className="font-semibold text-[#0F172A]">{formatINR(subscription.taxTotal)}</span>
              </div>

              <div className="pt-3 border-t border-[#F1F5F9] flex items-center justify-between">
                <div>
                  <span className="font-bold text-sm text-[#0F172A] block">Total / Cycle</span>
                  <span className="text-[10px] text-[#94A3B8] capitalize">
                    Per {subscription.billingInterval}
                  </span>
                </div>
                <div className="text-xl font-black text-[#0F172A]">
                  {formatINR(subscription.totalAmount)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Close Subscription Modal */}
      {isClosingModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4 border border-slate-100">
            <div className="w-10 h-10 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center">
              <Ban className="w-5 h-5" />
            </div>

            <div>
              <h3 className="text-base font-bold text-[#0F172A]">Close Subscription?</h3>
              <p className="text-xs text-[#64748B] mt-1">
                Terminating this subscription stops future billing cycles and sets its status to Closed.
              </p>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-[#475569] uppercase mb-1">
                Reason for Termination
              </label>
              <textarea
                rows={3}
                value={closeReason}
                onChange={(e) => setCloseReason(e.target.value)}
                placeholder="e.g. Customer requested cancellation, project ended..."
                className="w-full p-3 rounded-xl border border-[#E2E8F0] bg-white text-xs text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsClosingModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-[#64748B] hover:text-[#0F172A]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => closeMutation.mutate()}
                disabled={closeMutation.isPending}
                className="px-5 py-2 rounded-xl bg-red-600 text-white text-xs font-bold hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {closeMutation.isPending ? 'Closing...' : 'Confirm Closure'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
