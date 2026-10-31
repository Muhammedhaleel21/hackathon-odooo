'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getPlansApi,
  publishPlanApi,
  deactivatePlanApi,
  formatINR,
} from '../../../../lib/queries/catalog';
import { SubscriptionPlan } from '../../../../types/catalog';
import { useAuth } from '../../../../hooks/use-auth';
import {
  Layers,
  Plus,
  Search,
  CheckCircle2,
  XCircle,
  Calendar,
  Loader2,
  AlertCircle,
  Edit3,
  Clock,
} from 'lucide-react';

export default function PlansPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const queryClient = useQueryClient();

  const [search, setSearch] = useState('');
  const [intervalFilter, setIntervalFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Fetch plans
  const {
    data: plans,
    isLoading,
    error,
  } = useQuery<SubscriptionPlan[]>({
    queryKey: ['plans', search, intervalFilter, statusFilter],
    queryFn: () =>
      getPlansApi({
        search: search || undefined,
        interval: intervalFilter !== 'all' ? intervalFilter : undefined,
        status: statusFilter !== 'all' ? statusFilter : undefined,
      }),
  });

  // Publish mutation
  const publishMutation = useMutation({
    mutationFn: (id: string) => publishPlanApi(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['plans'] });
    },
  });

  // Deactivate mutation
  const deactivateMutation = useMutation({
    mutationFn: (id: string) => deactivatePlanApi(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['plans'] });
    },
  });

  return (
    <div className="space-y-6">
      {/* Top Action & Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#0F172A] tracking-tight">
            Subscription Plans
          </h1>
          <p className="text-sm text-[#64748B] mt-1">
            Configure how customers subscribe to products, billing frequencies, and lifecycle rules.
          </p>
        </div>

        {isAdmin && (
          <Link
            href="/admin/plans/new"
            className="inline-flex items-center gap-2 rounded-xl bg-[#C8E63C] px-5 py-2.5 text-sm font-semibold text-[#0F172A] hover:bg-[#B8DC30] transition-all shadow-sm active:scale-[0.98] shrink-0"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            Add Plan
          </Link>
        )}
      </div>

      {/* Main Table Card */}
      <div className="rounded-2xl border border-[#F1F5F9] bg-white shadow-sm overflow-hidden">
        {/* Filter Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#F1F5F9] p-4 lg:p-5">
          {/* Search Input */}
          <div className="relative w-full sm:w-80">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94A3B8]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search plans or products..."
              className="h-10 w-full rounded-xl border border-[#E2E8F0] bg-white pl-10 pr-4 text-sm text-[#0F172A] placeholder-[#94A3B8] transition-colors focus:border-[#94A3B8] focus:outline-none"
            />
          </div>

          {/* Segmented Controls & Dropdowns */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Interval Filter */}
            <select
              value={intervalFilter}
              onChange={(e) => setIntervalFilter(e.target.value)}
              className="h-9 rounded-xl border border-[#E2E8F0] bg-white px-3 text-xs font-medium text-[#334155] focus:outline-none focus:border-[#94A3B8]"
            >
              <option value="all">All Intervals</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>

            {/* Status Segmented Control */}
            <div className="inline-flex items-center gap-1 rounded-xl bg-[#F1F5F9] p-1">
              {(['all', 'published', 'draft', 'deactivated'] as const).map(
                (s) => (
                  <button
                    key={s}
                    onClick={() => setStatusFilter(s)}
                    className={`rounded-lg px-3 py-1 text-xs font-semibold capitalize transition-all cursor-pointer ${statusFilter === s
                        ? 'bg-white text-[#0F172A] shadow-sm'
                        : 'text-[#64748B] hover:text-[#0F172A]'
                      }`}
                  >
                    {s}
                  </button>
                ),
              )}
            </div>
          </div>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-16 text-[#64748B]">
            <Loader2 className="w-8 h-8 animate-spin text-[#C8E63C] mb-2 stroke-[2.5]" />
            <p className="text-sm font-medium">Loading subscription plans...</p>
          </div>
        ) : error ? (
          <div className="p-8 text-center text-red-500">
            <AlertCircle className="w-8 h-8 mx-auto mb-2 text-red-500" />
            <p className="text-sm font-semibold">Failed to load plans</p>
            <p className="text-xs text-red-400 mt-1">{(error as Error).message}</p>
          </div>
        ) : plans && plans.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#F1F5F9] text-[11px] font-semibold uppercase tracking-wider text-[#94A3B8]">
                  <th className="px-6 py-3.5">Plan Name</th>
                  <th className="px-6 py-3.5">Product</th>
                  <th className="px-6 py-3.5">Price / Interval</th>
                  <th className="px-6 py-3.5">Min Qty</th>
                  <th className="px-6 py-3.5">Availability</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F8FAFC]">
                {plans.map((plan: SubscriptionPlan) => (
                  <tr
                    key={plan.id}
                    className="transition-colors hover:bg-[#F8FAFC]/80 group"
                  >
                    <td className="px-6 py-4">
                      <Link
                        href={`/admin/plans/${plan.id}`}
                        className="font-semibold text-sm text-[#0F172A] hover:underline flex flex-col"
                      >
                        <span>{plan.name}</span>
                        {plan.description && (
                          <span className="text-xs text-[#94A3B8] font-normal truncate max-w-xs">
                            {plan.description}
                          </span>
                        )}
                      </Link>
                    </td>

                    <td className="px-6 py-4 text-sm font-medium text-[#334155]">
                      {plan.productName || 'Unassigned'}
                    </td>

                    <td className="px-6 py-4">
                      <div className="text-sm font-bold text-[#0F172A]">
                        {formatINR(plan.price)}
                      </div>
                      <div className="text-xs text-[#64748B] capitalize">
                        Every{' '}
                        {plan.billingIntervalCount > 1
                          ? `${plan.billingIntervalCount} `
                          : ''}
                        {plan.billingInterval}
                      </div>
                    </td>

                    <td className="px-6 py-4 text-sm text-[#475569]">
                      {plan.minQuantity}
                    </td>

                    <td className="px-6 py-4 text-xs text-[#64748B]">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-[#94A3B8]" />
                        <span>
                          {new Date(plan.availableFrom).toLocaleDateString()}
                          {plan.availableUntil
                            ? ` → ${new Date(plan.availableUntil).toLocaleDateString()}`
                            : ' (Ongoing)'}
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      {plan.status === 'published' ? (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3" />
                          Published
                        </span>
                      ) : plan.status === 'draft' ? (
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                          <Clock className="w-3 h-3" />
                          Draft
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-[#94A3B8] bg-slate-100 px-2.5 py-1 rounded-full">
                          <XCircle className="w-3 h-3" />
                          Deactivated
                        </span>
                      )}
                    </td>

                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/plans/${plan.id}`}
                          className="p-1.5 text-[#64748B] hover:text-[#0F172A] hover:bg-slate-100 rounded-lg transition-colors"
                          title="View & Edit"
                        >
                          <Edit3 className="w-4 h-4" />
                        </Link>

                        {isAdmin && (
                          <>
                            {plan.status !== 'published' ? (
                              <button
                                onClick={() => publishMutation.mutate(plan.id)}
                                disabled={publishMutation.isPending}
                                className="text-xs px-2.5 py-1 rounded-lg font-semibold bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-colors cursor-pointer"
                              >
                                Publish
                              </button>
                            ) : (
                              <button
                                onClick={() =>
                                  deactivateMutation.mutate(plan.id)
                                }
                                disabled={deactivateMutation.isPending}
                                className="text-xs px-2.5 py-1 rounded-lg font-medium text-[#94A3B8] hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                              >
                                Deactivate
                              </button>
                            )}
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-16 px-4">
            <Layers className="w-12 h-12 text-[#94A3B8] mx-auto mb-3" />
            <h3 className="text-base font-bold text-[#0F172A]">No plans found</h3>
            <p className="text-sm text-[#64748B] mt-1 max-w-sm mx-auto">
              {search || intervalFilter !== 'all' || statusFilter !== 'all'
                ? 'Try adjusting your search query or filters.'
                : 'Configure billing plans for your products so customers can subscribe.'}
            </p>
            {isAdmin && !search && (
              <Link
                href="/admin/plans/new"
                className="inline-flex items-center gap-2 mt-4 rounded-xl bg-[#C8E63C] px-4 py-2 text-xs font-semibold text-[#0F172A] hover:bg-[#B8DC30] transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Plan Now
              </Link>
            )}
          </div>
        )}

        {/* Footer Counter */}
        {plans && plans.length > 0 && (
          <div className="border-t border-[#F1F5F9] px-6 py-3.5 text-xs text-[#94A3B8]">
            Showing {plans.length} {plans.length === 1 ? 'plan' : 'plans'}
          </div>
        )}
      </div>
    </div>
  );
}