/**
 * Индексный файл для экспорта всех композиций стилей
 *
 * Экспорт из этого файла обеспечивает единую точку входа для использования
 * композиций стилей в компонентах.
 */

export * from './buttons';
export * from './cards';
export * from './forms';

// Композиции стилей для типографики
export interface TypographyComposition {
  heading1: string;
  heading2: string;
  heading3: string;
  heading4: string;
  h5: string;
  paragraph: string;
  lead: string;
  small: string;
  muted: string;
}

export const typography: TypographyComposition = {
  heading1: 'text-3xl md:text-4xl font-bold tracking-tight text-foreground',
  heading2: 'text-2xl md:text-3xl font-bold text-foreground',
  heading3: 'text-xl md:text-2xl font-semibold text-foreground',
  heading4: 'text-lg font-semibold text-foreground',
  h5: 'text-base font-semibold text-foreground',
  paragraph: 'text-base text-foreground',
  lead: 'text-xl text-foreground',
  small: 'text-sm text-muted-foreground',
  muted: 'text-sm text-muted-foreground',
};

// Композиции для контейнеров
export interface ContainerComposition {
  base: string;
  narrow: string;
  wide: string;
  full: string;
  padded: string;
}

export const containers: ContainerComposition = {
  base: 'mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl',
  narrow: 'mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl',
  wide: 'mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl',
  full: 'w-full',
  padded: 'p-4 sm:p-6 lg:p-8',
};

// Композиции для состояний
export interface StateComposition {
  error: string;
  success: string;
  warning: string;
  info: string;
}

export const states: StateComposition = {
  error: 'text-destructive',
  success: 'text-success',
  warning: 'text-warning',
  info: 'text-info',
};

// Композиции для анимаций
export interface AnimationComposition {
  fadeIn: string;
  slideUp: string;
  slideLeft: string;
  slideRight: string;
}

export const animations: AnimationComposition = {
  fadeIn: 'animate-fade-in',
  slideUp: 'animate-fade-up',
  slideLeft: 'animate-slide-left',
  slideRight: 'animate-slide-right',
};
