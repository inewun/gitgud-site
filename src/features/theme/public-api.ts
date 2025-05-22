/**
 * Public API для фичи "Тема"
 *
 * Этот файл экспортирует все публичные компоненты, хуки и типы
 * для использования в других слайсах приложения.
 */

// UI компоненты
export { ThemeToggle } from './ui/ThemeToggle';

// Провайдеры
export { ThemeProvider } from '@/shared/ui/theme/providers';

// Хуки
export { useTheme } from './hooks/useTheme';

// Типы
export type { Theme, ThemeContextType } from './types';

// Константы
export { THEMES } from './constants';
export { DEFAULT_THEME } from './model/constants';
