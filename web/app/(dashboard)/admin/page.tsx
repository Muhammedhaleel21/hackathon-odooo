'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth, getDashboardPath } from '../../../hooks/use-auth';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getAllStaffApi,
  createStaffApi,
  updateStaffStatusApi,
} from '../../../lib/queries/auth';
import {
  getProductsApi,
  getPlansApi,
  formatINR,
} from '../../../lib/queries/catalog';
import { Product, SubscriptionPlan } from '../../../types/catalog';
import { StaffUser } from '../../../types/auth';
import {
  Shield,
  UserPlus,
  Users,
  Package,
  Layers,
  ArrowRight,
  Plus,
  CheckCircle2,
  XCircle,
  Loader2,
  AlertTriangle,
  Database,
} from 'lucide-react';

export default function AdminDashboardPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const [isCreatingStaff, setIsCreatingStaff] = useState(false);
  const [newStaffName, setNewStaffName] = useState('');
  const [newStaffEmail, setNewStaffEmail] = useState('');
  const [newStaffPassword, setNewStaffPassword] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  // Fetch staff list
    const { data: staffList, isLoading: isLoadingStaff } = useQuery<StaffUser[]>({
      queryKey: ['staff'],
      queryFn: getAllStaffApi,
      enabled: user?.role === 'admin',
    });

    // Fetch products
    const { data: products } = useQuery<Product[]>({
      queryKey: ['products'],
      queryFn: () => getProductsApi(),
    });

    // Fetch plans
    const { data: plans } = useQuery<SubscriptionPlan[]>({
      queryKey: ['plans'],
      queryFn: () => getPlansApi(),
    });

    // Create staff mutation
    const createMutation = useMutation({
      mutationFn: createStaffApi,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['staff'] });
        setIsCreatingStaff(false);
        setNewStaffName('');
        setNewStaffEmail('');
        setNewStaffPassword('');
        setFormError(null);
      },
      onError: (err: Error) => {
        setFormError(err.message || 'Failed to create staff account');
      },
    });

    // Toggle status mutation
    const toggleStatusMutation = useMutation({
      mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
        updateStaffStatusApi(id, isActive),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['staff'] });
      },
    });

    // Role Guard
    if(user && user.role !== 'admin') {
      return (
            <div className="max-w-xl mx-auto my-16 p-8 rounded-3xl bg-white border border-red-200 text-center shadow-sm">
              <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-[#0F172A] mb-2">Access Denied (403)</h2>
              <p className="text-sm text-[#64748B] mb-6">
                The Admin Command Center is strictly restricted to system administrators.
              </p>
              <Link
                href={getDashboardPath(user.role)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm bg-[#C8E63C] text-[#0F172A] hover:bg-[#B8DC30] transition-all"
              >
                Go to My Dashboard
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            );
  }

  const handleCreateStaff = (e: React.FormEvent) => {
              e.preventDefault();
            setFormError(null);

            if (newStaffPassword.length < 9) {
              setFormError('Staff password must be at least 9 characters.');
            return;
    }

            createMutation.mutate({
              name: newStaffName,
            email: newStaffEmail,
            password: newStaffPassword,
    });
  };

            const activeProductsCount =
    products?.filter((p: Product) => p.status === 'active').length || 0;
            const publishedPlansCount =
    plans?.filter((p: SubscriptionPlan) => p.status === 'published').length || 0;

            return (
            <div className="space-y-8">
                    {/* Top Banner */}
                    <div className="rounded-3xl bg-white border border-[#F1F5F9] p-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
                      <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-[#C8E63C]/30 text-[#0F172A] border border-[#C8E63C] mb-3">
                          <Shield className="w-3.5 h-3.5 text-[#0F172A]" />
                          Administrator Center
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#0F172A]">
                          Catalog & Operations Overview
                        </h1>
                        <p className="text-[#64748B] text-sm mt-1 max-w-xl">
                          Configure what Brightloop sells, set prices, define variant attributes, and deploy recurring subscription plans.
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center gap-3">
                        <Link
                          href="/admin/products/new"
                          className="inline-flex items-center gap-2 rounded-xl bg-[#C8E63C] px-4 py-2.5 text-xs font-semibold text-[#0F172A] hover:bg-[#B8DC30] shadow-sm transition-all"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          New Product
                        </Link>
                        <Link
                          href="/admin/plans/new"
                          className="inline-flex items-center gap-2 rounded-xl border border-[#E2E8F0] bg-white px-4 py-2.5 text-xs font-semibold text-[#334155] hover:bg-slate-50 transition-all"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          New Plan
                        </Link>
                      </div>
                    </div>

                          {/* 4 Stat Metric Cards */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            {/* Metric 1: Products */}
                            <Link
                              href="/admin/products"
                              className="rounded-2xl border border-[#F1F5F9] bg-white p-5 shadow-sm hover:border-slate-300 transition-all group"
                            >
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-semibold text-[#94A3B8] uppercase">Products</span>
                                <div className="p-2 rounded-xl bg-[#C8E63C]/20 text-[#0F172A]">
                                  <Package className="w-4 h-4" />
                                </div>
                              </div>
                              <div className="text-2xl font-black text-[#0F172A] mt-3">
                                {products?.length || 0}
                              </div>
                              <div className="flex items-center gap-1 text-xs text-emerald-600 font-medium mt-1">
                                <span>{activeProductsCount} active</span>
                                <span className="text-[#94A3B8]">·</span>
                                <span className="text-[#94A3B8] group-hover:underline">Manage →</span>
                              </div>
                            </Link>

                                {/* Metric 2: Subscription Plans */}
                                <Link
                                  href="/admin/plans"
                                  className="rounded-2xl border border-[#F1F5F9] bg-white p-5 shadow-sm hover:border-slate-300 transition-all group"
                                >
                                  <div className="flex items-center justify-between">
                                    <span className="text-xs font-semibold text-[#94A3B8] uppercase">Billing Plans</span>
                                    <div className="p-2 rounded-xl bg-blue-50 text-blue-700">
                                      <Layers className="w-4 h-4" />
                                    </div>
                                  </div>
                                  <div className="text-2xl font-black text-[#0F172A] mt-3">
                                    {plans?.length || 0}
                                  </div>
                                  <div className="flex items-center gap-1 text-xs text-emerald-600 font-medium mt-1">
                                    <span>{publishedPlansCount} published</span>
                                    <span className="text-[#94A3B8]">·</span>
                                    <span className="text-[#94A3B8] group-hover:underline">Manage →</span>
                                  </div>
                                </Link>

                                    {/* Metric 3: Staff Members */}
                                    <div className="rounded-2xl border border-[#F1F5F9] bg-white p-5 shadow-sm">
                                      <div className="flex items-center justify-between">
                                        <span className="text-xs font-semibold text-[#94A3B8] uppercase">Staff Team</span>
                                        <div className="p-2 rounded-xl bg-purple-50 text-purple-700">
                                          <Users className="w-4 h-4" />
                                        </div>
                                        </div>
                                        <div className="text-2xl font-black text-[#0F172A] mt-3">
                                          {staffList?.length || 0}
                                        </div>
                                        <div className="text-xs text-[#94A3B8] mt-1">
                                          Operational role accounts
                                        </div>
                                      </div>

                                      {/* Metric 4: Database Infrastructure */}
                                      <div className="rounded-2xl border border-[#F1F5F9] bg-white p-5 shadow-sm">
                                        <div className="flex items-center justify-between">
                                          <span className="text-xs font-semibold text-[#94A3B8] uppercase">Database</span>
                                          <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700">
                                            <Database className="w-4 h-4" />
                                          </div>
                                          </div>
                                          <div className="text-base font-bold text-[#0F172A] mt-3">
                                            Neon Serverless
                                          </div>
                                          <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-medium mt-1">
                                            <div className="w-2 h-2 rounded-full bg-emerald-500" />
                                            PostgreSQL Live
                                          </div>
                                        </div>
                                      </div>

                                      {/* Split Section: Quick Catalog Previews */}
                                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                        {/* Products Quick Card */}
                                        <div className="rounded-2xl border border-[#F1F5F9] bg-white p-6 shadow-sm space-y-4">
                                          <div className="flex items-center justify-between pb-3 border-b border-[#F1F5F9]">
                                            <div className="flex items-center gap-2">
                                              <Package className="w-4 h-4 text-[#64748B]" />
                                              <h2 className="text-sm font-bold text-[#0F172A]">Products Catalog</h2>
                                            </div>
                                              <Link
                                                href="/admin/products"
                                                className="text-xs font-semibold text-blue-600 hover:underline"
                                              >
                                                View All ({products?.length || 0}) →
                                              </Link>
                                            </div>

                                            <div className="space-y-3">
                                              {products &&
                                                products.slice(0, 3).map((prod: Product) => (
                                                  <div
                                                    key={prod.id}
                                                    className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100 hover:border-slate-200 transition-colors"
                                                  >
                                                    <div>
                                                      <Link
                                                        href={`/admin/products/${prod.id}`}
                                                        className="font-semibold text-xs text-[#0F172A] hover:underline"
                                                      >
                                                        {prod.name}
                                                      </Link>
                                                      <div className="text-[11px] text-[#94A3B8] capitalize">
                                                        {prod.productType} · {prod.categoryName || 'General'}
                                                      </div>
                                                    </div>
                                                    <div className="text-right">
                                                      <div className="text-xs font-bold text-[#0F172A]">
                                                        {formatINR(prod.salesPrice)}
                                                      </div>
                                                      <span className="text-[10px] text-emerald-600 font-medium capitalize">
                                                        {prod.status}
                                                      </span>
                                                    </div>
                                                  </div>
                                                ))}
                                            </div>
                                          </div>

                                          {/* Subscription Plans Quick Card */}
                                          <div className="rounded-2xl border border-[#F1F5F9] bg-white p-6 shadow-sm space-y-4">
                                            <div className="flex items-center justify-between pb-3 border-b border-[#F1F5F9]">
                                              <div className="flex items-center gap-2">
                                                <Layers className="w-4 h-4 text-[#64748B]" />
                                                <h2 className="text-sm font-bold text-[#0F172A]">Active Billing Plans</h2>
                                              </div>
                                            <Link
                                              href="/admin/plans"
                                              className="text-xs font-semibold text-blue-600 hover:underline"
                                            >
                                              View All ({plans?.length || 0}) →
                                            </Link>
                                          </div>

                                          <div className="space-y-3">
                                            {plans &&
                                              plans.slice(0, 3).map((pl: SubscriptionPlan) => (
                                                <div
                                                  key={pl.id}
                                                  className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100 hover:border-slate-200 transition-colors"
                                                >
                                                  <div>
                                                    <Link
                                                      href={`/admin/plans/${pl.id}`}
                                                      className="font-semibold text-xs text-[#0F172A] hover:underline"
                                                    >
                                                      {pl.name}
                                                    </Link>
                                                    <div className="text-[11px] text-[#94A3B8]">
                                                      For: {pl.productName}
                                                    </div>
                                                  </div>
                                                  <div className="text-right">
                                                    <div className="text-xs font-bold text-[#0F172A]">
                                                      {formatINR(pl.price)} / {pl.billingInterval}
                                                    </div>
                                                    <span className="text-[10px] text-emerald-600 font-medium capitalize">
                                                      {pl.status}
                                                    </span>
                                                  </div>
                                                </div>
                                              ))}
                                          </div>
                                        </div>
                                      </div>

                                          {/* Staff Management Card (Preserved from Phase 2) */}
                                          <div className="rounded-2xl border border-[#F1F5F9] bg-white p-6 shadow-sm space-y-6">
                                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#F1F5F9]">
                                              <div className="flex items-center gap-2.5">
                                                  <Users className="w-5 h-5 text-[#64748B]" />
                                                  <h2 className="text-base font-bold text-[#0F172A]">Internal Staff Members</h2>
                                                  <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-[#475569]">
                                                    {staffList?.length || 0}
                                                  </span>
                                              </div>

                                              <button
                                                onClick={() => setIsCreatingStaff(!isCreatingStaff)}
                                                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-[#C8E63C] text-[#0F172A] hover:bg-[#B8DC30] transition-colors cursor-pointer self-start sm:self-auto"
                                              >
                                                <UserPlus className="w-3.5 h-3.5" />
                                                {isCreatingStaff ? 'Close Form' : 'New Staff Account'}
                                              </button>
                                            </div>

                                            {/* Collapsible Create Staff Form */}
                                            {isCreatingStaff && (
                                              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
                                                <div className="text-xs font-bold text-[#0F172A]">
                                                  Provision Staff Account
                                                </div>

                                                {formError && (
                                                  <div className="p-3 rounded-xl bg-red-50 text-red-600 text-xs">
                                                    {formError}
                                                  </div>
                                                )}

                                                <form onSubmit={handleCreateStaff} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                  <div>
                                                    <label className="block text-[11px] font-semibold text-[#475569] uppercase mb-1">
                                                      Full Name
                                                    </label>
                                                    <input
                                                      type="text"
                                                      required
                                                      value={newStaffName}
                                                      onChange={(e) => setNewStaffName(e.target.value)}
                                                      placeholder="Alex Thomas"
                                                      className="w-full h-10 px-3 rounded-xl border border-[#E2E8F0] bg-white text-xs focus:outline-none"
                                                    />
                                                  </div>
                                                  <div>
                                                    <label className="block text-[11px] font-semibold text-[#475569] uppercase mb-1">
                                                      Work Email
                                                    </label>
                                                    <input
                                                      type="email"
                                                      required
                                                      value={newStaffEmail}
                                                      onChange={(e) => setNewStaffEmail(e.target.value)}
                                                      placeholder="alex@brightloop.com"
                                                      className="w-full h-10 px-3 rounded-xl border border-[#E2E8F0] bg-white text-xs focus:outline-none"
                                                    />
                                                  </div>
                                                  <div>
                                                    <label className="block text-[11px] font-semibold text-[#475569] uppercase mb-1">
                                                      Initial Password
                                                    </label>
                                                    <input
                                                      type="password"
                                                      required
                                                      value={newStaffPassword}
                                                      onChange={(e) => setNewStaffPassword(e.target.value)}
                                                      placeholder="Min 9 chars (Staff@1234)"
                                                      className="w-full h-10 px-3 rounded-xl border border-[#E2E8F0] bg-white text-xs focus:outline-none"
                                                    />
                                                  </div>
                                                  <div className="md:col-span-3 flex justify-end gap-2 pt-2">
                                                    <button
                                                      type="button"
                                                      onClick={() => setIsCreatingStaff(false)}
                                                      className="px-3 py-1.5 text-xs text-[#64748B]"
                                                    >
                                                      Cancel
                                                    </button>
                                                    <button
                                                      type="submit"
                                                      disabled={createMutation.isPending}
                                                      className="px-4 py-1.5 rounded-xl bg-[#0F172A] text-white text-xs font-semibold hover:bg-slate-800 disabled:opacity-50"
                                                    >
                                                      {createMutation.isPending ? 'Creating...' : 'Create Account'}
                                                    </button>
                                                  </div>
                                                </form>
                                              </div>
                                            )}

                                            {/* Staff Table */}
                                            {isLoadingStaff ? (
                                                <div className="py-8 text-center text-xs text-[#94A3B8]">
                                                  <Loader2 className="w-5 h-5 animate-spin mx-auto mb-2 text-[#C8E63C]" />
                                                  Loading staff accounts...
                                                </div>
        ) : staffList && staffList.length > 0 ? (
                                                <div className="overflow-x-auto">
                                                        <table className="w-full text-left text-xs">
                                                          <thead>
                                                            <tr className="border-b border-[#F1F5F9] text-[10px] font-semibold uppercase text-[#94A3B8]">
                                                              <th className="py-3 px-4">Name</th>
                                                              <th className="py-3 px-4">Email</th>
                                                              <th className="py-3 px-4">Role</th>
                                                              <th className="py-3 px-4">Status</th>
                                                              <th className="py-3 px-4 text-right">Actions</th>
                                                            </tr>
                                                          </thead>
                                                                    <tbody className="divide-y divide-[#F8FAFC]">
                                                                      {staffList.map((member: StaffUser) => (
                                                                        <tr key={member.id} className="hover:bg-slate-50/60">
                                                                          <td className="py-3 px-4 font-semibold text-[#0F172A]">
                                                                            {member.name}
                                                                          </td>
                                                                          <td className="py-3 px-4 text-[#475569]">{member.email}</td>
                                                                          <td className="py-3 px-4">
                                                                            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-50 text-blue-700">
                                                                              {member.role}
                                                                            </span>
                                                                          </td>
                                                                            <td className="py-3 px-4">
                                                                              {member.isActive ? (
                                                                                  <span className="inline-flex items-center gap-1 text-[11px] text-emerald-600 font-semibold">
                                                                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                                                                    Active
                                                                                  </span>
                                                                                  ) : (
                                                                                    <span className="inline-flex items-center gap-1 text-[11px] text-red-500 font-medium">
                                                                                      <XCircle className="w-3.5 h-3.5" />
                                                                                      Deactivated
                                                                                    </span>
                      )}
                                                                                  </td>
                                                                                    <td className="py-3 px-4 text-right">
                                                                                      <button
                                                                                        onClick={() =>
                                                                                          toggleStatusMutation.mutate({
                                                                                            id: member.id,
                                                                                            isActive: !member.isActive,
                                                                                          })
                                                                                        }
                                                                                                ? 'text-red-500 hover:bg-red-50'
                                                                                                : 'text-emerald-600 hover:bg-emerald-50'
                                                                                            }`}
                      >
                        {member.isActive ? 'Deactivate' : 'Activate'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 text-xs text-[#94A3B8]">
            No staff accounts created yet.
          </div>
        )}
      </div>
    </div>
  );
}
