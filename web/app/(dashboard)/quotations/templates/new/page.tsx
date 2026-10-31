'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation } from '@tanstack/react-query';
import { getProductsApi, getPlansApi, formatINR } from '@/lib/queries/catalog';
import { createQuotationTemplateApi } from '@/lib/queries/subscriptions';
import { Product, SubscriptionPlan } from '@/types/catalog';
import {
  FileSpreadsheet,
  ArrowLeft,
  Plus,
  Trash2,
  Clock,
  Package,
  AlertCircle,
  Loader2,
} from 'lucide-react';

interface TemplateLineDraft {
  productId: string;
  variantValueId?: string;
  defaultQuantity: number;
}

export default function NewQuotationTemplatePage() {
  const router = useRouter();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [defaultPlanId, setDefaultPlanId] = useState('');
  const [validityDays, setValidityDays] = useState(15);
  const [isActive, setIsActive] = useState(true);
  const [lines, setLines] = useState<TemplateLineDraft[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Fetch products and plans
  const { data: products } = useQuery<Product[]>({
    queryKey: ['products'],
    queryFn: () => getProductsApi(),
  });

  const { data: plans } = useQuery<SubscriptionPlan[]>({
    queryKey: ['plans'],
    queryFn: () => getPlansApi(),
  });

  const createMutation = useMutation({
    mutationFn: createQuotationTemplateApi,
    onSuccess: () => {
      router.push('/quotations/templates');
    },
    onError: (err: Error) => {
      setError(err.message || 'Failed to create quotation template');
    },
  });

  const handleAddLine = () => {
    if (!products || products.length === 0) return;
    setLines((prev) => [
      ...prev,
      {
        productId: products[0].id,
        defaultQuantity: 1,
      },
    ]);
  };

  const handleRemoveLine = (index: number) => {
    setLines((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleLineProductChange = (index: number, productId: string) => {
    setLines((prev) =>
      prev.map((l, idx) =>
        idx === index ? { ...l, productId, variantValueId: undefined } : l,
      ),
    );
  };

  const handleLineQuantityChange = (index: number, qty: number) => {
    setLines((prev) =>
      prev.map((l, idx) =>
        idx === index ? { ...l, defaultQuantity: Math.max(1, qty) } : l,
      ),
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError('Template name is required');
      return;
    }

    createMutation.mutate({
      name: name.trim(),
      description: description.trim() || undefined,
      defaultPlanId: defaultPlanId || undefined,
      validityDays: Number(validityDays) || 15,
      isActive,
      lines: lines.map((l) => ({
        productId: l.productId,
        variantValueId: l.variantValueId || undefined,
        defaultQuantity: l.defaultQuantity,
      })),
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Back button & Breadcrumb */}
      <div className="flex items-center gap-3">
        <Link
          href="/quotations/templates"
          className="p-2 rounded-xl bg-white border border-[#E2E8F0] text-[#64748B] hover:text-[#0F172A] hover:bg-slate-50 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-[#94A3B8]">
            Templates
          </div>
          <h1 className="text-xl font-extrabold text-[#0F172A]">
            Create Quotation Template
          </h1>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-600 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Template Overview Card */}
        <div className="p-6 rounded-2xl bg-white border border-[#F1F5F9] shadow-sm space-y-5">
          <div className="flex items-center gap-2 pb-3 border-b border-[#F1F5F9]">
            <FileSpreadsheet className="w-4 h-4 text-[#64748B]" />
            <h2 className="text-sm font-bold text-[#0F172A]">Template Details</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-[#475569] uppercase mb-1.5">
                Template Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Business Starter Package"
                className="w-full h-11 px-3.5 rounded-xl border border-[#E2E8F0] bg-white text-xs font-medium text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#C8E63C]"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-[#475569] uppercase mb-1.5">
                Description / Purpose
              </label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Standard commercial package including ERP seat and managed cloud server"
                className="w-full p-3 rounded-xl border border-[#E2E8F0] bg-white text-xs text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#C8E63C]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#475569] uppercase mb-1.5">
                Default Subscription Plan
              </label>
              <select
                value={defaultPlanId}
                onChange={(e) => setDefaultPlanId(e.target.value)}
                className="w-full h-11 px-3.5 rounded-xl border border-[#E2E8F0] bg-white text-xs font-medium text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#C8E63C]"
              >
                <option value="">No default plan (choose during quote creation)</option>
                {plans?.map((p: SubscriptionPlan) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({formatINR(p.price)} / {p.billingInterval})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#475569] uppercase mb-1.5">
                Quotation Validity (Days)
              </label>
              <div className="relative">
                <Clock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
                <input
                  type="number"
                  min={1}
                  max={365}
                  required
                  value={validityDays}
                  onChange={(e) => setValidityDays(Number(e.target.value))}
                  className="w-full h-11 pl-10 pr-3.5 rounded-xl border border-[#E2E8F0] bg-white text-xs font-semibold text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#C8E63C]"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Product Lines Card */}
        <div className="p-6 rounded-2xl bg-white border border-[#F1F5F9] shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#F1F5F9]">
            <div className="flex items-center gap-2">
              <Package className="w-4 h-4 text-[#64748B]" />
              <h2 className="text-sm font-bold text-[#0F172A]">Default Product Lines</h2>
            </div>
            <button
              type="button"
              onClick={handleAddLine}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 text-[#0F172A] hover:bg-slate-200 transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Product Line
            </button>
          </div>

          {lines.length === 0 ? (
            <div className="p-8 text-center text-xs text-[#94A3B8] border border-dashed border-[#E2E8F0] rounded-xl">
              No products added to this template yet. Click &quot;Add Product Line&quot; to include catalog items with pre-filled quantities.
            </div>
          ) : (
            <div className="space-y-3">
              {lines.map((line, idx) => (
                <div
                  key={idx}
                  className="flex flex-col sm:flex-row items-center gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200"
                >
                  <div className="flex-1 w-full">
                    <label className="block text-[10px] font-bold uppercase text-[#64748B] mb-1">
                      Product
                    </label>
                    <select
                      value={line.productId}
                      onChange={(e) => handleLineProductChange(idx, e.target.value)}
                      className="w-full h-10 px-3 rounded-lg border border-[#E2E8F0] bg-white text-xs text-[#0F172A]"
                    >
                      {products?.map((p: Product) => (
                        <option key={p.id} value={p.id}>
                          {p.name} — {formatINR(p.salesPrice)}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="w-full sm:w-32">
                    <label className="block text-[10px] font-bold uppercase text-[#64748B] mb-1">
                      Default Qty
                    </label>
                    <input
                      type="number"
                      min={1}
                      value={line.defaultQuantity}
                      onChange={(e) => handleLineQuantityChange(idx, Number(e.target.value))}
                      className="w-full h-10 px-3 rounded-lg border border-[#E2E8F0] bg-white text-xs text-[#0F172A] font-semibold text-center"
                    />
                  </div>

                  <div className="self-end sm:self-center pt-2 sm:pt-4">
                    <button
                      type="button"
                      onClick={() => handleRemoveLine(idx)}
                      className="p-2 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Action Bar */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Link
            href="/quotations/templates"
            className="px-5 py-2.5 rounded-xl border border-[#E2E8F0] bg-white text-xs font-semibold text-[#64748B] hover:bg-slate-50 transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={createMutation.isPending}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#C8E63C] text-xs font-bold text-[#0F172A] hover:bg-[#B8DC30] transition-all shadow-sm disabled:opacity-50 cursor-pointer"
          >
            {createMutation.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
            Save Quotation Template
          </button>
        </div>
      </form>
    </div>
  );
}
