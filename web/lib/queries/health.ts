import { apiClient } from '../api-client';

export interface HealthResponse {
  status: string;
  service: string;
  database: string;
  timestamp: string;
}

/**
 * Fetch the backend health check status.
 * Used by TanStack Query in the ApiStatus component.
 */
export async function fetchHealth(): Promise<HealthResponse> {
  const response = await apiClient.get<HealthResponse>('/health');
  return response.data;
}
