/**
 * Режимы темы
 */
export enum ThemeMode {
  LIGHT = 'light',
  DARK = 'dark',
}

/**
 * Список доступных тем с метками
 */
export const THEME_MODES = [
  { value: ThemeMode.LIGHT, label: 'Светлая' },
  { value: ThemeMode.DARK, label: 'Тёмная' },
];

/**
 * Настройки темы по умолчанию
 */
export const THEME_SETTINGS = {
  DEFAULT_THEME: ThemeMode.LIGHT,
  STORAGE_KEY: 'theme',
};

export const DEFAULT_THEME = ThemeMode.LIGHT;
