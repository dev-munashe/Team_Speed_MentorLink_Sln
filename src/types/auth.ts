// src/types/auth.ts
import type { User, UserRole } from './domain';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupData {
  email: string;
  password: string;
  confirmPassword: string;
  role: UserRole;
  name: string;
  phone?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<User>;
  signup: (data: SignupData) => Promise<User>;
  logout: () => void;
  clearError: () => void;
}

// Role-based permissions
export type Permission = 
  | 'upload_csv'
  | 'run_matching'
  | 'view_all_users'
  | 'manage_pairings'
  | 'send_admin_messages'
  | 'view_analytics'
  | 'manage_system'
  | 'edit_profile'
  | 'view_mentees'
  | 'view_mentors'
  | 'send_messages'
  | 'manage_availability'
  | 'browse_mentors'
  | 'request_mentor';

export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  admin: [
    'upload_csv',
    'run_matching',
    'view_all_users',
    'manage_pairings',
    'send_admin_messages',
    'view_analytics',
    'manage_system'
  ],
  mentor: [
    'edit_profile',
    'view_mentees',
    'send_messages',
    'manage_availability'
  ],
  mentee: [
    'edit_profile',
    'view_mentors',
    'browse_mentors',
    'send_messages',
    'request_mentor'
  ]
};