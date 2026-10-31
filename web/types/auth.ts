export type UserRole = 'admin' | 'staff' | 'customer';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  emailVerifiedAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface LoginResponse {
  message: string;
  user: AuthUser;
  accessToken: string;
}

export interface RegisterResponse {
  message: string;
  user: AuthUser;
}

export interface RefreshResponse {
  message: string;
  user: AuthUser;
  accessToken: string;
}

export interface StaffUser {
  id: string;
  name: string;
  email: string;
  role: 'staff';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
