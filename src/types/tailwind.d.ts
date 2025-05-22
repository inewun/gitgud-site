/**
 * Типы для tailwind темы и конфигурации
 */

// Типы для цветов
export interface ThemeColors {
  primary: {
    DEFAULT: string;
    light: string;
    dark: string;
  };
  secondary: {
    DEFAULT: string;
    light: string;
    dark: string;
  };
  tertiary: string;
  accent: string;
  background: string;
  foreground: string;
  muted: string;
  subtle: string;
  success: string;
  error: string;
  warning: string;
  info: string;
}

// Типы для радиусов
export interface ThemeRadius {
  sm: string;
  DEFAULT: string;
  md: string;
  lg: string;
  xl: string;
  '2xl': string;
  full: string;
}

// Типы для теней
export interface ThemeShadows {
  xs: string;
  sm: string;
  DEFAULT: string;
  md: string;
  lg: string;
  xl: string;
  inner: string;
  none: string;
}

// Типы для размытия
export interface ThemeBlur {
  xs: string;
  sm: string;
  md: string;
  lg: string;
}

// Типы для анимации
export interface ThemeAnimation {
  'fade-in': string;
  'fade-up': string;
  'slide-left': string;
  'slide-right': string;
  'scale-up': string;
  pulse: string;
}

// Типы для кривых анимации
export interface ThemeTimingFunction {
  'soft-spring': string;
  'out-expo': string;
}

// Полная структура темы
export interface TailwindTheme {
  colors: ThemeColors;
  borderRadius: ThemeRadius;
  boxShadow: ThemeShadows;
  blur: ThemeBlur;
  animation: ThemeAnimation;
  transitionTimingFunction: ThemeTimingFunction;
}
