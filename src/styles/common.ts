import { cn } from '@/shared/lib/utils';

// Экспортируем cn для использования в других файлах
export { cn };

/**
 * Общие стили для контейнеров
 */
export const containerStyles = {
  base: 'mx-auto w-full px-4 sm:px-6 lg:px-8',
  narrow: 'max-w-5xl',
  default: 'max-w-7xl',
  wide: 'max-w-screen-2xl',
};

/**
 * Общие стили для секций
 */
export const sectionStyles = {
  base: 'py-8 md:py-12 lg:py-16',
  withBorder: 'border-b border-subtle/50 dark:border-muted/10',
  withBackground: 'bg-subtle/20 dark:bg-muted/5',
};

/**
 * Стили для кнопок
 */
export const button = {
  base: 'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background',
  primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
  secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
  outline: 'border border-input hover:bg-accent hover:text-accent-foreground',
  ghost: 'hover:bg-accent hover:text-accent-foreground',
  destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
  size: {
    default: 'h-10 py-2 px-4',
    sm: 'h-9 px-3 rounded-md',
    lg: 'h-11 px-8 rounded-md',
    icon: 'h-10 w-10',
  },
};

/**
 * Стили для инпутов
 */
export const input = {
  base: 'flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
  error: 'border-destructive focus-visible:ring-destructive',
};

/**
 * Стили для текстовых областей
 */
export const textarea = {
  base: 'flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
  error: 'border-destructive focus-visible:ring-destructive',
};

/**
 * Стили для карточек
 */
export const card = {
  base: 'rounded-lg border bg-card text-card-foreground shadow-sm',
  header: 'flex flex-col space-y-1.5 p-6',
  title: 'text-2xl font-semibold leading-none tracking-tight',
  description: 'text-sm text-muted-foreground',
  content: 'p-6 pt-0',
  footer: 'flex items-center p-6 pt-0',
};

/**
 * Расширенные стили для карточек
 */
export const cardStyles = {
  base: 'rounded-lg bg-background dark:bg-background/95 border border-subtle/50 dark:border-muted/10 shadow-sm transition-all duration-300',
  interactive: 'hover:shadow-md hover:border-primary/20 hover:-translate-y-0.5 transform',
  accent: 'border-accent/30 dark:border-accent/30 ring-1 ring-accent/20 dark:ring-accent/20',
};

/**
 * Стили для чекбоксов
 */
export const checkbox = {
  base: 'peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground',
  label:
    'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
};

/**
 * Стили для текста
 */
export const typography = {
  h1: 'scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl',
  h2: 'scroll-m-20 text-3xl font-semibold tracking-tight',
  h3: 'scroll-m-20 text-2xl font-semibold tracking-tight',
  h4: 'scroll-m-20 text-xl font-semibold tracking-tight',
  p: 'leading-7 [&:not(:first-child)]:mt-6',
  lead: 'text-xl text-muted-foreground',
  large: 'text-lg font-semibold',
  small: 'text-sm font-medium leading-none',
  muted: 'text-sm text-muted-foreground',
  heading1: 'text-3xl md:text-4xl font-bold tracking-tight',
  heading2: 'text-2xl md:text-3xl font-bold',
  heading3: 'text-xl md:text-2xl font-semibold',
  heading4: 'text-lg font-semibold',
  paragraph: 'text-base text-foreground dark:text-foreground',
  caption: 'text-sm text-muted-foreground dark:text-muted-foreground',
  preformatted: 'font-mono text-sm whitespace-pre-wrap break-words',
};

/**
 * Расширенные стили для текста
 */
export const textStyles = {
  heading1: 'text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl',
  heading2: 'text-2xl font-bold tracking-tight sm:text-3xl',
  heading3: 'text-xl font-bold tracking-tight sm:text-2xl',
  heading4: 'text-lg font-bold tracking-tight',
  large: 'text-lg',
  body: 'text-base',
  small: 'text-sm',
  muted: 'text-subtle dark:text-muted',
};

/**
 * Стили для лейаута
 */
export const layout = {
  container: 'container mx-auto px-4 md:px-6',
  section: 'py-12 md:py-16 lg:py-24',
  grid: 'grid gap-4 md:gap-8',
  flexCenter: 'flex items-center justify-center',
  flexBetween: 'flex items-center justify-between',
  flexStart: 'flex items-center justify-start',
  flexEnd: 'flex items-center justify-end',
  flexColumn: 'flex flex-col',
  formSection: 'grid grid-cols-1 md:grid-cols-2 gap-6',
};

