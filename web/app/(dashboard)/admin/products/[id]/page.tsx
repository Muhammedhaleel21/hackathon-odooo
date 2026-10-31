'use client';

import React, { useState, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getProductByIdApi,
  updateProductApi,
  archiveProductApi,
  getCategoriesApi,
  createAttributeApi,
  createAttributeValueApi,
  updateAttributeValueApi,
  deleteAttributeApi,
  deleteAttributeValueApi,
  formatINR,
} from '../../../../../lib/queries/catalog';
import { useAuth } from '../../../../../hooks/use-auth';
import {
  ProductType,
  ProductStatus,
  ProductWithDetails,
  ProductCategory,
  ProductAttribute,
  ProductAttributeValue,
  SubscriptionPlan,
} from '../../../../../types/catalog';
import {
  ArrowLeft,
  Package,
  Layers,
  Plus,
  Trash2,
  CheckCircle2,
  Archive,
  Loader2,
  TrendingUp,
  Tag,
  Calculator,
  AlertCircle,
  Edit2,
} from 'lucide-react';

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const productId = resolvedParams.id;
  const router = useRouter();
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const queryClient = useQueryClient();

  // Active section tab
  const [activeTab, setActiveTab] = useState<'details' | 'variants' | 'plans'>('details');

  // Edit form state
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [productType, setProductType] = useState<ProductType>('service');
  const [salesPriceRupees, setSalesPriceRupees] = useState<number>(0);
  const [costPriceRupees, setCostPriceRupees] = useState<number>(0);
  const [notes, setNotes] = useState('');
  const [status, setStatus] = useState<ProductStatus>('active');
  const [formMessage, setFormMessage] = useState<string | null>(null);

  // Variant addition form state
  const [newAttributeName, setNewAttributeName] = useState('');
  const [isAddingAttribute, setIsAddingAttribute] = useState(false);
  const [newOptionAttrId, setNewOptionAttrId] = useState<string | null>(null);
  const [newOptionValue, setNewOptionValue] = useState('');
  const [newOptionAdditionalRupees, setNewOptionAdditionalRupees] = useState<number>(0);

  // Live Price Calculator selected options state
  const [calculatorSelectedOption, setCalculatorSelectedOption] = useState<{
    [attributeId: string]: string; // optionValueId
  }>({});

  // Fetch product
  const {
    data: product,
    isLoading,
    error,
  } = useQuery<ProductWithDetails>({
    queryKey: ['product', productId],
    queryFn: () => getProductByIdApi(productId),
  });

  // Fetch categories
  const { data: categories } = useQuery<ProductCategory[]>({
    queryKey: ['categories'],
    queryFn: getCategoriesApi,
  });

  // Sync state when product loads
  React.useEffect(() => {
    if (product) {
      setName(product.name);
      setCategoryId(product.categoryId || '');
      setProductType(product.productType);
      setSalesPriceRupees(product.salesPrice / 100);
      setCostPriceRupees(product.costPrice / 100);
      setNotes(product.notes || '');
      setStatus(product.status);
    }
  }, [product]);

  // Update Product mutation
  const updateProductMutation = useMutation({
    mutationFn: (payload: any) => updateProductApi(productId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['product', productId] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
      setIsEditing(false);
      setFormMessage('Product updated successfully!');
      setTimeout(() => setFormMessage(null), 3000);
    },
  });

  // Archive mutation
  const archiveMutation = useMutation({
    mutationFn: (newStatus: 'active' | 'archived') =>
      archiveProductApi(productId, newStatus),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['product', productId] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });

  // Create Attribute mutation
  const createAttributeMutation = useMutation({
    mutationFn: (attrName: string) =>
      createAttributeApi(productId, { name: attrName }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['product', productId] });
      setIsAddingAttribute(false);
      setNewAttributeName('');
    },
  });

  // Create Attribute Value mutation
  const createOptionMutation = useMutation({
    mutationFn: ({
      attributeId,
      value,
      additionalPrice,
    }: {
      attributeId: string;
      value: string;
      additionalPrice: number;
    }) =>
      createAttributeValueApi(attributeId, {
        value,
        additionalPrice,
        isActive: true,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['product', productId] });
      setNewOptionAttrId(null);
      setNewOptionValue('');
      setNewOptionAdditionalRupees(0);
    },
  });

  // Toggle Option status mutation
  const toggleOptionMutation = useMutation({
    mutationFn: ({
      valueId,
      isActive,
    }: {
      valueId: string;
      isActive: boolean;
    }) => updateAttributeValueApi(valueId, { isActive }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['product', productId] });
    },
  });

  // Delete Attribute mutation
  const deleteAttributeMutation = useMutation({
    mutationFn: (attributeId: string) => deleteAttributeApi(attributeId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['product', productId] });
    },
  });

  // Delete Option mutation
  const deleteOptionMutation = useMutation({
    mutationFn: (valueId: string) => deleteAttributeValueApi(valueId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['product', productId] });
    },
  });

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-[#64748B]">
        <Loader2 className="w-8 h-8 animate-spin text-[#C8E63C] mb-2 stroke-[2.5]" />
        <p className="text-sm font-medium">Loading product details...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="p-8 text-center text-red-500 max-w-md mx-auto">
        <AlertCircle className="w-10 h-10 mx-auto mb-2 text-red-500" />
        <h3 className="font-bold text-lg">Product Not Found</h3>
        <p className="text-xs text-red-400 mt-1">
          {error ? (error as Error).message : 'Unable to locate this product.'}
        </p>
        <Link
          href="/admin/products"
          className="inline-block mt-4 text-xs font-semibold text-blue-600 hover:underline"
        >
          ← Return to Products
        </Link>
      </div>
    );
  }

  const handleSaveDetails = (e: React.FormEvent) => {
    e.preventDefault();
    updateProductMutation.mutate({
      name: name.trim(),
      categoryId: categoryId || null,
      productType,
      salesPrice: Math.round(salesPriceRupees * 100),
      costPrice: Math.round(costPriceRupees * 100),
      notes: notes.trim() || null,
      status,
    });
  };

  // Compute live preview price based on selected variant option
  const totalAdditionalPaise = Object.values(calculatorSelectedOption).reduce(
    (acc: number, optionId: string) => {
      for (const attr of product.attributes || []) {
        const found = attr.values?.find((v: ProductAttributeValue) => v.id === optionId);
        if (found) {
          return acc + found.additionalPrice;
        }
      }
      return acc;
    },
    0,
  );

  const calculatedFinalPricePaise = product.salesPrice + totalAdditionalPaise;

  return (
    <div className="space-y-6">
      {/* Top Breadcrumb & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/products"
            className="inline-flex items-center gap-1.5 rounded-xl border border-[#E2E8F0] bg-white px-3 py-1.5 text-xs font-semibold text-[#334155] hover:bg-slate-50 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Products
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-[#0F172A]">{product.name}</h1>
              {product.status === 'active' ? (
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  <CheckCircle2 className="w-3 h-3" />
                  Active
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[#94A3B8] bg-slate-100 px-2.5 py-0.5 rounded-full">
                  <Archive className="w-3 h-3" />
                  Archived
                </span>
              )}
            </div>
            {product.categoryName && (
              <span className="text-xs text-[#94A3B8]">
                Category: {product.categoryName}
              </span>
            )}
          </div>
        </div>

        {isAdmin && (
          <div className="flex items-center gap-2">
            <button
              onClick={() =>
                archiveMutation.mutate(
                  product.status === 'active' ? 'archived' : 'active',
                )
              }
              disabled={archiveMutation.isPending}
              className="inline-flex items-center gap-1.5 rounded-xl border border-[#E2E8F0] bg-white px-3.5 py-2 text-xs font-semibold text-[#334155] hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <Archive className="w-3.5 h-3.5" />
              {product.status === 'active' ? 'Archive Product' : 'Activate Product'}
            </button>

            <button
              onClick={() => setIsEditing(!isEditing)}
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#C8E63C] px-4 py-2 text-xs font-semibold text-[#0F172A] hover:bg-[#B8DC30] transition-colors cursor-pointer"
            >
              <Edit2 className="w-3.5 h-3.5" />
              {isEditing ? 'Cancel Edit' : 'Edit Product'}
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

      {/* Secondary Sub-navigation Tabs */}
      <div className="inline-flex items-center gap-1 rounded-xl bg-[#F1F5F9] p-1">
        <button
          onClick={() => setActiveTab('details')}
          className={`flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-semibold transition-all cursor-pointer ${activeTab === 'details'
              ? 'bg-white text-[#0F172A] shadow-sm'
              : 'text-[#64748B] hover:text-[#0F172A]'
            }`}
        >
          <Package className="w-3.5 h-3.5" />
          Product Details
        </button>

        <button
          onClick={() => setActiveTab('variants')}
          className={`flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-semibold transition-all cursor-pointer ${activeTab === 'variants'
              ? 'bg-white text-[#0F172A] shadow-sm'
              : 'text-[#64748B] hover:text-[#0F172A]'
            }`}
        >
          <Tag className="w-3.5 h-3.5" />
          Variants & Options ({product.attributes?.length || 0})
        </button>

        <button
          onClick={() => setActiveTab('plans')}
          className={`flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-semibold transition-all cursor-pointer ${activeTab === 'plans'
              ? 'bg-white text-[#0F172A] shadow-sm'
              : 'text-[#64748B] hover:text-[#0F172A]'
            }`}
        >
          <Layers className="w-3.5 h-3.5" />
          Subscription Plans ({product.plans?.length || 0})
        </button>
      </div>

      {/* TAB 1: PRODUCT DETAILS & EDITING */}
      {activeTab === 'details' && (
        <div className="space-y-6">
          {isEditing ? (
            <form onSubmit={handleSaveDetails} className="space-y-6">
              <div className="rounded-2xl border border-[#F1F5F9] bg-white p-6 shadow-sm space-y-4">
                <h3 className="text-base font-bold text-[#0F172A]">Edit Product Specifications</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold text-[#475569] uppercase tracking-wider mb-1">
                      Product Name
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="h-11 w-full rounded-xl border border-[#E2E8F0] px-4 text-sm focus:outline-none focus:border-[#94A3B8]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#475569] uppercase tracking-wider mb-1">
                      Category
                    </label>
                    <select
                      value={categoryId}
                      onChange={(e) => setCategoryId(e.target.value)}
                      className="h-11 w-full rounded-xl border border-[#E2E8F0] px-3 text-sm focus:outline-none"
                    >
                      <option value="">None / Unassigned</option>
                      {categories?.map((cat: ProductCategory) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#475569] uppercase tracking-wider mb-1">
                      Product Type
                    </label>
                    <select
                      value={productType}
                      onChange={(e) => setProductType(e.target.value as ProductType)}
                      className="h-11 w-full rounded-xl border border-[#E2E8F0] px-3 text-sm focus:outline-none"
                    >
                      <option value="service">Service</option>
                      <option value="goods">Goods</option>
                      <option value="addon">Add-on</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#475569] uppercase tracking-wider mb-1">
                      Sales Price (₹ INR)
                    </label>
                    <input
                      type="number"
                      min="0"
                      required
                      value={salesPriceRupees}
                      onChange={(e) => setSalesPriceRupees(Number(e.target.value))}
                      className="h-11 w-full rounded-xl border border-[#E2E8F0] px-4 text-sm font-semibold focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#475569] uppercase tracking-wider mb-1">
                      Cost Price (₹ INR)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={costPriceRupees}
                      onChange={(e) => setCostPriceRupees(Number(e.target.value))}
                      className="h-11 w-full rounded-xl border border-[#E2E8F0] px-4 text-sm font-semibold focus:outline-none"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold text-[#475569] uppercase tracking-wider mb-1">
                      Notes
                    </label>
                    <textarea
                      rows={3}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="w-full rounded-xl border border-[#E2E8F0] p-3 text-sm focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-[#F1F5F9]">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-[#64748B] hover:text-[#0F172A]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={updateProductMutation.isPending}
                    className="px-5 py-2 rounded-xl bg-[#C8E63C] text-[#0F172A] font-semibold text-xs hover:bg-[#B8DC30] disabled:opacity-50"
                  >
                    {updateProductMutation.isPending ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </div>
            </form>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Product Info Card */}
              <div className="md:col-span-2 rounded-2xl border border-[#F1F5F9] bg-white p-6 shadow-sm space-y-6">
                <div>
                  <div className="text-xs font-semibold text-[#94A3B8] uppercase tracking-wider">
                    Overview
                  </div>
                  <h3 className="text-lg font-bold text-[#0F172A] mt-1">{product.name}</h3>
                  <p className="text-sm text-[#475569] mt-2 leading-relaxed">
                    {product.notes || 'No description provided for this product.'}
                  </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 border-t border-[#F1F5F9]">
                  <div>
                    <div className="text-xs text-[#94A3B8] font-medium">Category</div>
                    <div className="text-sm font-semibold text-[#0F172A] mt-0.5">
                      {product.categoryName || 'None'}
                    </div>
                  </div>

                  <div>
                    <div className="text-xs text-[#94A3B8] font-medium">Product Type</div>
                    <div className="text-sm font-semibold text-[#0F172A] capitalize mt-0.5">
                      {product.productType}
                    </div>
                  </div>

                  <div>
                    <div className="text-xs text-[#94A3B8] font-medium">Status</div>
                    <div className="text-sm font-semibold text-[#0F172A] capitalize mt-0.5">
                      {product.status}
                    </div>
                  </div>
                </div>
              </div>

              {/* Price & Margin Card */}
              <div className="rounded-2xl border border-[#F1F5F9] bg-white p-6 shadow-sm space-y-4">
                <div className="text-xs font-semibold text-[#94A3B8] uppercase tracking-wider">
                  Financials
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-[#F1F5F9]">
                    <span className="text-xs text-[#64748B]">Base Sales Price</span>
                    <span className="text-base font-bold text-[#0F172A]">
                      {formatINR(product.salesPrice)}
                    </span>
                  </div>

                  <div className="flex justify-between items-center py-2 border-b border-[#F1F5F9]">
                    <span className="text-xs text-[#64748B]">Internal Cost Price</span>
                    <span className="text-sm font-medium text-[#475569]">
                      {formatINR(product.costPrice)}
                    </span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                    <div className="text-xs text-[#64748B]">Gross Margin</div>
                    <div className="text-base font-bold text-emerald-600 mt-0.5">
                      {formatINR(product.salesPrice - product.costPrice)} (
                      {product.salesPrice > 0
                        ? Math.round(
                          ((product.salesPrice - product.costPrice) /
                            product.salesPrice) *
                          100,
                        )
                        : 0}
                      %)
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: VARIANTS & ADDITIONAL PRICING (MODULE B) */}
      {activeTab === 'variants' && (
        <div className="space-y-6">
          {/* Header & Add Attribute Button */}
          <div className="rounded-2xl border border-[#F1F5F9] bg-white p-6 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-bold text-[#0F172A]">
                  Product Variant Attributes & Additional Pricing
                </h3>
                <p className="text-xs text-[#64748B] mt-1 max-w-xl">
                  Configure attributes such as <strong>Brand</strong> (e.g., Standard, Odoo, Premium) or Edition. Each option can add an additional surcharge to the base price of {formatINR(product.salesPrice)}.
                </p>
              </div>

              {isAdmin && (
                <button
                  onClick={() => setIsAddingAttribute(!isAddingAttribute)}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-[#C8E63C] px-4 py-2 text-xs font-semibold text-[#0F172A] hover:bg-[#B8DC30] transition-colors shrink-0 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                  Add Attribute
                </button>
              )}
            </div>

            {/* Add Attribute Form */}
            {isAddingAttribute && (
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 mt-4 space-y-3">
                <div className="text-xs font-bold text-[#0F172A]">
                  Create New Variant Attribute
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    value={newAttributeName}
                    onChange={(e) => setNewAttributeName(e.target.value)}
                    placeholder="e.g. Brand, Edition, Cloud Region"
                    className="h-10 flex-1 rounded-xl border border-[#E2E8F0] bg-white px-3 text-xs focus:outline-none focus:border-[#94A3B8]"
                  />
                  <button
                    onClick={() => {
                      if (newAttributeName.trim()) {
                        createAttributeMutation.mutate(newAttributeName.trim());
                      }
                    }}
                    disabled={!newAttributeName.trim() || createAttributeMutation.isPending}
                    className="h-10 px-4 rounded-xl bg-[#0F172A] text-white text-xs font-semibold hover:bg-slate-800 disabled:opacity-50 cursor-pointer"
                  >
                    Create Attribute
                  </button>
                  <button
                    onClick={() => setIsAddingAttribute(false)}
                    className="h-10 px-3 text-xs text-[#64748B] hover:text-[#0F172A]"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* List Attributes & Options */}
          {product.attributes && product.attributes.length > 0 ? (
            <div className="space-y-6">
              {product.attributes.map((attr: ProductAttribute) => (
                <div
                  key={attr.id}
                  className="rounded-2xl border border-[#F1F5F9] bg-white p-6 shadow-sm space-y-4"
                >
                  <div className="flex items-center justify-between pb-3 border-b border-[#F1F5F9]">
                    <div className="flex items-center gap-2">
                      <Tag className="w-4 h-4 text-[#64748B]" />
                      <h4 className="text-sm font-bold text-[#0F172A]">
                        Attribute: {attr.name}
                      </h4>
                      <span className="text-xs text-[#94A3B8] font-normal">
                        ({attr.values?.length || 0} options)
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {isAdmin && (
                        <>
                          <button
                            onClick={() =>
                              setNewOptionAttrId(
                                newOptionAttrId === attr.id ? null : attr.id,
                              )
                            }
                            className="text-xs font-semibold text-blue-600 hover:underline px-2 py-1"
                          >
                            + Add Option
                          </button>
                          <button
                            onClick={() => deleteAttributeMutation.mutate(attr.id)}
                            className="text-xs text-[#94A3B8] hover:text-red-600 p-1 rounded"
                            title="Delete Attribute"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Add Option Sub-form */}
                  {newOptionAttrId === attr.id && (
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-[#475569] uppercase mb-1">
                          Option Value (e.g. Odoo)
                        </label>
                        <input
                          type="text"
                          value={newOptionValue}
                          onChange={(e) => setNewOptionValue(e.target.value)}
                          placeholder="e.g. Standard, Odoo, Premium"
                          className="h-9 w-full rounded-lg border border-[#E2E8F0] bg-white px-3 text-xs focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-[#475569] uppercase mb-1">
                          Additional Price (₹ INR)
                        </label>
                        <input
                          type="number"
                          min="0"
                          value={newOptionAdditionalRupees}
                          onChange={(e) =>
                            setNewOptionAdditionalRupees(Number(e.target.value))
                          }
                          placeholder="e.g. 560"
                          className="h-9 w-full rounded-lg border border-[#E2E8F0] bg-white px-3 text-xs focus:outline-none"
                        />
                      </div>

                      <div className="flex items-end gap-2">
                        <button
                          onClick={() => {
                            if (newOptionValue.trim()) {
                              createOptionMutation.mutate({
                                attributeId: attr.id,
                                value: newOptionValue.trim(),
                                additionalPrice: Math.round(
                                  newOptionAdditionalRupees * 100,
                                ),
                              });
                            }
                          }}
                          disabled={
                            !newOptionValue.trim() ||
                            createOptionMutation.isPending
                          }
                          className="h-9 px-4 rounded-lg bg-[#0F172A] text-white text-xs font-semibold hover:bg-slate-800 disabled:opacity-50"
                        >
                          Add Option
                        </button>
                        <button
                          onClick={() => setNewOptionAttrId(null)}
                          className="h-9 px-2 text-xs text-[#64748B]"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Options Table */}
                  {attr.values && attr.values.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="border-b border-[#F1F5F9] text-[10px] font-semibold uppercase text-[#94A3B8]">
                            <th className="py-2.5 px-3">Option Value</th>
                            <th className="py-2.5 px-3">Additional Price</th>
                            <th className="py-2.5 px-3">Resulting Final Price</th>
                            <th className="py-2.5 px-3">Status</th>
                            <th className="py-2.5 px-3 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#F8FAFC]">
                          {attr.values.map((val: ProductAttributeValue) => {
                            const resultingPricePaise =
                              product.salesPrice + val.additionalPrice;
                            return (
                              <tr key={val.id} className="hover:bg-slate-50/60">
                                <td className="py-3 px-3 font-semibold text-[#0F172A]">
                                  {val.value}
                                </td>
                                <td className="py-3 px-3 text-[#475569]">
                                  {val.additionalPrice > 0
                                    ? `+${formatINR(val.additionalPrice)}`
                                    : '₹0 (Included)'}
                                </td>
                                <td className="py-3 px-3 font-bold text-[#0F172A]">
                                  {formatINR(resultingPricePaise)}
                                </td>
                                <td className="py-3 px-3">
                                  {val.isActive ? (
                                    <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                                      Active
                                    </span>
                                  ) : (
                                    <span className="text-[11px] font-medium text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                                      Inactive
                                    </span>
                                  )}
                                </td>
                                <td className="py-3 px-3 text-right">
                                  {isAdmin && (
                                    <div className="flex items-center justify-end gap-2">
                                      <button
                                        onClick={() =>
                                          toggleOptionMutation.mutate({
                                            valueId: val.id,
                                            isActive: !val.isActive,
                                          })
                                        }
                                        className="text-[11px] text-blue-600 hover:underline"
                                      >
                                        {val.isActive ? 'Deactivate' : 'Activate'}
                                      </button>
                                      <button
                                        onClick={() =>
                                          deleteOptionMutation.mutate(val.id)
                                        }
                                        className="text-[#94A3B8] hover:text-red-500"
                                      >
                                        <Trash2 className="w-3.5 h-3.5" />
                                      </button>
                                    </div>
                                  )}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center py-6 text-xs text-[#94A3B8]">
                      No options defined under this attribute yet. Click &quot;+ Add Option&quot; above.
                    </div>
                  )}
                </div>
              ))}

              {/* LIVE RESULTING PRICE CALCULATOR (Problem Statement Specification) */}
              <div className="rounded-2xl border-2 border-[#C8E63C] bg-white p-6 shadow-sm space-y-4">
                <div className="flex items-center gap-2 pb-3 border-b border-[#F1F5F9]">
                  <Calculator className="w-5 h-5 text-[#0F172A]" />
                  <h3 className="text-base font-bold text-[#0F172A]">
                    Live Pricing Preview & Quotation Calculator
                  </h3>
                </div>
                <p className="text-xs text-[#64748B]">
                  Simulate what a customer pays when configuring this product with available variants.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-2">
                  {product.attributes.map((attr: ProductAttribute) => (
                    <div key={attr.id}>
                      <label className="block text-xs font-semibold text-[#475569] uppercase mb-1.5">
                        Select {attr.name}:
                      </label>
                      <select
                        value={calculatorSelectedOption[attr.id] || ''}
                        onChange={(e) =>
                          setCalculatorSelectedOption({
                            ...calculatorSelectedOption,
                            [attr.id]: e.target.value,
                          })
                        }
                        className="h-10 w-full rounded-xl border border-[#E2E8F0] px-3 text-xs font-medium focus:outline-none"
                      >
                        <option value="">Base (No Option)</option>
                        {attr.values?.map((v: ProductAttributeValue) => (
                          <option key={v.id} value={v.id}>
                            {v.value} (+{formatINR(v.additionalPrice)})
                          </option>
                        ))}
                      </select>
                    </div>
                  ))}
                </div>

                {/* Calculation Breakdown Banner */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-4">
                  <div className="space-y-1">
                    <div className="text-xs text-[#64748B]">Formula:</div>
                    <div className="text-xs font-mono font-semibold text-[#0F172A]">
                      Base Price ({formatINR(product.salesPrice)}) + Additional (
                      {formatINR(totalAdditionalPaise)})
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-xs text-[#64748B] font-medium">Customer Quotation Total:</div>
                    <div className="text-2xl font-black text-[#0F172A]">
                      {formatINR(calculatedFinalPricePaise)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-[#CBD5E1] p-12 text-center bg-white">
              <Tag className="w-10 h-10 text-[#94A3B8] mx-auto mb-2" />
              <h4 className="font-bold text-sm text-[#0F172A]">No Variant Attributes Configured</h4>
              <p className="text-xs text-[#64748B] mt-1 max-w-sm mx-auto">
                Add attributes like &quot;Brand&quot; to allow customer customizations with price additions (e.g. +₹560 for Odoo).
              </p>
              {isAdmin && (
                <button
                  onClick={() => setIsAddingAttribute(true)}
                  className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-[#C8E63C] px-4 py-2 text-xs font-semibold text-[#0F172A] hover:bg-[#B8DC30]"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Configure First Attribute
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: SUBSCRIPTION PLANS LINKED TO PRODUCT */}
      {activeTab === 'plans' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-[#0F172A]">
                Subscription Plans for {product.name}
              </h3>
              <p className="text-xs text-[#64748B] mt-0.5">
                Plans determine billing cycles, recurrence intervals, and subscriber rules.
              </p>
            </div>

            {isAdmin && (
              <Link
                href={`/admin/plans/new?productId=${product.id}`}
                className="inline-flex items-center gap-1.5 rounded-xl bg-[#C8E63C] px-4 py-2 text-xs font-semibold text-[#0F172A] hover:bg-[#B8DC30] transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Plan for this Product
              </Link>
            )}
          </div>

          {product.plans && product.plans.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {product.plans.map((plan: SubscriptionPlan) => (
                <div
                  key={plan.id}
                  className="rounded-2xl border border-[#F1F5F9] bg-white p-5 shadow-sm space-y-4 hover:border-slate-300 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-bold text-sm text-[#0F172A]">{plan.name}</h4>
                      <p className="text-xs text-[#64748B] mt-1 line-clamp-2">
                        {plan.description || 'No description provided.'}
                      </p>
                    </div>
                    {plan.status === 'published' ? (
                      <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                        Published
                      </span>
                    ) : (
                      <span className="text-[11px] font-medium text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full capitalize">
                        {plan.status}
                      </span>
                    )}
                  </div>

                  <div className="flex items-baseline justify-between pt-2 border-t border-[#F1F5F9]">
                    <div className="text-lg font-black text-[#0F172A]">
                      {formatINR(plan.price)}{' '}
                      <span className="text-xs font-normal text-[#64748B]">
                        / {plan.billingIntervalCount > 1 ? `${plan.billingIntervalCount} ` : ''}
                        {plan.billingInterval}
                      </span>
                    </div>

                    <Link
                      href={`/admin/plans/${plan.id}`}
                      className="text-xs font-semibold text-blue-600 hover:underline"
                    >
                      View & Manage →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-[#CBD5E1] p-12 text-center bg-white">
              <Layers className="w-10 h-10 text-[#94A3B8] mx-auto mb-2" />
              <h4 className="font-bold text-sm text-[#0F172A]">No Subscription Plans</h4>
              <p className="text-xs text-[#64748B] mt-1 max-w-sm mx-auto">
                Customers cannot subscribe until you create and publish a billing plan for this product.
              </p>
              {isAdmin && (
                <Link
                  href={`/admin/plans/new?productId=${product.id}`}
                  className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-[#C8E63C] px-4 py-2 text-xs font-semibold text-[#0F172A] hover:bg-[#B8DC30]"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Create First Plan
                </Link>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}