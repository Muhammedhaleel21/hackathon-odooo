'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getProductsApi, archiveProductApi, formatINR } from '../../../../lib/queries/catalog';
import { Product } from '../../../../types/catalog';
import { useAuth } from '../../../../hooks/use-auth';
import {
  Package,
  Plus,
  Search,
  Archive,
  Edit3,
  Loader2,
  TrendingUp,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

export default function ProductsPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const queryClient = useQueryClient();

  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Fetch products
  const {
    data: products,
    isLoading,
    error,
  } = useQuery<Product[]>({
    queryKey: ['products', search, typeFilter, statusFilter],
    queryFn: () =>
      getProductsApi({
        search: search || undefined,
        type: typeFilter !== 'all' ? typeFilter : undefined,
        status: statusFilter !== 'all' ? statusFilter : undefined,
      }),
  });

  // Archive mutation
  const archiveMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: 'active' | 'archived' }) =>
      archiveProductApi(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });

  return (
    <div className="space-y-6">
      {/* Top Action & Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#0F172A] tracking-tight">Products</h1>
          <p className="text-sm text-[#64748B] mt-1">
            Manage what the company sells, configure sales and cost prices, and manage variants.
          </p>
        </div>

        {isAdmin && (
          <Link
            href="/admin/products/new"
            className="inline-flex items-center gap-2 rounded-xl bg-[#C8E63C] px-5 py-2.5 text-sm font-semibold text-[#0F172A] hover:bg-[#B8DC30] transition-all shadow-sm active:scale-[0.98] shrink-0"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            Add Product
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
              placeholder="Search products..."
              className="h-10 w-full rounded-xl border border-[#E2E8F0] bg-white pl-10 pr-4 text-sm text-[#0F172A] placeholder-[#94A3B8] transition-colors focus:border-[#94A3B8] focus:outline-none"
            />
          </div>

          {/* Segmented Controls & Dropdowns */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Type Filter */}
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="h-9 rounded-xl border border-[#E2E8F0] bg-white px-3 text-xs font-medium text-[#334155] focus:outline-none focus:border-[#94A3B8]"
            >
              <option value="all">All Types</option>
              <option value="service">Service</option>
              <option value="goods">Goods</option>
              <option value="addon">Add-on</option>
            </select>

            {/* Status Segmented Control */}
            <div className="inline-flex items-center gap-1 rounded-xl bg-[#F1F5F9] p-1">
              {(['all', 'active', 'archived'] as const).map((s) => (
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
              ))}
            </div>
          </div>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-16 text-[#64748B]">
            <Loader2 className="w-8 h-8 animate-spin text-[#C8E63C] mb-2 stroke-[2.5]" />
            <p className="text-sm font-medium">Loading catalog products...</p>
          </div>
        ) : error ? (
          <div className="p-8 text-center text-red-500">
            <AlertCircle className="w-8 h-8 mx-auto mb-2 text-red-500" />
            <p className="text-sm font-semibold">Failed to load products</p>
            <p className="text-xs text-red-400 mt-1">{(error as Error).message}</p>
          </div>
        ) : products && products.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#F1F5F9] text-[11px] font-semibold uppercase tracking-wider text-[#94A3B8]">
                  <th className="px-6 py-3.5">Product</th>
                  <th className="px-6 py-3.5">Type</th>
                  <th className="px-6 py-3.5">Sales Price</th>
                  <th className="px-6 py-3.5">Cost Price</th>
                  <th className="px-6 py-3.5">Margin</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F8FAFC]">
                {products.map((product: Product) => {
                  const marginAmount = product.salesPrice - product.costPrice;
                  const marginPercent =
                    product.salesPrice > 0
                      ? Math.round((marginAmount / product.salesPrice) * 100)
                      : 0;

                  return (
                    <tr
                      key={product.id}
                      className="transition-colors hover:bg-[#F8FAFC]/80 group"
                    >
                      <td className="px-6 py-4">
                        <Link
                          href={`/admin/products/${product.id}`}
                          className="font-semibold text-sm text-[#0F172A] hover:underline flex flex-col"
                        >
                          <span>{product.name}</span>
                          {product.categoryName && (
                            <span className="text-xs text-[#94A3B8] font-normal">
                              {product.categoryName}
                            </span>
                          )}
                        </Link>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-[#475569] capitalize">
                          {product.productType}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-[#0F172A]">
                        {formatINR(product.salesPrice)}
                      </td>
                      <td className="px-6 py-4 text-sm text-[#475569]">
                        {formatINR(product.costPrice)}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span
                          className={`inline-flex items-center gap-1 text-xs font-semibold ${marginPercent >= 50
                              ? 'text-emerald-600'
                              : marginPercent > 0
                                ? 'text-blue-600'
                                : 'text-slate-500'
                            }`}
                        >
                          <TrendingUp className="w-3 h-3" />
                          {marginPercent}% ({formatINR(marginAmount)})
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {product.status === 'active' ? (
                          <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3" />
                            Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-xs font-medium text-[#94A3B8] bg-slate-100 px-2.5 py-1 rounded-full">
                            <Archive className="w-3 h-3" />
                            Archived
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right relative">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/admin/products/${product.id}`}
                            className="p-1.5 text-[#64748B] hover:text-[#0F172A] hover:bg-slate-100 rounded-lg transition-colors"
                            title="View & Edit"
                          >
                            <Edit3 className="w-4 h-4" />
                          </Link>

                          {isAdmin && (
                            <button
                              onClick={() =>
                                archiveMutation.mutate({
                                  id: product.id,
                                  status:
                                    product.status === 'active'
                                      ? 'archived'
                                      : 'active',
                                })
                              }
                              disabled={archiveMutation.isPending}
                              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${product.status === 'active'
                                  ? 'text-[#94A3B8] hover:text-[#EF4444] hover:bg-red-50'
                                  : 'text-emerald-600 hover:bg-emerald-50'
                                }`}
                              title={
                                product.status === 'active'
                                  ? 'Archive Product'
                                  : 'Activate Product'
                              }
                            >
                              <Archive className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-16 px-4">
            <Package className="w-12 h-12 text-[#94A3B8] mx-auto mb-3" />
            <h3 className="text-base font-bold text-[#0F172A]">No products found</h3>
            <p className="text-sm text-[#64748B] mt-1 max-w-sm mx-auto">
              {search || typeFilter !== 'all' || statusFilter !== 'all'
                ? 'Try adjusting your search query or filters.'
                : 'Get started by creating your first product.'}
            </p>
            {isAdmin && !search && (
              <Link
                href="/admin/products/new"
                className="inline-flex items-center gap-2 mt-4 rounded-xl bg-[#C8E63C] px-4 py-2 text-xs font-semibold text-[#0F172A] hover:bg-[#B8DC30] transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Product Now
              </Link>
            )}
          </div>
        )}

        {/* Footer Counter */}
        {products && products.length > 0 && (
          <div className="border-t border-[#F1F5F9] px-6 py-3.5 text-xs text-[#94A3B8]">
            Showing {products.length} {products.length === 1 ? 'product' : 'products'}
          </div>
        )}
      </div>
    </div>
  );
}