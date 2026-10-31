export type SubscriptionStatus =
  | 'draft'
  | 'quotation'
  | 'confirmed'
  | 'active'
  | 'closed';

export interface CustomerUser {
  id: string;
  name: string;
  email: string;
  isActive: boolean;
  createdAt: string;
}

export interface QuotationTemplateLine {
  id: string;
  templateId: string;
  productId: string;
  productName: string;
  productPrice: number;
  productType: string;
  variantValueId?: string | null;
  variantValue?: string | null;
  variantAdditionalPrice?: number | null;
  defaultQuantity: number;
}

export interface QuotationTemplate {
  id: string;
  name: string;
  description?: string | null;
  defaultPlanId?: string | null;
  defaultPlanName?: string | null;
  defaultPlanPrice?: number | null;
  defaultPlanInterval?: string | null;
  validityDays: number;
  isActive: boolean;
  lineCount?: number;
  lines?: QuotationTemplateLine[];
  createdBy?: string | null;
  creatorName?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateQuotationTemplateLineInput {
  productId: string;
  variantValueId?: string;
  defaultQuantity?: number;
}

export interface CreateQuotationTemplateInput {
  name: string;
  description?: string;
  defaultPlanId?: string;
  validityDays?: number;
  isActive?: boolean;
  lines?: CreateQuotationTemplateLineInput[];
}

export interface UpdateQuotationTemplateInput {
  name?: string;
  description?: string;
  defaultPlanId?: string;
  validityDays?: number;
  isActive?: boolean;
  lines?: CreateQuotationTemplateLineInput[];
}

export interface SubscriptionLine {
  id: string;
  subscriptionId: string;
  productId: string;
  variantValueId?: string | null;
  productName: string;
  variantName?: string | null;
  quantity: number;
  unitPrice: number; // in paise
  taxRate: number; // e.g. 18
  taxAmount: number; // in paise
  lineTotal: number; // in paise
  createdAt: string;
  updatedAt: string;
}

export interface SubscriptionStatusHistoryItem {
  id: string;
  subscriptionId: string;
  previousStatus?: string | null;
  newStatus: string;
  changedBy?: string | null;
  changedByName?: string | null;
  reason?: string | null;
  createdAt: string;
}

export interface Subscription {
  id: string;
  quotationNumber: string;
  subscriptionNumber?: string | null;
  status: SubscriptionStatus;
  subtotal: number; // in paise
  taxTotal: number; // in paise
  totalAmount: number; // in paise
  paymentTerms: string;
  notes?: string | null;
  quotationValidUntil?: string | null;
  startDate?: string | null;
  expiryDate?: string | null;
  confirmedAt?: string | null;
  activatedAt?: string | null;
  closedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  planId: string;
  planName: string;
  planPrice?: number;
  billingInterval: string;
  billingIntervalCount?: number;
  quotationTemplateId?: string | null;
  templateName?: string | null;
  lines?: SubscriptionLine[];
  statusHistory?: SubscriptionStatusHistoryItem[];
}

export interface CreateQuotationLineInput {
  productId: string;
  variantValueId?: string;
  quantity: number;
}

export interface CreateQuotationInput {
  customerId: string;
  planId: string;
  quotationTemplateId?: string;
  paymentTerms?: string;
  notes?: string;
  lines: CreateQuotationLineInput[];
}

export interface UpdateQuotationInput {
  customerId?: string;
  planId?: string;
  quotationTemplateId?: string;
  paymentTerms?: string;
  notes?: string;
  lines?: CreateQuotationLineInput[];
}

