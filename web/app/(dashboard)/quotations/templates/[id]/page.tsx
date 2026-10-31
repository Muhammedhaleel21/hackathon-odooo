'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getQuotationTemplateApi,
  updateQuotationTemplateApi,
  duplicateQuotationTemplateApi,
  toggleQuotationTemplateStatusApi,
} from '@/lib/queries/subscriptions';
import { getProductsApi, getPlansApi, formatINR } from '@/lib/queries/catalog';
import {
  QuotationTemplate,
  QuotationTemplateLine,
  UpdateQuotationTemplateInput,
} from '@/types/subscriptions';
import { Product, SubscriptionPlan } from '@/types/catalog';
import {
  ArrowLeft,
  Edit2,
  Save,
  Copy,
  Package,
  Layers,
  Clock,
  Plus,
  Trash2,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Loader2,
} from 'lucide-react';

export default function QuotationTemplateDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const queryClient = useQueryClient();

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [defaultPlanId, setDefaultPlanId] = useState('');
  const [validityDays, setValidityDays] = useState(15);
  const [lines, setLines] = useState<
    Array<{ productId: string; variantValueId?: string; defaultQuantity: number }>
  >([]);
  const [error, setError] = useState<string | null>(null);

  const { data: template, isLoading } = useQuery<QuotationTemplate>({
    queryKey: ['quotation-template', id],
    queryFn: () => getQuotationTemplateApi(id),
    enabled: !!id,
  });

  const { data: products } = useQuery<Product[]>({
    queryKey: ['products'],
    queryFn: () => getProductsApi(),
  });

  const { data: plans } = useQuery<SubscriptionPlan[]>({
    queryKey: ['plans'],
    queryFn: () => getPlansApi(),
  });

  useEffect(() => {
    if (template) {
      setName(template.name);
      setDescription(template.description || '');
      setDefaultPlanId(template.defaultPlanId || '');
      setValidityDays(template.validityDays);
      if (template.lines) {
        setLines(
          template.lines.map((l: QuotationTemplateLine) => ({
            productId: l.productId,
            variantValueId: l.variantValueId || undefined,
            defaultQuantity: l.defaultQuantity,
          })),
        );
      }
    }
  }, [template]);

  const updateMutation = useMutation({
    mutationFn: (payload: UpdateQuotationTemplateInput) =>
      updateQuotationTemplateApi(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quotation-template', id] });
      queryClient.invalidateQueries({ queryKey: ['quotation-templates'] });
      setIsEditing(false);
    },
    onError: (err: Error) => {
      setError(err.message || 'Failed to update template');
    },
  });

  const toggleMutation = useMutation({
    mutationFn: () => toggleQuotationTemplateStatusApi(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quotation-template', id] });
      queryClient.invalidateQueries({ queryKey: ['quotation-templates'] });
    },
  });

  const duplicateMutation = useMutation({
    mutationFn: () => duplicateQuotationTemplateApi(id),
    onSuccess: (newTpl: QuotationTemplate) => {
      router.push(`/quotations/templates/${newTpl.id}`);
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

  const handleRemoveLine = (idx: number) => {
    setLines((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    updateMutation.mutate({
      name: name.trim(),
      description: description.trim() || undefined,
      defaultPlanId: defaultPlanId || undefined,
      validityDays: Number(validityDays),
      lines: lines.map((l) => ({
        productId: l.productId,
        variantValueId: l.variantValueId || undefined,
        defaultQuantity: l.defaultQuantity,
      })),
    });
  };

  if (isLoading) {
    return (
      <div className="p-16 text-center text-xs text-[#94A3B8] flex flex-col items-center gap-3">
        <Loader2 className="w-6 h-6 animate-spin text-[#C8E63C]" />
        <span>Loading template details...</span>
      </div>
    );
  }

  if (!template) {
    return (
      <div className="p-8 text-center text-sm text-[#0F172A]">
        Quotation template not found.
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/quotations/templates"
            className="p-2 rounded-xl bg-white border border-[#E2E8F0] text-[#64748B] hover:text-[#0F172A] hover:bg-slate-50 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-[#94A3B8]">
              Template Configuration
            </div>
            <h1 className="text-2xl font-extrabold text-[#0F172A]">
              {template.name}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => duplicateMutation.mutate()}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border border-[#E2E8F0] bg-white text-[#334155] hover:bg-slate-50 transition-colors cursor-pointer"
          >
            <Copy className="w-3.5 h-3.5" />
            Duplicate
          </button>
          <button
            onClick={() => toggleMutation.mutate()}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
              template.isActive
                ? 'bg-red-50 text-red-600 hover:bg-red-100'
                : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
            }`}
          >
            {template.isActive ? 'Deactivate' : 'Activate'}
          </button>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-[#C8E63C] text-[#0F172A] hover:bg-[#B8DC30] transition-colors cursor-pointer"
          >
            <Edit2 className="w-3.5 h-3.5" />
            {isEditing ? 'Cancel Edit' : 'Edit Template'}
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-600 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Main Form / Display */}
      {isEditing ? (
        <form onSubmit={handleSave} className="space-y-6">
          <div className="p-6 rounded-2xl bg-white border border-[#F1F5F9] shadow-sm space-y-5">
            <h2 className="text-sm font-bold text-[#0F172A] pb-3 border-b border-[#F1F5F9]">
              Edit Template Parameters
            </h2>

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
                  className="w-full h-11 px-3.5 rounded-xl border border-[#E2E8F0] bg-white text-xs font-medium text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#C8E63C]"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-[#475569] uppercase mb-1.5">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
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
                  <option value="">No default plan</option>
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
                <input
                  type="number"
                  min={1}
                  required
                  value={validityDays}
                  onChange={(e) => setValidityDays(Number(e.target.value))}
                  className="w-full h-11 px-3.5 rounded-xl border border-[#E2E8F0] bg-white text-xs font-semibold text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#C8E63C]"
                />
              </div>
            </div>
          </div>

          {/* Edit Lines */}
          <div className="p-6 rounded-2xl bg-white border border-[#F1F5F9] shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#F1F5F9]">
              <div className="flex items-center gap-2">
                <Package className="w-4 h-4 text-[#64748B]" />
                <h2 className="text-sm font-bold text-[#0F172A]">Default Product Lines</h2>
              </div>
              <button
                type="button"
                onClick={handleAddLine}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 text-[#0F172A] hover:bg-slate-200 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Product Line
              </button>
            </div>

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
                      onChange={(e) =>
                        setLines((prev) =>
                          prev.map((l, i) => (i === idx ? { ...l, productId: e.target.value } : l)),
                        )
                      }
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
                      Qty
                    </label>
                    <input
                      type="number"
                      min={1}
                      value={line.defaultQuantity}
                      onChange={(e) =>
                        setLines((prev) =>
                          prev.map((l, i) =>
                            i === idx ? { ...l, defaultQuantity: Math.max(1, Number(e.target.value)) } : l,
                          ),
                        )
                      }
                      className="w-full h-10 px-3 rounded-lg border border-[#E2E8F0] bg-white text-xs font-semibold text-center text-[#0F172A]"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRemoveLine(idx)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg self-end sm:self-center pt-2 sm:pt-4"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-5 py-2.5 rounded-xl border border-[#E2E8F0] bg-white text-xs font-semibold text-[#64748B]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={updateMutation.isPending}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#C8E63C] text-xs font-bold text-[#0F172A] hover:bg-[#B8DC30] disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              Save Changes
            </button>
          </div>
        </form>
      ) : (
        /* Read-only Detailed View */
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-white border border-[#F1F5F9] shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#F1F5F9]">
              <span className="text-xs font-bold uppercase tracking-wider text-[#94A3B8]">
                Template Overview
              </span>
              {template.isActive ? (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  Active
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200">
                  <XCircle className="w-3.5 h-3.5 text-slate-500" />
                  Inactive
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div>
                <span className="text-[11px] font-semibold text-[#94A3B8] uppercase block">
                  Default Plan
                </span>
                <div className="text-sm font-bold text-[#0F172A] mt-1 flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-blue-600" />
                  {template.defaultPlanName || 'None'}
                </div>
                {template.defaultPlanPrice !== null && template.defaultPlanPrice !== undefined && (
                  <div className="text-xs text-[#64748B] mt-0.5">
                    {formatINR(template.defaultPlanPrice)} / {template.defaultPlanInterval}
                  </div>
                )}
              </div>

              <div>
                <span className="text-[11px] font-semibold text-[#94A3B8] uppercase block">
                  Quotation Validity
                </span>
                <div className="text-sm font-bold text-[#0F172A] mt-1 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-amber-600" />
                  {template.validityDays} days from issue
                </div>
              </div>

              <div>
                <span className="text-[11px] font-semibold text-[#94A3B8] uppercase block">
                  Line Items
                </span>
                <div className="text-sm font-bold text-[#0F172A] mt-1">
                  {template.lines?.length || 0} product lines configured
                </div>
              </div>
            </div>

            {template.description && (
              <div className="pt-3 border-t border-[#F1F5F9]">
                <span className="text-[11px] font-semibold text-[#94A3B8] uppercase block mb-1">
                  Usage Description
                </span>
                <p className="text-xs text-[#475569] leading-relaxed">
                  {template.description}
                </p>
              </div>
            )}
          </div>

          {/* Product Lines Table */}
          <div className="rounded-2xl border border-[#F1F5F9] bg-white shadow-sm overflow-hidden">
            <div className="p-4 px-6 border-b border-[#F1F5F9] flex items-center justify-between">
              <h2 className="text-xs font-bold uppercase tracking-wider text-[#94A3B8]">
                Included Product Lines
              </h2>
              <span className="text-xs font-semibold text-[#475569]">
                {template.lines?.length || 0} Items
              </span>
            </div>

            {template.lines && template.lines.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="bg-slate-50/50 text-[10px] font-bold uppercase text-[#94A3B8] border-b border-[#F1F5F9]">
                      <th className="py-3 px-6">Product</th>
                      <th className="py-3 px-6">Type</th>
                      <th className="py-3 px-6">Quantity</th>
                      <th className="py-3 px-6 text-right">Standard Price</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F8FAFC]">
                    {template.lines.map((l: QuotationTemplateLine) => (
                      <tr key={l.id}>
                        <td className="py-3.5 px-6 font-semibold text-[#0F172A]">
                          {l.productName}
                          {l.variantValue && (
                            <span className="ml-2 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-[#475569]">
                              {l.variantValue}
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-6 text-[#64748B] capitalize">
                          {l.productType}
                        </td>
                        <td className="py-3.5 px-6 font-bold text-[#0F172A]">
                          {l.defaultQuantity}
                        </td>
                        <td className="py-3.5 px-6 text-right font-bold text-[#0F172A]">
                          {formatINR(l.productPrice)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-8 text-center text-xs text-[#94A3B8]">
                No product lines defined in this template.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
