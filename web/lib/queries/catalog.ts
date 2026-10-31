import { apiClient } from '../api-client';
import {
  Product,
  ProductCategory,
  ProductWithDetails,
  SubscriptionPlan,
  CreateProductInput,
  UpdateProductInput,
  CreatePlanInput,
  UpdatePlanInput,
} from '../../types/catalog';

// Helper to format paise to rupees string
export function formatINR(paise: number): string {
  const rupees = paise / 100;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(rupees);
}

// ================= Categories API =================
export async function getCategoriesApi(): Promise<ProductCategory[]> {
  const { data } = await apiClient.get<ProductCategory[]>('/categories');
  return data;
}

export async function createCategoryApi(payload: {
  name: string;
  description?: string;
}): Promise<ProductCategory> {
  const { data } = await apiClient.post<ProductCategory>(
    '/categories',
    payload,
  );
  return data;
}

export async function updateCategoryApi(
  id: string,
  payload: { name?: string; description?: string },
): Promise<ProductCategory> {
  const { data } = await apiClient.patch<ProductCategory>(
    `/categories/${id}`,
    payload,
  );
  return data;
}

export async function deleteCategoryApi(
  id: string,
): Promise<{ message: string }> {
  const { data } = await apiClient.delete<{ message: string }>(
    `/categories/${id}`,
  );
  return data;
}

// ================= Products API =================
export async function getProductsApi(params?: {
  search?: string;
  type?: string;
  status?: string;
  categoryId?: string;
}): Promise<Product[]> {
  const { data } = await apiClient.get<Product[]>('/products', { params });
  return data;
}

export async function getProductByIdApi(id: string): Promise<ProductWithDetails> {
  const { data } = await apiClient.get<ProductWithDetails>(`/products/${id}`);
  return data;
}

export async function createProductApi(
  payload: CreateProductInput,
): Promise<Product> {
  const { data } = await apiClient.post<Product>('/products', payload);
  return data;
}

export async function updateProductApi(
  id: string,
  payload: UpdateProductInput,
): Promise<Product> {
  const { data } = await apiClient.patch<Product>(`/products/${id}`, payload);
  return data;
}

export async function archiveProductApi(
  id: string,
  status?: 'active' | 'archived',
): Promise<{ message: string; product: Product }> {
  const { data } = await apiClient.patch<{ message: string; product: Product }>(
    `/products/${id}/archive`,
    { status },
  );
  return data;
}

// ================= Variants API =================
export async function createAttributeApi(
  productId: string,
  payload: { name: string },
): Promise<{ id: string; name: string; productId: string }> {
  const { data } = await apiClient.post<{
    id: string;
    name: string;
    productId: string;
  }>(`/products/${productId}/attributes`, payload);
  return data;
}

export async function createAttributeValueApi(
  attributeId: string,
  payload: { value: string; additionalPrice?: number; isActive?: boolean },
): Promise<{ id: string; value: string; additionalPrice: number; isActive: boolean }> {
  const { data } = await apiClient.post<{
    id: string;
    value: string;
    additionalPrice: number;
    isActive: boolean;
  }>(`/attributes/${attributeId}/values`, payload);
  return data;
}

export async function getProductVariantsApi(productId: string) {
  const { data } = await apiClient.get<{
    productId: string;
    productName: string;
    baseSalesPrice: number;
    attributes: any[];
  }>(`/products/${productId}/variants`);
  return data;
}

export async function updateAttributeValueApi(
  valueId: string,
  payload: { value?: string; additionalPrice?: number; isActive?: boolean },
) {
  const { data } = await apiClient.patch(
    `/variant-values/${valueId}`,
    payload,
  );
  return data;
}

export async function deleteAttributeApi(attributeId: string) {
  const { data } = await apiClient.delete(`/attributes/${attributeId}`);
  return data;
}

export async function deleteAttributeValueApi(valueId: string) {
  const { data } = await apiClient.delete(`/variant-values/${valueId}`);
  return data;
}

// ================= Subscription Plans API =================
export async function getPlansApi(params?: {
  search?: string;
  productId?: string;
  interval?: string;
  status?: string;
}): Promise<SubscriptionPlan[]> {
  const { data } = await apiClient.get<SubscriptionPlan[]>('/plans', {
    params,
  });
  return data;
}

export async function getPlanByIdApi(id: string): Promise<SubscriptionPlan> {
  const { data } = await apiClient.get<SubscriptionPlan>(`/plans/${id}`);
  return data;
}

export async function createPlanApi(
  payload: CreatePlanInput,
): Promise<SubscriptionPlan> {
  const { data } = await apiClient.post<SubscriptionPlan>('/plans', payload);
  return data;
}

export async function updatePlanApi(
  id: string,
  payload: UpdatePlanInput,
): Promise<SubscriptionPlan> {
  const { data } = await apiClient.patch<SubscriptionPlan>(
    `/plans/${id}`,
    payload,
  );
  return data;
}

export async function publishPlanApi(
  id: string,
): Promise<{ message: string; plan: SubscriptionPlan }> {
  const { data } = await apiClient.patch<{
    message: string;
    plan: SubscriptionPlan;
  }>(`/plans/${id}/publish`);
  return data;
}

export async function deactivatePlanApi(
  id: string,
): Promise<{ message: string; plan: SubscriptionPlan }> {
  const { data } = await apiClient.patch<{
    message: string;
    plan: SubscriptionPlan;
  }>(`/plans/${id}/deactivate`);
  return data;
}