/**
 * Стили для flexbox-контейнеров
 */
export const flexStyles = {
  row: 'flex flex-row',
  col: 'flex flex-col',
  center: 'items-center justify-center',
  between: 'items-center justify-between',
  start: 'items-start justify-start',
  end: 'items-end justify-end',
  gap2: 'gap-2',
  gap4: 'gap-4',
  gap6: 'gap-6',
  gap8: 'gap-8',
};

/**
 * Стили для расстояний
 */
export const spacing = {
  xs: 'p-1',
  sm: 'p-2',
  md: 'p-4',
  lg: 'p-6',
  xl: 'p-8',
  '2xl': 'p-12',
};

/**
 * Стили для карт и компонентов UI
 */
export const cards = {
  primary: 'bg-card text-card-foreground shadow-sm',
  secondary: 'bg-secondary text-secondary-foreground',
  outline: 'border border-input bg-transparent',
  ghost: 'bg-accent/50 text-accent-foreground',
};

/**
 * Стили для форм
 */
export const formVariants = {
  default: 'space-y-6',
  compact: 'space-y-4',
  inline: 'flex items-end gap-4',
};

/**
 * Стили для анимаций
 */
export const animations = {
  fade: 'transition-opacity',
  scale: 'transition-transform',
  slideIn: 'transition-transform transform-gpu',
  fadeIn: 'animate-fadeIn',
  spinSlow: 'animate-spin-slow',
  pulse: 'animate-pulse',
  fadeInSlideUp: 'animate-fadeInSlideUp',
};

/**
 * Стили для переходов
 */
export const transitions = {
  fast: 'transition-all duration-150 ease-in-out',
  medium: 'transition-all duration-300 ease-in-out',
  slow: 'transition-all duration-500 ease-in-out',
};

/**
 * Стили для доступности
 */
export const accessibility = {
  srOnly: 'sr-only',
  focusRing:
    'focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
  skipLink: 'sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 z-50',
};

/**
 * Стили для адаптивности
 */
export const responsive = {
  hidden: {
    base: 'hidden',
    sm: 'sm:block',
    md: 'md:block',
    lg: 'lg:block',
    xl: 'xl:block',
  },
  flex: {
    sm: 'sm:flex',
    md: 'md:flex',
    lg: 'lg:flex',
    xl: 'xl:flex',
  },
  grid: {
    sm: 'sm:grid',
    md: 'md:grid',
    lg: 'lg:grid',
    xl: 'xl:grid',
  },
};

/**
 * Стили для контейнеров из compositions.ts
 */
export const containers = {
  card: 'card border rounded-lg p-6 bg-card',
  panel: 'border rounded-lg shadow-sm',
  resultContainer: 'p-4 bg-subtle dark:bg-card rounded-md',
  resultContainerWithBorder:
    'p-4 bg-subtle dark:bg-card rounded-md border border-border dark:border-border',
};

/**
 * Стили для форм из compositions.ts
 */
export const forms = {
  inputWrapper: 'space-y-2',
  checkboxGroup: 'flex flex-wrap gap-3 mb-4',
  buttonsGroup: 'flex gap-3',
  formGrid: 'grid grid-cols-1 gap-4',
};

/**
 * Интерактивные элементы из compositions.ts
 */
export const interactive = {
  button: 'flex items-center justify-center',
  buttonPrimary: 'bg-primary text-white hover:bg-primary/90',
  buttonSecondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/90',
  buttonOutline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
  link: 'text-primary hover:underline',
};

/**
 * Состояния и отзывчивость из compositions.ts
 */
export const states = {
  error: 'text-red-500 dark:text-red-400',
  success: 'text-green-500 dark:text-green-400',
  warning: 'text-yellow-500 dark:text-yellow-400',
  info: 'text-blue-500 dark:text-blue-400',
};

/**
 * Утилиты из compositions.ts
 */
export const utils = {
  srOnly: 'sr-only',
  visuallyHidden: 'absolute w-0 h-0 overflow-hidden',
  truncate: 'truncate',
  noWrap: 'whitespace-nowrap',
  pointer: 'cursor-pointer',
};
