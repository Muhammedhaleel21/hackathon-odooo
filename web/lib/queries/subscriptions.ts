import { apiClient } from '../api-client';
import {
  CustomerUser,
  QuotationTemplate,
  CreateQuotationTemplateInput,
  UpdateQuotationTemplateInput,
  Subscription,
  CreateQuotationInput,
  UpdateQuotationInput,
  SubscriptionStatusHistoryItem,
} from '../../types/subscriptions';

// Customers
export async function getCustomersApi(): Promise<CustomerUser[]> {
  const { data } = await apiClient.get<CustomerUser[]>('/users/customers');
  return data;
}

// Quotation Templates
export async function getQuotationTemplatesApi(): Promise<QuotationTemplate[]> {
  const { data } =
    await apiClient.get<QuotationTemplate[]>('/quotation-templates');
  return data;
}

export async function getQuotationTemplateApi(
  id: string,
): Promise<QuotationTemplate> {
  const { data } = await apiClient.get<QuotationTemplate>(
    `/quotation-templates/${id}`,
  );
  return data;
}

export async function createQuotationTemplateApi(
  payload: CreateQuotationTemplateInput,
): Promise<QuotationTemplate> {
  const { data } = await apiClient.post<QuotationTemplate>(
    '/quotation-templates',
    payload,
  );
  return data;
}

export async function updateQuotationTemplateApi(
  id: string,
  payload: UpdateQuotationTemplateInput,
): Promise<QuotationTemplate> {
  const { data } = await apiClient.patch<QuotationTemplate>(
    `/quotation-templates/${id}`,
    payload,
  );
  return data;
}

export async function toggleQuotationTemplateStatusApi(
  id: string,
): Promise<QuotationTemplate> {
  const { data } = await apiClient.patch<QuotationTemplate>(
    `/quotation-templates/${id}/toggle-status`,
  );
  return data;
}

export async function duplicateQuotationTemplateApi(
  id: string,
): Promise<QuotationTemplate> {
  const { data } = await apiClient.post<QuotationTemplate>(
    `/quotation-templates/${id}/duplicate`,
  );
  return data;
}

// Subscriptions & Quotations
export async function getSubscriptionsApi(params?: {
  status?: string;
  search?: string;
}): Promise<Subscription[]> {
  const { data } = await apiClient.get<Subscription[]>('/subscriptions', {
    params,
  });
  return data;
}

export async function getSubscriptionApi(id: string): Promise<Subscription> {
  const { data } = await apiClient.get<Subscription>(`/subscriptions/${id}`);
  return data;
}

export async function createQuotationApi(
  payload: CreateQuotationInput,
): Promise<Subscription> {
  const { data } = await apiClient.post<Subscription>(
    '/subscriptions',
    payload,
  );
  return data;
}

export async function updateQuotationDraftApi(
  id: string,
  payload: UpdateQuotationInput,
): Promise<Subscription> {
  const { data } = await apiClient.patch<Subscription>(
    `/subscriptions/${id}`,
    payload,
  );
  return data;
}

export async function issueQuotationApi(id: string): Promise<Subscription> {
  const { data } = await apiClient.post<Subscription>(
    `/subscriptions/${id}/issue`,
  );
  return data;
}

export async function confirmQuotationApi(id: string): Promise<Subscription> {
  const { data } = await apiClient.post<Subscription>(
    `/subscriptions/${id}/confirm`,
  );
  return data;
}

export async function activateSubscriptionApi(
  id: string,
): Promise<Subscription> {
  const { data } = await apiClient.post<Subscription>(
    `/subscriptions/${id}/activate`,
  );
  return data;
}

export async function closeSubscriptionApi(
  id: string,
  reason?: string,
): Promise<Subscription> {
  const { data } = await apiClient.post<Subscription>(
    `/subscriptions/${id}/close`,
    { reason },
  );
  return data;
}

export async function getSubscriptionHistoryApi(
  id: string,
): Promise<SubscriptionStatusHistoryItem[]> {
  const { data } = await apiClient.get<SubscriptionStatusHistoryItem[]>(
    `/subscriptions/${id}/history`,
  );
  return data;
}

