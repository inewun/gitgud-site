import { ReactNode } from 'react';

/**
 * Возможные режимы темы
 */
export type Theme = 'light' | 'dark';

/**
 * Тип контекста темы
 */
export interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  resolvedTheme?: Theme;
  systemTheme?: Theme;
  isClient?: boolean;
}

/**
 * Пропсы для провайдера темы
 */
export interface ThemeProviderProps {
  children: ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
}
