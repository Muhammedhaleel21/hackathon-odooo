'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createPlanApi,
  getProductsApi,
  formatINR,
} from '../../../../../lib/queries/catalog';
import {
  BillingInterval,
  PlanStatus,
  Product,
  SubscriptionPlan,
} from '../../../../../types/catalog';
import {
  ArrowLeft,
  Layers,
  Plus,
  Loader2,
  Calendar,
  HelpCircle,
  DollarSign,
  AlertCircle,
} from 'lucide-react';

function NewPlanForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialProductId = searchParams.get('productId') || '';
  const queryClient = useQueryClient();

  const [productId, setProductId] = useState(initialProductId);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [priceRupees, setPriceRupees] = useState<number>(2500);
  const [billingInterval, setBillingInterval] =
    useState<BillingInterval>('monthly');
  const [billingIntervalCount, setBillingIntervalCount] = useState<number>(1);
  const [minQuantity, setMinQuantity] = useState<number>(1);

  // Availability dates
  const todayStr = new Date().toISOString().split('T')[0];
  const nextYear = new Date();
  nextYear.setFullYear(nextYear.getFullYear() + 1);
  const nextYearStr = nextYear.toISOString().split('T')[0];

  const [availableFrom, setAvailableFrom] = useState(todayStr);
  const [availableUntil, setAvailableUntil] = useState(nextYearStr);
  const [hasExpiry, setHasExpiry] = useState(true);

  // Subscription Behavior Rules
  const [pauseAllowed, setPauseAllowed] = useState(true);
  const [earlyClosureAllowed, setEarlyClosureAllowed] = useState(true);
  const [renewalAllowed, setRenewalAllowed] = useState(true);
  const [autoClose, setAutoClose] = useState(false);

  const [status, setStatus] = useState<PlanStatus>('published');
  const [formError, setFormError] = useState<string | null>(null);

  // Fetch active products
  const { data: products } = useQuery<Product[]>({
    queryKey: ['products'],
    queryFn: () => getProductsApi({ status: 'active' }),
  });

  // Create Plan mutation
  const createPlanMutation = useMutation({
    mutationFn: createPlanApi,
    onSuccess: (created: SubscriptionPlan) => {
      queryClient.invalidateQueries({ queryKey: ['plans'] });
      router.push(`/admin/plans/${created.id}`);
    },
    onError: (err: Error) => {
      setFormError(err.message || 'Failed to create subscription plan');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!productId) {
      setFormError('Please select a product for this subscription plan');
      return;
    }

    if (!name.trim()) {
      setFormError('Plan name is required');
      return;
    }

    if (priceRupees < 0) {
      setFormError('Price cannot be negative');
      return;
    }

    if (hasExpiry && availableUntil && availableUntil < availableFrom) {
      setFormError('Available until date cannot be before available from date');
      return;
    }

    createPlanMutation.mutate({
      productId,
      name: name.trim(),
      description: description.trim() || undefined,
      price: Math.round(priceRupees * 100),
      billingInterval,
      billingIntervalCount,
      minQuantity,
      availableFrom: new Date(availableFrom).toISOString(),
      availableUntil:
        hasExpiry && availableUntil
          ? new Date(availableUntil).toISOString()
          : undefined,
      autoClose,
      earlyClosureAllowed,
      pauseAllowed,
      renewalAllowed,
      status,
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Breadcrumb & Title */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/plans"
            className="inline-flex items-center gap-1.5 rounded-xl border border-[#E2E8F0] bg-white px-3 py-1.5 text-xs font-semibold text-[#334155] hover:bg-slate-50 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Plans
          </Link>
          <h1 className="text-xl font-bold text-[#0F172A]">
            Create Subscription Plan
          </h1>
        </div>
      </div>

      {formError && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-sm text-red-600 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{formError}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1: Plan Information */}
        <div className="rounded-2xl border border-[#F1F5F9] bg-white p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-[#F1F5F9]">
            <Layers className="w-4 h-4 text-[#64748B]" />
            <h2 className="text-base font-bold text-[#0F172A]">Plan Information</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#475569] uppercase tracking-wider mb-1.5">
                Related Product <span className="text-red-500">*</span>
              </label>
              <select
                required
                value={productId}
                onChange={(e) => setProductId(e.target.value)}
                className="h-11 w-full rounded-xl border border-[#E2E8F0] bg-white px-3 text-sm text-[#0F172A] focus:outline-none focus:border-[#94A3B8]"
              >
                <option value="">Select a product...</option>
                {products?.map((p: Product) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({formatINR(p.salesPrice)} base)
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#475569] uppercase tracking-wider mb-1.5">
                Plan Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Starter, Professional, Enterprise"
                className="h-11 w-full rounded-xl border border-[#E2E8F0] bg-white px-4 text-sm text-[#0F172A] placeholder-[#94A3B8] focus:border-[#94A3B8] focus:outline-none"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-[#475569] uppercase tracking-wider mb-1.5">
                Plan Description
              </label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Explain what features or service limits are included in this subscription tier..."
                className="w-full rounded-xl border border-[#E2E8F0] bg-white p-3 text-sm text-[#0F172A] placeholder-[#94A3B8] focus:border-[#94A3B8] focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Pricing & Billing Interval */}
        <div className="rounded-2xl border border-[#F1F5F9] bg-white p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-[#F1F5F9]">
            <DollarSign className="w-4 h-4 text-[#64748B]" />
            <h2 className="text-base font-bold text-[#0F172A]">
              Pricing & Billing Cycle
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#475569] uppercase tracking-wider mb-1.5">
                Billing Price (₹ INR) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-semibold text-[#94A3B8]">
                  ₹
                </span>
                <input
                  type="number"
                  min="0"
                  required
                  value={priceRupees}
                  onChange={(e) => setPriceRupees(Number(e.target.value))}
                  placeholder="2500"
                  className="h-11 w-full rounded-xl border border-[#E2E8F0] bg-white pl-8 pr-4 text-sm font-semibold text-[#0F172A] focus:border-[#94A3B8] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#475569] uppercase tracking-wider mb-1.5">
                Billing Interval <span className="text-red-500">*</span>
              </label>
              <select
                value={billingInterval}
                onChange={(e) =>
                  setBillingInterval(e.target.value as BillingInterval)
                }
                className="h-11 w-full rounded-xl border border-[#E2E8F0] bg-white px-3 text-sm text-[#0F172A] focus:outline-none focus:border-[#94A3B8]"
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#475569] uppercase tracking-wider mb-1.5">
                Minimum Quantity <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min="1"
                required
                value={minQuantity}
                onChange={(e) => setMinQuantity(Number(e.target.value))}
                className="h-11 w-full rounded-xl border border-[#E2E8F0] bg-white px-4 text-sm text-[#0F172A] focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Availability Window */}
        <div className="rounded-2xl border border-[#F1F5F9] bg-white p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-[#F1F5F9]">
            <Calendar className="w-4 h-4 text-[#64748B]" />
            <h2 className="text-base font-bold text-[#0F172A]">Availability Period</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#475569] uppercase tracking-wider mb-1.5">
                Available From <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                required
                value={availableFrom}
                onChange={(e) => setAvailableFrom(e.target.value)}
                className="h-11 w-full rounded-xl border border-[#E2E8F0] bg-white px-3 text-sm text-[#0F172A] focus:outline-none"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-[#475569] uppercase tracking-wider">
                  Available Until
                </label>
                <button
                  type="button"
                  onClick={() => setHasExpiry(!hasExpiry)}
                  className="text-xs text-blue-600 hover:underline"
                >
                  {hasExpiry ? 'Set as Ongoing (No expiry)' : 'Set Expiry Date'}
                </button>
              </div>

              {hasExpiry ? (
                <input
                  type="date"
                  value={availableUntil}
                  onChange={(e) => setAvailableUntil(e.target.value)}
                  className="h-11 w-full rounded-xl border border-[#E2E8F0] bg-white px-3 text-sm text-[#0F172A] focus:outline-none"
                />
              ) : (
                <div className="h-11 rounded-xl bg-slate-50 border border-slate-200 px-4 flex items-center text-xs text-[#64748B]">
                  Ongoing availability (no end date limit)
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Section 4: Subscription Behavior Rules */}
        <div className="rounded-2xl border border-[#F1F5F9] bg-white p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-[#F1F5F9]">
            <HelpCircle className="w-4 h-4 text-[#64748B]" />
            <h2 className="text-base font-bold text-[#0F172A]">
              Subscription Rules & Behaviors
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Allow Pausing */}
            <div
              onClick={() => setPauseAllowed(!pauseAllowed)}
              className="p-4 rounded-xl border border-[#E2E8F0] hover:border-slate-300 transition-colors cursor-pointer flex items-start justify-between gap-4"
            >
              <div>
                <div className="text-sm font-semibold text-[#0F172A]">
                  Allow Pausing
                </div>
                <div className="text-xs text-[#64748B] mt-0.5">
                  Customers or authorized staff may temporarily pause the active subscription.
                </div>
              </div>
              <div
                className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors shrink-0 ${pauseAllowed ? 'bg-[#C8E63C]' : 'bg-slate-200'
                  }`}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${pauseAllowed ? 'translate-x-5' : 'translate-x-0'
                    }`}
                />
              </div>
            </div>

            {/* Allow Early Closure */}
            <div
              onClick={() => setEarlyClosureAllowed(!earlyClosureAllowed)}
              className="p-4 rounded-xl border border-[#E2E8F0] hover:border-slate-300 transition-colors cursor-pointer flex items-start justify-between gap-4"
            >
              <div>
                <div className="text-sm font-semibold text-[#0F172A]">
                  Allow Early Closure
                </div>
                <div className="text-xs text-[#64748B] mt-0.5">
                  Authorized users may close or terminate the subscription before scheduled expiry.
                </div>
              </div>
              <div
                className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors shrink-0 ${earlyClosureAllowed ? 'bg-[#C8E63C]' : 'bg-slate-200'
                  }`}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${earlyClosureAllowed ? 'translate-x-5' : 'translate-x-0'
                    }`}
                />
              </div>
            </div>

            {/* Allow Renewal */}
            <div
              onClick={() => setRenewalAllowed(!renewalAllowed)}
              className="p-4 rounded-xl border border-[#E2E8F0] hover:border-slate-300 transition-colors cursor-pointer flex items-start justify-between gap-4"
            >
              <div>
                <div className="text-sm font-semibold text-[#0F172A]">
                  Allow Renewal
                </div>
                <div className="text-xs text-[#64748B] mt-0.5">
                  The subscription can be manually or automatically renewed for subsequent periods.
                </div>
              </div>
              <div
                className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors shrink-0 ${renewalAllowed ? 'bg-[#C8E63C]' : 'bg-slate-200'
                  }`}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${renewalAllowed ? 'translate-x-5' : 'translate-x-0'
                    }`}
                />
              </div>
            </div>

            {/* Automatic Closure */}
            <div
              onClick={() => setAutoClose(!autoClose)}
              className="p-4 rounded-xl border border-[#E2E8F0] hover:border-slate-300 transition-colors cursor-pointer flex items-start justify-between gap-4"
            >
              <div>
                <div className="text-sm font-semibold text-[#0F172A]">
                  Automatic Closure
                </div>
                <div className="text-xs text-[#64748B] mt-0.5">
                  The subscription automatically closes at the end of its duration without renewal.
                </div>
              </div>
              <div
                className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors shrink-0 ${autoClose ? 'bg-[#C8E63C]' : 'bg-slate-200'
                  }`}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${autoClose ? 'translate-x-5' : 'translate-x-0'
                    }`}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section 5: Publication Status */}
        <div className="rounded-2xl border border-[#F1F5F9] bg-white p-6 shadow-sm space-y-3">
          <div className="text-xs font-semibold text-[#475569] uppercase tracking-wider">
            Plan Publication Status
          </div>
          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 text-sm text-[#0F172A] cursor-pointer">
              <input
                type="radio"
                name="status"
                value="published"
                checked={status === 'published'}
                onChange={() => setStatus('published')}
                className="text-[#C8E63C]"
              />
              Published (Customers can select this plan immediately)
            </label>
            <label className="flex items-center gap-2 text-sm text-[#64748B] cursor-pointer">
              <input
                type="radio"
                name="status"
                value="draft"
                checked={status === 'draft'}
                onChange={() => setStatus('draft')}
                className="text-[#C8E63C]"
              />
              Draft (Hidden from quotations and portal)
            </label>
          </div>
        </div>

        {/* Actions Footer */}
        <div className="flex items-center justify-end gap-3 pt-4">
          <Link
            href="/admin/plans"
            className="px-5 py-2.5 rounded-xl border border-[#E2E8F0] text-sm font-semibold text-[#334155] hover:bg-slate-50 transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={createPlanMutation.isPending}
            className="inline-flex items-center gap-2 rounded-xl bg-[#C8E63C] px-6 py-2.5 text-sm font-semibold text-[#0F172A] hover:bg-[#B8DC30] transition-all shadow-sm cursor-pointer disabled:opacity-50"
          >
            {createPlanMutation.isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Saving Plan...
              </>
            ) : (
              'Save & Publish Plan'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default function NewPlanPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-20 text-[#64748B]">
          <Loader2 className="w-8 h-8 animate-spin text-[#C8E63C]" />
        </div>
      }
    >
      <NewPlanForm />
    </Suspense>
  );
}