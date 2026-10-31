'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createProductApi,
  getCategoriesApi,
  createCategoryApi,
  formatINR,
} from '../../../../../lib/queries/catalog';
import {
  ProductType,
  ProductStatus,
  Product,
  ProductCategory,
} from '../../../../../types/catalog';
import {
  ArrowLeft,
  Package,
  Plus,
  Loader2,
  DollarSign,
  TrendingUp,
  Tag,
  FileText,
} from 'lucide-react';

export default function NewProductPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [name, setName] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [productType, setProductType] = useState<ProductType>('service');
  const [salesPriceRupees, setSalesPriceRupees] = useState<number>(2000);
  const [costPriceRupees, setCostPriceRupees] = useState<number>(800);
  const [notes, setNotes] = useState('');
  const [status, setStatus] = useState<ProductStatus>('active');
  const [formError, setFormError] = useState<string | null>(null);

  // Quick inline category modal state
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCatName, setNewCatName] = useState('');

  // Fetch categories
  const { data: categories } = useQuery<ProductCategory[]>({
    queryKey: ['categories'],
    queryFn: getCategoriesApi,
  });

  // Create Category mutation
  const categoryMutation = useMutation({
    mutationFn: (catName: string) => createCategoryApi({ name: catName }),
    onSuccess: (newCat: ProductCategory) => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      setCategoryId(newCat.id);
      setIsAddingCategory(false);
      setNewCatName('');
    },
  });

  // Create Product mutation
  const createMutation = useMutation({
    mutationFn: createProductApi,
    onSuccess: (created: Product) => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      router.push(`/admin/products/${created.id}`);
    },
    onError: (err: Error) => {
      setFormError(err.message || 'Failed to create product');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!name.trim()) {
      setFormError('Product name is required');
      return;
    }

    if (salesPriceRupees < 0 || costPriceRupees < 0) {
      setFormError('Prices cannot be negative');
      return;
    }

    createMutation.mutate({
      name: name.trim(),
      categoryId: categoryId || undefined,
      productType,
      salesPrice: Math.round(salesPriceRupees * 100), // convert to paise
      costPrice: Math.round(costPriceRupees * 100), // convert to paise
      notes: notes.trim() || undefined,
      status,
    });
  };

  const marginRupees = salesPriceRupees - costPriceRupees;
  const marginPercent =
    salesPriceRupees > 0
      ? Math.round((marginRupees / salesPriceRupees) * 100)
      : 0;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Breadcrumb & Title */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/products"
            className="inline-flex items-center gap-1.5 rounded-xl border border-[#E2E8F0] bg-white px-3 py-1.5 text-xs font-semibold text-[#334155] hover:bg-slate-50 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Products
          </Link>
          <h1 className="text-xl font-bold text-[#0F172A]">Add New Product</h1>
        </div>
      </div>

      {formError && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-sm text-red-600">
          {formError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1: Basic Information */}
        <div className="rounded-2xl border border-[#F1F5F9] bg-white p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-[#F1F5F9]">
            <Package className="w-4 h-4 text-[#64748B]" />
            <h2 className="text-base font-bold text-[#0F172A]">Basic Information</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-[#475569] uppercase tracking-wider mb-1.5">
                Product Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Business Software, Website Hosting"
                className="h-11 w-full rounded-xl border border-[#E2E8F0] bg-white px-4 text-sm text-[#0F172A] placeholder-[#94A3B8] focus:border-[#94A3B8] focus:outline-none"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-[#475569] uppercase tracking-wider">
                  Category
                </label>
                <button
                  type="button"
                  onClick={() => setIsAddingCategory(!isAddingCategory)}
                  className="text-xs font-medium text-blue-600 hover:underline"
                >
                  + New Category
                </button>
              </div>

              {isAddingCategory ? (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={newCatName}
                    onChange={(e) => setNewCatName(e.target.value)}
                    placeholder="New category name..."
                    className="h-10 flex-1 rounded-xl border border-blue-300 px-3 text-xs focus:outline-none"
                  />
                  <button
                    type="button"
                    disabled={!newCatName.trim() || categoryMutation.isPending}
                    onClick={() => categoryMutation.mutate(newCatName.trim())}
                    className="h-10 px-3 rounded-xl bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 disabled:opacity-50"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsAddingCategory(false)}
                    className="h-10 px-2 text-xs text-[#64748B]"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="h-11 w-full rounded-xl border border-[#E2E8F0] bg-white px-3 text-sm text-[#0F172A] focus:outline-none focus:border-[#94A3B8]"
                >
                  <option value="">Select a category (optional)</option>
                  {categories?.map((cat: ProductCategory) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#475569] uppercase tracking-wider mb-1.5">
                Product Type <span className="text-red-500">*</span>
              </label>
              <select
                value={productType}
                onChange={(e) => setProductType(e.target.value as ProductType)}
                className="h-11 w-full rounded-xl border border-[#E2E8F0] bg-white px-3 text-sm text-[#0F172A] focus:outline-none focus:border-[#94A3B8]"
              >
                <option value="service">Service (Subscriptions & Cloud)</option>
                <option value="goods">Goods (Physical or Hardware)</option>
                <option value="addon">Add-on (Supplementary Features)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 2: Pricing & Margins */}
        <div className="rounded-2xl border border-[#F1F5F9] bg-white p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-[#F1F5F9]">
            <DollarSign className="w-4 h-4 text-[#64748B]" />
            <h2 className="text-base font-bold text-[#0F172A]">Pricing & Cost</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#475569] uppercase tracking-wider mb-1.5">
                Sales Price (₹ INR) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-semibold text-[#94A3B8]">
                  ₹
                </span>
                <input
                  type="number"
                  min="0"
                  step="1"
                  required
                  value={salesPriceRupees}
                  onChange={(e) => setSalesPriceRupees(Number(e.target.value))}
                  placeholder="2000"
                  className="h-11 w-full rounded-xl border border-[#E2E8F0] bg-white pl-8 pr-4 text-sm font-semibold text-[#0F172A] focus:border-[#94A3B8] focus:outline-none"
                />
              </div>
              <p className="text-xs text-[#94A3B8] mt-1">Price billed to customers</p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#475569] uppercase tracking-wider mb-1.5">
                Internal Cost Price (₹ INR)
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-semibold text-[#94A3B8]">
                  ₹
                </span>
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={costPriceRupees}
                  onChange={(e) => setCostPriceRupees(Number(e.target.value))}
                  placeholder="800"
                  className="h-11 w-full rounded-xl border border-[#E2E8F0] bg-white pl-8 pr-4 text-sm font-semibold text-[#0F172A] focus:border-[#94A3B8] focus:outline-none"
                />
              </div>
              <p className="text-xs text-[#94A3B8] mt-1">Internal provisioning or COGS</p>
            </div>

            {/* Live Profit Preview Box */}
            <div className="md:col-span-2 p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-emerald-100 text-emerald-700">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs text-[#64748B] font-medium">Estimated Gross Profit Margin</div>
                  <div className="text-base font-bold text-[#0F172A]">
                    ₹{marginRupees.toLocaleString('en-IN')} / unit ({marginPercent}%)
                  </div>
                </div>
              </div>
              <div className="text-right text-xs text-[#64748B]">
                Sales: ₹{salesPriceRupees.toLocaleString('en-IN')} · Cost: ₹{costPriceRupees.toLocaleString('en-IN')}
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Notes & Information */}
        <div className="rounded-2xl border border-[#F1F5F9] bg-white p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-[#F1F5F9]">
            <FileText className="w-4 h-4 text-[#64748B]" />
            <h2 className="text-base font-bold text-[#0F172A]">Description & Notes</h2>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#475569] uppercase tracking-wider mb-1.5">
              Product Description
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Provide technical specifications, service level agreements or customer instructions..."
              className="w-full rounded-xl border border-[#E2E8F0] bg-white p-3 text-sm text-[#0F172A] placeholder-[#94A3B8] focus:border-[#94A3B8] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#475569] uppercase tracking-wider mb-1.5">
              Publication Status
            </label>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 text-sm text-[#0F172A] cursor-pointer">
                <input
                  type="radio"
                  name="status"
                  value="active"
                  checked={status === 'active'}
                  onChange={() => setStatus('active')}
                  className="text-[#C8E63C] focus:ring-0"
                />
                Active (Available for plans & quotations)
              </label>
              <label className="flex items-center gap-2 text-sm text-[#64748B] cursor-pointer">
                <input
                  type="radio"
                  name="status"
                  value="archived"
                  checked={status === 'archived'}
                  onChange={() => setStatus('archived')}
                  className="text-[#C8E63C] focus:ring-0"
                />
                Archived (Draft or decommissioned)
              </label>
            </div>
          </div>
        </div>

        {/* Actions Footer */}
        <div className="flex items-center justify-end gap-3 pt-4">
          <Link
            href="/admin/products"
            className="px-5 py-2.5 rounded-xl border border-[#E2E8F0] text-sm font-semibold text-[#334155] hover:bg-slate-50 transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={createMutation.isPending}
            className="inline-flex items-center gap-2 rounded-xl bg-[#C8E63C] px-6 py-2.5 text-sm font-semibold text-[#0F172A] hover:bg-[#B8DC30] transition-all shadow-sm cursor-pointer disabled:opacity-50"
          >
            {createMutation.isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Saving Product...
              </>
            ) : (
              'Save Product & Configure Variants'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
