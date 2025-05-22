/**
 * Базовые типы сущности пользователя
 */

export interface UserRole {
  id: string;
  name: string;
  permissions: string[];
}

export interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  roles: UserRole[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  roles: UserRole[];
  isActive: boolean;
}

export interface UserPreferences {
  theme: string;
  language: string;
  notifications: boolean;
  accessibility: {
    highContrast: boolean;
    fontSize: string;
  };
}

export interface UserState {
  profile: UserProfile | null;
  isLoading: boolean;
  error: string | null;
}
