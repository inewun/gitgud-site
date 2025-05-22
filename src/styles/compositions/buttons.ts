/**
 * Композиции стилей для кнопок
 *
 * Эти композиции помогают избежать повторения одинаковых комбинаций
 * классов Tailwind в разных компонентах.
 */

export interface ButtonVariants {
  base: string;
  primary: string;
  secondary: string;
  outline: string;
  ghost: string;
  link: string;
  danger: string;
  success: string;
  sizes: {
    sm: string;
    md: string;
    lg: string;
    icon: string;
  };
  states: {
    active: string;
    disabled: string;
    loading: string;
  };
}

/**
 * Базовые стили кнопок
 */
export const buttonBase =
  'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50';

/**
 * Композиции стилей для кнопок
 */
export const buttonVariants: ButtonVariants = {
  base: buttonBase,

  // Варианты кнопок
  primary: 'bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:ring-primary',
  secondary:
    'bg-secondary text-secondary-foreground hover:bg-secondary/90 focus-visible:ring-secondary',
  outline:
    'border border-input bg-background hover:bg-accent hover:text-accent-foreground focus-visible:ring-accent',
  ghost: 'hover:bg-accent hover:text-accent-foreground focus-visible:ring-accent',
  link: 'text-primary underline-offset-4 hover:underline focus-visible:ring-primary',
  danger: 'bg-error text-white hover:bg-error/90 focus-visible:ring-error',
  success: 'bg-success text-white hover:bg-success/90 focus-visible:ring-success',

  // Размеры кнопок
  sizes: {
    sm: 'h-8 px-3 text-xs',
    md: 'h-10 px-4 py-2',
    lg: 'h-12 px-6 text-lg',
    icon: 'h-10 w-10 p-0',
  },

  // Состояния кнопок
  states: {
    active: 'ring-2 ring-offset-2',
    disabled: 'opacity-50 cursor-not-allowed',
    loading: 'opacity-70 cursor-wait',
  },
};
