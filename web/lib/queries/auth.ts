import { apiClient } from '../api-client';
import {
  AuthUser,
  LoginResponse,
  RefreshResponse,
  RegisterResponse,
  StaffUser,
} from '../../types/auth';

export async function loginApi(credentials: {
  email: string;
  password: string;
}): Promise<LoginResponse> {
  const { data } = await apiClient.post<LoginResponse>(
    '/auth/login',
    credentials,
  );
  return data;
}

export async function registerApi(payload: {
  name: string;
  email: string;
  password: string;
}): Promise<RegisterResponse> {
  const { data } = await apiClient.post<RegisterResponse>(
    '/auth/register',
    payload,
  );
  return data;
}

export async function refreshApi(): Promise<RefreshResponse> {
  const { data } = await apiClient.post<RefreshResponse>('/auth/refresh');
  return data;
}

export async function logoutApi(): Promise<{ message: string }> {
  const { data } = await apiClient.post<{ message: string }>('/auth/logout');
  return data;
}

export async function logoutAllApi(): Promise<{ message: string }> {
  const { data } = await apiClient.post<{ message: string }>('/auth/logout-all');
  return data;
}

export async function forgotPasswordApi(payload: {
  email: string;
}): Promise<{ message: string }> {
  const { data } = await apiClient.post<{ message: string }>(
    '/auth/forgot-password',
    payload,
  );
  return data;
}

export async function resetPasswordApi(payload: {
  token: string;
  newPassword: string;
}): Promise<{ message: string }> {
  const { data } = await apiClient.post<{ message: string }>(
    '/auth/reset-password',
    payload,
  );
  return data;
}

export async function changePasswordApi(payload: {
  currentPassword: string;
  newPassword: string;
}): Promise<{ message: string }> {
  const { data } = await apiClient.post<{ message: string }>(
    '/auth/change-password',
    payload,
  );
  return data;
}

export async function getMeApi(): Promise<AuthUser> {
  const { data } = await apiClient.get<AuthUser>('/auth/me');
  return data;
}

// Staff management APIs (Admin only)
export async function createStaffApi(payload: {
  name: string;
  email: string;
  password: string;
}): Promise<{ message: string; staff: StaffUser }> {
  const { data } = await apiClient.post<{
    message: string;
    staff: StaffUser;
  }>('/staff', payload);
  return data;
}

export async function getAllStaffApi(): Promise<StaffUser[]> {
  const { data } = await apiClient.get<StaffUser[]>('/staff');
  return data;
}

export async function updateStaffStatusApi(
  id: string,
  isActive: boolean,
): Promise<{ message: string; staff: Partial<StaffUser> }> {
  const { data } = await apiClient.patch<{
    message: string;
    staff: Partial<StaffUser>;
  }>(`/staff/${id}/status`, { isActive });
  return data;
}
