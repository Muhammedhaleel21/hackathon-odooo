'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation } from '@tanstack/react-query';
import {
  getCustomersApi,
  getQuotationTemplatesApi,
  getQuotationTemplateApi,
  createQuotationApi,
  issueQuotationApi,
} from '@/lib/queries/subscriptions';
import { getProductsApi, getPlansApi, formatINR } from '@/lib/queries/catalog';
import { Product, SubscriptionPlan } from '@/types/catalog';
import { CustomerUser, QuotationTemplate, Subscription } from '@/types/subscriptions';
import {
  FileText,
  ArrowLeft,
  Plus,
  Trash2,
  User,
  Calculator,
  AlertCircle,
  Loader2,
  FileSpreadsheet,
  Send,
  Save,
} from 'lucide-react';

interface LineItemDraft {
  productId: string;
  variantValueId?: string;
  quantity: number;
}

export default function NewQuotationPage() {
  const router = useRouter();

  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('');
  const [customerId, setCustomerId] = useState<string>('');
  const [planId, setPlanId] = useState<string>('');
  const [paymentTerms, setPaymentTerms] = useState<string>('immediate');
  const [notes, setNotes] = useState<string>('');
  const [lines, setLines] = useState<LineItemDraft[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Queries
  const { data: customers } = useQuery<CustomerUser[]>({
    queryKey: ['customers'],
    queryFn: getCustomersApi,
  });

  const { data: templates } = useQuery<QuotationTemplate[]>({
    queryKey: ['quotation-templates'],
    queryFn: getQuotationTemplatesApi,
  });

  const { data: products } = useQuery<Product[]>({
    queryKey: ['products'],
    queryFn: () => getProductsApi(),
  });

  const { data: plans } = useQuery<SubscriptionPlan[]>({
    queryKey: ['plans'],
    queryFn: () => getPlansApi(),
  });

  // Handle template selection
  const handleTemplateChange = async (templateId: string) => {
    setSelectedTemplateId(templateId);
    if (!templateId) return;

    try {
      const template = await getQuotationTemplateApi(templateId);
      if (template.defaultPlanId) {
        setPlanId(template.defaultPlanId);
      }
      if (template.lines && template.lines.length > 0) {
        setLines(
          template.lines.map((l) => ({
            productId: l.productId,
            variantValueId: l.variantValueId || undefined,
            quantity: l.defaultQuantity,
          })),
        );
      }
    } catch (err: any) {
      console.error('Failed to load template lines', err);
    }
  };

  // Add initial line when products load and lines empty
  useEffect(() => {
    if (products && products.length > 0 && lines.length === 0 && !selectedTemplateId) {
      setLines([
        {
          productId: products[0].id,
          quantity: 1,
        },
      ]);
    }
  }, [products]);

  // Set default customer if available
  useEffect(() => {
    if (customers && customers.length > 0 && !customerId) {
      setCustomerId(customers[0].id);
    }
  }, [customers]);

  // Set default plan if available
  useEffect(() => {
    if (plans && plans.length > 0 && !planId && !selectedTemplateId) {
      setPlanId(plans[0].id);
    }
  }, [plans]);

  const handleAddLine = () => {
    if (!products || products.length === 0) return;
    setLines((prev) => [
      ...prev,
      {
        productId: products[0].id,
        quantity: 1,
      },
    ]);
  };

  const handleRemoveLine = (idx: number) => {
    setLines((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleLineProductChange = (idx: number, newProductId: string) => {
    setLines((prev) =>
      prev.map((l, i) =>
        i === idx ? { ...l, productId: newProductId, variantValueId: undefined } : l,
      ),
    );
  };

  const handleLineQuantityChange = (idx: number, qty: number) => {
    setLines((prev) =>
      prev.map((l, i) =>
        i === idx ? { ...l, quantity: Math.max(1, qty) } : l,
      ),
    );
  };

  // Compute live calculations
  let subtotal = 0;
  let taxTotal = 0;

  const computedLines = lines.map((line) => {
    const product = products?.find((p: Product) => p.id === line.productId);
    const unitPrice = product ? product.salesPrice : 0;
    const baseTotal = unitPrice * line.quantity;
    const lineTax = Math.round((baseTotal * 18) / 100);
    const lineTotal = baseTotal + lineTax;

    subtotal += baseTotal;
    taxTotal += lineTax;

    return {
      product,
      unitPrice,
      baseTotal,
      lineTax,
      lineTotal,
    };
  });

  const totalAmount = subtotal + taxTotal;

  // Mutations
  const createMutation = useMutation({
    mutationFn: (andIssue: boolean) =>
      createQuotationApi({
        customerId,
        planId,
        quotationTemplateId: selectedTemplateId || undefined,
        paymentTerms,
        notes: notes || undefined,
        lines: lines.map((l) => ({
          productId: l.productId,
          variantValueId: l.variantValueId || undefined,
          quantity: l.quantity,
        })),
      }).then(async (createdQuote: Subscription) => {
        if (andIssue) {
          return issueQuotationApi(createdQuote.id);
        }
        return createdQuote;
      }),
    onSuccess: (data: Subscription) => {
      router.push(`/quotations/${data.id}`);
    },
    onError: (err: Error) => {
      setError(err.message || 'Failed to create quotation');
    },
  });

  const handleSave = (andIssue: boolean) => {
    setError(null);
    if (!customerId) {
      setError('Please select a customer for this quotation.');
      return;
    }
    if (!planId) {
      setError('Please select a subscription plan.');
      return;
    }
    if (lines.length === 0) {
      setError('At least one product line is required.');
      return;
    }
    createMutation.mutate(andIssue);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link
          href="/quotations"
          className="p-2 rounded-xl bg-white border border-[#E2E8F0] text-[#64748B] hover:text-[#0F172A] hover:bg-slate-50 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-[#94A3B8]">
            Quotation Builder
          </div>
          <h1 className="text-2xl font-extrabold text-[#0F172A]">
            Prepare Customer Quotation
          </h1>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-600 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Template Preset Selector Banner */}
      <div className="p-5 rounded-2xl bg-white border border-[#F1F5F9] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#C8E63C]/30 text-[#0F172A] flex items-center justify-center font-bold shrink-0">
            <FileSpreadsheet className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#0F172A]">Pre-fill with Quotation Template</h3>
            <p className="text-xs text-[#64748B]">
              Load predefined plans and product bundles directly into this offer.
            </p>
          </div>
        </div>

        <div className="w-full sm:w-72">
          <select
            value={selectedTemplateId}
            onChange={(e) => handleTemplateChange(e.target.value)}
            className="w-full h-10 px-3 rounded-xl border border-[#E2E8F0] bg-slate-50 text-xs font-semibold text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#C8E63C]"
          >
            <option value="">-- Start from Scratch --</option>
            {templates
              ?.filter((t: QuotationTemplate) => t.isActive)
              .map((t: QuotationTemplate) => (
                <option key={t.id} value={t.id}>
                  {t.name} ({t.validityDays}d validity)
                </option>
              ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Form Details & Lines (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Customer & Plan Details */}
          <div className="p-6 rounded-2xl bg-white border border-[#F1F5F9] shadow-sm space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-[#F1F5F9]">
              <User className="w-4 h-4 text-[#64748B]" />
              <h2 className="text-sm font-bold text-[#0F172A]">Customer & Plan Configuration</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#475569] uppercase mb-1.5">
                  Customer *
                </label>
                <select
                  value={customerId}
                  onChange={(e) => setCustomerId(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl border border-[#E2E8F0] bg-white text-xs font-medium text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#C8E63C]"
                >
                  <option value="">Select a customer</option>
                  {customers?.map((c: CustomerUser) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.email})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#475569] uppercase mb-1.5">
                  Subscription Plan *
                </label>
                <select
                  value={planId}
                  onChange={(e) => setPlanId(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl border border-[#E2E8F0] bg-white text-xs font-medium text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#C8E63C]"
                >
                  <option value="">Select a plan</option>
                  {plans?.map((p: SubscriptionPlan) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({formatINR(p.price)} / {p.billingInterval})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#475569] uppercase mb-1.5">
                  Payment Terms
                </label>
                <select
                  value={paymentTerms}
                  onChange={(e) => setPaymentTerms(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl border border-[#E2E8F0] bg-white text-xs font-medium text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#C8E63C]"
                >
                  <option value="immediate">Immediate Payment</option>
                  <option value="net_15">Net 15 Days</option>
                  <option value="net_30">Net 30 Days</option>
                  <option value="net_60">Net 60 Days</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#475569] uppercase mb-1.5">
                  Terms & Notes
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Valid until next month with onboard SLA"
                  className="w-full h-11 px-3.5 rounded-xl border border-[#E2E8F0] bg-white text-xs text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#C8E63C]"
                />
              </div>
            </div>
          </div>

          {/* Product Line Items */}
          <div className="p-6 rounded-2xl bg-white border border-[#F1F5F9] shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#F1F5F9]">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#64748B]" />
                <h2 className="text-sm font-bold text-[#0F172A]">Quotation Line Items</h2>
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

            <div className="space-y-3">
              {lines.map((line, idx) => {
                const computed = computedLines[idx];
                return (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row items-center gap-3">
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

                      <div className="w-full sm:w-28">
                        <label className="block text-[10px] font-bold uppercase text-[#64748B] mb-1">
                          Quantity
                        </label>
                        <input
                          type="number"
                          min={1}
                          value={line.quantity}
                          onChange={(e) => handleLineQuantityChange(idx, Number(e.target.value))}
                          className="w-full h-10 px-3 rounded-lg border border-[#E2E8F0] bg-white text-xs font-semibold text-center text-[#0F172A]"
                        />
                      </div>

                      <div className="w-full sm:w-32 text-right">
                        <label className="block text-[10px] font-bold uppercase text-[#64748B] mb-1">
                          Line Total
                        </label>
                        <div className="text-xs font-black text-[#0F172A] h-10 flex items-center justify-end">
                          {formatINR(computed?.lineTotal || 0)}
                        </div>
                      </div>

                      <div className="self-end sm:self-center pt-1 sm:pt-4">
                        <button
                          type="button"
                          onClick={() => handleRemoveLine(idx)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-[#94A3B8] pt-1 border-t border-slate-200/60">
                      <span>Unit Price: {formatINR(computed?.unitPrice || 0)}</span>
                      <span>18% GST: {formatINR(computed?.lineTax || 0)}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Pricing Summary & Actions (1 col) */}
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-white border border-[#F1F5F9] shadow-sm space-y-5 sticky top-24">
            <div className="flex items-center gap-2 pb-3 border-b border-[#F1F5F9]">
              <Calculator className="w-4 h-4 text-[#64748B]" />
              <h2 className="text-sm font-bold text-[#0F172A]">Quotation Summary</h2>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between text-[#64748B]">
                <span>Lines Subtotal</span>
                <span className="font-semibold text-[#0F172A]">{formatINR(subtotal)}</span>
              </div>

              <div className="flex items-center justify-between text-[#64748B]">
                <span className="flex items-center gap-1">
                  Standard GST (18%)
                  <span className="text-[10px] bg-slate-100 text-[#475569] px-1 py-0.5 rounded">CGST+SGST</span>
                </span>
                <span className="font-semibold text-[#0F172A]">{formatINR(taxTotal)}</span>
              </div>

              <div className="pt-3 border-t border-[#F1F5F9] flex items-center justify-between">
                <div>
                  <span className="font-bold text-sm text-[#0F172A] block">Total Amount</span>
                  <span className="text-[10px] text-[#94A3B8]">Inclusive of all taxes</span>
                </div>
                <div className="text-xl font-black text-[#0F172A]">
                  {formatINR(totalAmount)}
                </div>
              </div>
            </div>

            <div className="space-y-2.5 pt-4 border-t border-[#F1F5F9]">
              <button
                type="button"
                onClick={() => handleSave(true)}
                disabled={createMutation.isPending}
                className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-xs bg-[#C8E63C] text-[#0F172A] hover:bg-[#B8DC30] transition-all shadow-sm cursor-pointer disabled:opacity-50"
              >
                {createMutation.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
                Save & Issue to Customer
              </button>

              <button
                type="button"
                onClick={() => handleSave(false)}
                disabled={createMutation.isPending}
                className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-semibold text-xs border border-[#E2E8F0] bg-white text-[#334155] hover:bg-slate-50 transition-all cursor-pointer disabled:opacity-50"
              >
                <Save className="w-3.5 h-3.5" />
                Save as Draft
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
