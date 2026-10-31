import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';

/**
 * In-memory access token storage (never localStorage for security)
 */
let inMemoryAccessToken: string | null = null;

export function setAuthToken(token: string | null): void {
  inMemoryAccessToken = token;
}

export function getAuthToken(): string | null {
  return inMemoryAccessToken;
}

/**
 * Centralized axios instance for all API communication.
 * All features should use this client — never construct API URLs manually.
 */
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  withCredentials: true,
});

// Request interceptor: attach in-memory Bearer token
apiClient.interceptors.request.use((config) => {
  if (inMemoryAccessToken && !config.headers.Authorization) {
    config.headers.Authorization = `Bearer ${inMemoryAccessToken}`;
  }
  return config;
});

// Response interceptor: unwrap data, normalize error messages
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const data = error.response?.data;
    let message = 'Unknown API error';

    if (data?.message) {
      if (Array.isArray(data.message)) {
        message = data.message.join(', ');
      } else {
        message = data.message;
      }
    } else if (error.message) {
      message = error.message;
    }

    return Promise.reject(new Error(message));
  },
);
