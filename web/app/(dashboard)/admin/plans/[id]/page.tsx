'use client';

import React, { useState, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getPlanByIdApi,
  updatePlanApi,
  publishPlanApi,
  deactivatePlanApi,
  getProductsApi,
  formatINR,
} from '../../../../../lib/queries/catalog';
import { useAuth } from '../../../../../hooks/use-auth';
import {
  BillingInterval,
  PlanStatus,
  Product,
  SubscriptionPlan,
} from '../../../../../types/catalog';
import {
  ArrowLeft,
  Layers,
  Edit2,
  CheckCircle2,
  XCircle,
  Calendar,
  Loader2,
  AlertCircle,
  HelpCircle,
  Clock,
} from 'lucide-react';

export default function PlanDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const planId = resolvedParams.id;
  const router = useRouter();
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const queryClient = useQueryClient();

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState('');
  const [productId, setProductId] = useState('');
  const [description, setDescription] = useState('');
  const [priceRupees, setPriceRupees] = useState<number>(0);
  const [billingInterval, setBillingInterval] =
    useState<BillingInterval>('monthly');
  const [billingIntervalCount, setBillingIntervalCount] = useState<number>(1);
  const [minQuantity, setMinQuantity] = useState<number>(1);

  const [availableFrom, setAvailableFrom] = useState('');
  const [availableUntil, setAvailableUntil] = useState('');
  const [hasExpiry, setHasExpiry] = useState(true);

  const [pauseAllowed, setPauseAllowed] = useState(true);
  const [earlyClosureAllowed, setEarlyClosureAllowed] = useState(true);
  const [renewalAllowed, setRenewalAllowed] = useState(true);
  const [autoClose, setAutoClose] = useState(false);

  const [status, setStatus] = useState<PlanStatus>('draft');
  const [formMessage, setFormMessage] = useState<string | null>(null);

  // Fetch plan
  const {
    data: plan,
    isLoading,
    error,
  } = useQuery<SubscriptionPlan>({
    queryKey: ['plan', planId],
    queryFn: () => getPlanByIdApi(planId),
  });

  // Fetch products
  const { data: products } = useQuery<Product[]>({
    queryKey: ['products'],
    queryFn: () => getProductsApi({ status: 'active' }),
  });

  // Sync state when plan loads
  React.useEffect(() => {
    if (plan) {
      setName(plan.name);
      setProductId(plan.productId);
      setDescription(plan.description || '');
      setPriceRupees(plan.price / 100);
      setBillingInterval(plan.billingInterval);
      setBillingIntervalCount(plan.billingIntervalCount);
      setMinQuantity(plan.minQuantity);
      setAvailableFrom(
        plan.availableFrom ? plan.availableFrom.split('T')[0] : '',
      );
      if (plan.availableUntil) {
        setAvailableUntil(plan.availableUntil.split('T')[0]);
        setHasExpiry(true);
      } else {
        setAvailableUntil('');
        setHasExpiry(false);
      }
      setPauseAllowed(plan.pauseAllowed);
      setEarlyClosureAllowed(plan.earlyClosureAllowed);
      setRenewalAllowed(plan.renewalAllowed);
      setAutoClose(plan.autoClose);
      setStatus(plan.status);
    }
  }, [plan]);

  // Update Plan mutation
  const updatePlanMutation = useMutation({
    mutationFn: (payload: any) => updatePlanApi(planId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['plan', planId] });
      queryClient.invalidateQueries({ queryKey: ['plans'] });
      setIsEditing(false);
      setFormMessage('Plan updated successfully!');
      setTimeout(() => setFormMessage(null), 3000);
    },
  });

  // Publish mutation
  const publishMutation = useMutation({
    mutationFn: () => publishPlanApi(planId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['plan', planId] });
      queryClient.invalidateQueries({ queryKey: ['plans'] });
    },
  });

  // Deactivate mutation
  const deactivateMutation = useMutation({
    mutationFn: () => deactivatePlanApi(planId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['plan', planId] });
      queryClient.invalidateQueries({ queryKey: ['plans'] });
    },
  });

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-[#64748B]">
        <Loader2 className="w-8 h-8 animate-spin text-[#C8E63C] mb-2 stroke-[2.5]" />
        <p className="text-sm font-medium">Loading plan details...</p>
      </div>
    );
  }

  if (error || !plan) {
    return (
      <div className="p-8 text-center text-red-500 max-w-md mx-auto">
        <AlertCircle className="w-10 h-10 mx-auto mb-2 text-red-500" />
        <h3 className="font-bold text-lg">Plan Not Found</h3>
        <p className="text-xs text-red-400 mt-1">
          {error ? (error as Error).message : 'Unable to locate this subscription plan.'}
        </p>
        <Link
          href="/admin/plans"
          className="inline-block mt-4 text-xs font-semibold text-blue-600 hover:underline"
        >
          ← Return to Plans
        </Link>
      </div>
    );
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updatePlanMutation.mutate({
      name: name.trim(),
      productId,
      description: description.trim() || null,
      price: Math.round(priceRupees * 100),
      billingInterval,
      billingIntervalCount,
      minQuantity,
      availableFrom: new Date(availableFrom).toISOString(),
      availableUntil:
        hasExpiry && availableUntil
          ? new Date(availableUntil).toISOString()
          : null,
      pauseAllowed,
      earlyClosureAllowed,
      renewalAllowed,
      autoClose,
      status,
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Action & Breadcrumb Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/plans"
            className="inline-flex items-center gap-1.5 rounded-xl border border-[#E2E8F0] bg-white px-3 py-1.5 text-xs font-semibold text-[#334155] hover:bg-slate-50 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Plans
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-[#0F172A]">{plan.name}</h1>
              {plan.status === 'published' ? (
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  <CheckCircle2 className="w-3 h-3" />
                  Published
                </span>
              ) : plan.status === 'draft' ? (
                <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                  <Clock className="w-3 h-3" />
                  Draft
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[#94A3B8] bg-slate-100 px-2.5 py-0.5 rounded-full">
                  <XCircle className="w-3 h-3" />
                  Deactivated
                </span>
              )}
            </div>
            <div className="text-xs text-[#94A3B8] mt-0.5">
              Associated Product: <span className="font-medium text-[#475569]">{plan.productName}</span>
            </div>
          </div>
        </div>

        {isAdmin && (
          <div className="flex items-center gap-2">
            {plan.status !== 'published' ? (
              <button
                onClick={() => publishMutation.mutate()}
                disabled={publishMutation.isPending}
                className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-50 border border-emerald-200 px-3.5 py-2 text-xs font-semibold text-emerald-700 hover:bg-emerald-100 transition-colors cursor-pointer"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                Publish Plan
              </button>
            ) : (
              <button
                onClick={() => deactivateMutation.mutate()}
                disabled={deactivateMutation.isPending}
                className="inline-flex items-center gap-1.5 rounded-xl border border-[#E2E8F0] bg-white px-3.5 py-2 text-xs font-semibold text-[#94A3B8] hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
              >
                <XCircle className="w-3.5 h-3.5" />
                Deactivate Plan
              </button>
            )}

            <button
              onClick={() => setIsEditing(!isEditing)}
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#C8E63C] px-4 py-2 text-xs font-semibold text-[#0F172A] hover:bg-[#B8DC30] transition-colors cursor-pointer"
            >
              <Edit2 className="w-3.5 h-3.5" />
              {isEditing ? 'Cancel' : 'Edit Plan'}
            </button>
          </div>
        )}
      </div>

      {formMessage && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-700 font-medium flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          {formMessage}
        </div>
      )}

      {isEditing ? (
        <form onSubmit={handleSave} className="space-y-6">
          <div className="rounded-2xl border border-[#F1F5F9] bg-white p-6 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-[#0F172A]">Edit Plan Configuration</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#475569] uppercase mb-1">
                  Plan Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="h-11 w-full rounded-xl border border-[#E2E8F0] px-4 text-sm focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#475569] uppercase mb-1">
                  Product
                </label>
                <select
                  value={productId}
                  onChange={(e) => setProductId(e.target.value)}
                  className="h-11 w-full rounded-xl border border-[#E2E8F0] px-3 text-sm focus:outline-none"
                >
                  {products?.map((p: Product) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-[#475569] uppercase mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full rounded-xl border border-[#E2E8F0] p-3 text-sm focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#475569] uppercase mb-1">
                  Billing Price (₹ INR)
                </label>
                <input
                  type="number"
                  min="0"
                  required
                  value={priceRupees}
                  onChange={(e) => setPriceRupees(Number(e.target.value))}
                  className="h-11 w-full rounded-xl border border-[#E2E8F0] px-4 text-sm font-semibold focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#475569] uppercase mb-1">
                  Billing Interval
                </label>
                <select
                  value={billingInterval}
                  onChange={(e) => setBillingInterval(e.target.value as BillingInterval)}
                  className="h-11 w-full rounded-xl border border-[#E2E8F0] px-3 text-sm focus:outline-none"
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="yearly">Yearly</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#475569] uppercase mb-1">
                  Available From
                </label>
                <input
                  type="date"
                  value={availableFrom}
                  onChange={(e) => setAvailableFrom(e.target.value)}
                  className="h-11 w-full rounded-xl border border-[#E2E8F0] px-3 text-sm focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#475569] uppercase mb-1">
                  Available Until
                </label>
                <input
                  type="date"
                  value={availableUntil}
                  onChange={(e) => setAvailableUntil(e.target.value)}
                  className="h-11 w-full rounded-xl border border-[#E2E8F0] px-3 text-sm focus:outline-none"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-[#F1F5F9] flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-[#64748B]"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={updatePlanMutation.isPending}
                className="px-5 py-2 rounded-xl bg-[#C8E63C] text-[#0F172A] font-semibold text-xs hover:bg-[#B8DC30] disabled:opacity-50"
              >
                {updatePlanMutation.isPending ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </form>
      ) : (
        <div className="space-y-6">
          {/* Main Plan Card */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 rounded-2xl border border-[#F1F5F9] bg-white p-6 shadow-sm space-y-6">
              <div>
                <div className="text-xs font-semibold text-[#94A3B8] uppercase tracking-wider">
                  Plan Details
                </div>
                <h3 className="text-lg font-bold text-[#0F172A] mt-1">{plan.name}</h3>
                <p className="text-sm text-[#475569] mt-2 leading-relaxed">
                  {plan.description || 'No plan description provided.'}
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 border-t border-[#F1F5F9]">
                <div>
                  <div className="text-xs text-[#94A3B8] font-medium">Product</div>
                  <div className="text-sm font-semibold text-[#0F172A] mt-0.5">
                    {plan.productName}
                  </div>
                </div>

                <div>
                  <div className="text-xs text-[#94A3B8] font-medium">Billing Cadence</div>
                  <div className="text-sm font-semibold text-[#0F172A] capitalize mt-0.5">
                    Every {plan.billingIntervalCount > 1 ? `${plan.billingIntervalCount} ` : ''}
                    {plan.billingInterval}
                  </div>
                </div>

                <div>
                  <div className="text-xs text-[#94A3B8] font-medium">Min Quantity</div>
                  <div className="text-sm font-semibold text-[#0F172A] mt-0.5">
                    {plan.minQuantity} unit(s)
                  </div>
                </div>
              </div>
            </div>

            {/* Price Box */}
            <div className="rounded-2xl border border-[#F1F5F9] bg-white p-6 shadow-sm flex flex-col justify-between">
              <div>
                <div className="text-xs font-semibold text-[#94A3B8] uppercase tracking-wider">
                  Recurring Billing Rate
                </div>
                <div className="mt-3">
                  <span className="text-3xl font-black text-[#0F172A]">
                    {formatINR(plan.price)}
                  </span>
                  <span className="text-xs text-[#64748B] block mt-1 capitalize">
                    per {plan.billingInterval}
                  </span>
                </div>
              </div>

              <div className="pt-4 border-t border-[#F1F5F9] space-y-2 text-xs">
                <div className="flex justify-between text-[#64748B]">
                  <span>Available From:</span>
                  <span className="font-semibold text-[#0F172A]">
                    {new Date(plan.availableFrom).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between text-[#64748B]">
                  <span>Available Until:</span>
                  <span className="font-semibold text-[#0F172A]">
                    {plan.availableUntil
                      ? new Date(plan.availableUntil).toLocaleDateString()
                      : 'Ongoing'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Subscription Lifecycle Behavior Rules */}
          <div className="rounded-2xl border border-[#F1F5F9] bg-white p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-[#F1F5F9]">
              <HelpCircle className="w-4 h-4 text-[#64748B]" />
              <h3 className="text-base font-bold text-[#0F172A]">
                Configured Lifecycle Rules
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <div className="text-xs text-[#64748B]">Pausing Allowed</div>
                <div className="text-sm font-bold text-[#0F172A]">
                  {plan.pauseAllowed ? 'Enabled' : 'Disabled'}
                </div>
                <p className="text-[11px] text-[#94A3B8]">
                  Subscribers may pause billing temporarily.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <div className="text-xs text-[#64748B]">Early Closure</div>
                <div className="text-sm font-bold text-[#0F172A]">
                  {plan.earlyClosureAllowed ? 'Enabled' : 'Disabled'}
                </div>
                <p className="text-[11px] text-[#94A3B8]">
                  Can be terminated before term completion.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <div className="text-xs text-[#64748B]">Renewal Allowed</div>
                <div className="text-sm font-bold text-[#0F172A]">
                  {plan.renewalAllowed ? 'Enabled' : 'Disabled'}
                </div>
                <p className="text-[11px] text-[#94A3B8]">
                  Eligible for auto and manual renewal.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <div className="text-xs text-[#64748B]">Auto-Closure</div>
                <div className="text-sm font-bold text-[#0F172A]">
                  {plan.autoClose ? 'Enabled' : 'Disabled'}
                </div>
                <p className="text-[11px] text-[#94A3B8]">
                  Closes immediately at duration end.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
