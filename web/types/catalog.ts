export type ProductType = 'service' | 'goods' | 'addon';
export type ProductStatus = 'active' | 'archived';
export type BillingInterval = 'daily' | 'weekly' | 'monthly' | 'yearly';
export type PlanStatus = 'draft' | 'published' | 'deactivated';

export interface ProductCategory {
  id: string;
  name: string;
  description?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  id: string;
  name: string;
  categoryId?: string | null;
  categoryName?: string | null;
  productType: ProductType;
  salesPrice: number; // in paise (e.g. 200000 = ₹2,000)
  costPrice: number; // in paise (e.g. 80000 = ₹800)
  notes?: string | null;
  status: ProductStatus;
  createdAt: string;
  updatedAt: string;
}

export interface ProductAttributeValue {
  id: string;
  attributeId: string;
  value: string;
  additionalPrice: number; // in paise
  isActive: boolean;
  basePrice?: number;
  totalPrice?: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProductAttribute {
  id: string;
  productId: string;
  name: string;
  values: ProductAttributeValue[];
  createdAt: string;
  updatedAt: string;
}

export interface ProductWithDetails extends Product {
  attributes: ProductAttribute[];
  plans: SubscriptionPlan[];
}

export interface SubscriptionPlan {
  id: string;
  productId: string;
  productName?: string;
  productSalesPrice?: number;
  name: string;
  description?: string | null;
  price: number; // in paise
  billingInterval: BillingInterval;
  billingIntervalCount: number;
  minQuantity: number;
  availableFrom: string;
  availableUntil?: string | null;
  autoClose: boolean;
  earlyClosureAllowed: boolean;
  pauseAllowed: boolean;
  renewalAllowed: boolean;
  status: PlanStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductInput {
  name: string;
  categoryId?: string;
  productType: ProductType;
  salesPrice: number;
  costPrice?: number;
  notes?: string;
  status?: ProductStatus;
}

export interface UpdateProductInput {
  name?: string;
  categoryId?: string | null;
  productType?: ProductType;
  salesPrice?: number;
  costPrice?: number;
  notes?: string | null;
  status?: ProductStatus;
}

export interface CreatePlanInput {
  productId: string;
  name: string;
  description?: string;
  price: number;
  billingInterval: BillingInterval;
  billingIntervalCount?: number;
  minQuantity?: number;
  availableFrom: string;
  availableUntil?: string;
  autoClose?: boolean;
  earlyClosureAllowed?: boolean;
  pauseAllowed?: boolean;
  renewalAllowed?: boolean;
  status?: PlanStatus;
}

export interface UpdatePlanInput {
  productId?: string;
  name?: string;
  description?: string;
  price?: number;
  billingInterval?: BillingInterval;
  billingIntervalCount?: number;
  minQuantity?: number;
  availableFrom?: string;
  availableUntil?: string;
  autoClose?: boolean;
  earlyClosureAllowed?: boolean;
  pauseAllowed?: boolean;
  renewalAllowed?: boolean;
  status?: PlanStatus;
}

