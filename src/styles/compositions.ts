/**
 * Композиционные стили для переиспользования в компонентах
 * Файл содержит общие стилевые композиции, используемые в приложении
 *
 * Используем определения из tailwind.config.ts для цветов и других базовых стилей
 */

// Импорт типов темы из tailwind.config.ts
import { resultContainers } from '@/styles/compositions/resultContainers';

// Определение типов для композиций стилей

/** Тип для композиций макетов */
export type LayoutComposition = {
  grid: string;
  flexCenter: string;
  flexBetween: string;
  flexStart: string;
  flexEnd: string;
  flexColumn: string;
  flexRowCenter: string;
  container: string;
  section: string;
  formSection: string;
};

/** Тип для композиций контейнеров */
export type ContainerComposition = {
  card: string;
  panel: string;
  resultContainer: string;
  resultContainerWithBg: string;
};

/** Тип для композиций типографики */
export type TypographyComposition = {
  heading1: string;
  heading2: string;
  heading3: string;
  heading4: string;
  h5: string;
  paragraph: string;
  caption: string;
  small: string;
  preformatted: string;
  srOnly: string;
};

/** Тип для композиций форм */
export type FormsComposition = {
  inputWrapper: string;
  checkboxGroup: string;
  buttonsGroup: string;
  formGrid: string;
  formGridCompact: string;
  formGridWide: string;
  formGroup: string;
  formGroupInline: string;
  formLabeledField: string;
  button: string;
  submitButton: string;
};

/** Тип для композиций интерактивных элементов */
export type InteractiveComposition = {
  button: string;
  buttonPrimary: string;
  buttonSecondary: string;
  buttonOutline: string;
  link: string;
};

/** Тип для композиций состояний */
export type StateComposition = {
  error: string;
  success: string;
  warning: string;
  info: string;
};

/** Тип для композиций анимаций */
export type AnimationComposition = {
  fadeIn: string;
  slideUp: string;
  slideLeft: string;
  slideRight: string;
  scaleUp: string;
  pulse: string;
};

/** Тип для композиций утилит */
export type UtilityComposition = {
  srOnly: string;
  visuallyHidden: string;
  truncate: string;
  noWrap: string;
  pointer: string;
};

/** Тип для композиций сетки */
export type GridStylesComposition = {
  base: string;
  cols1: string;
  cols2: string;
  cols3: string;
  cols4: string;
  gap4: string;
  gap6: string;
  gap8: string;
};

/** Тип для композиций доступности */
export type AccessibilityComposition = {
  skipLink: string;
  focusRing: string;
  highContrast: string;
  ariaLive: string;
};

/** Тип для композиций отступов */
export type SpacingComposition = {
  gapXs: string;
  gapSm: string;
  gapMd: string;
  gapLg: string;
  gapXl: string;
  p0: string;
  p1: string;
  p2: string;
  p4: string;
  p6: string;
  p8: string;
  m0: string;
  m1: string;
  m2: string;
  m4: string;
  m6: string;
  m8: string;
};

/** Тип для композиций границ */
export type BordersComposition = {
  default: string;
  rounded: string;
  roundedSm: string;
  roundedMd: string;
  roundedLg: string;
  roundedFull: string;
};

/** Тип для композиций переходов */
export type TransitionsComposition = {
  default: string;
  fast: string;
  slow: string;
  none: string;
};

/** Тип для композиций адаптивности */
export type ResponsiveComposition = {
  hideOnMobile: string;
  showOnMobile: string;
  hideOnTablet: string;
  showOnTablet: string;
  hideOnDesktop: string;
  showOnDesktop: string;
};

/** Тип для композиций сеток */
export type GridLayoutsComposition = {
  oneColumn: string;
  twoColumns: string;
  threeColumns: string;
  fourColumns: string;
  autoFit: string;
};

// Текстовые стили для различных элементов
export type TextComposition = {
  primary: string;
  secondary: string;
  success: string;
  error: string;
  warning: string;
  info: string;
  muted: string;
  subtle: string;
  emphasis: string;
  highEmphasis: string;
  lowEmphasis: string;
  disabled: string;
  heading: string;
  subheading: string;
};

// Компоновка и расположение
export const layout: LayoutComposition = {
  grid: 'grid',
  flexCenter: 'flex items-center justify-center',
  flexBetween: 'flex items-center justify-between',
  flexStart: 'flex items-center justify-start',
  flexEnd: 'flex items-center justify-end',
  flexColumn: 'flex flex-col',
  flexRowCenter: 'flex flex-row items-center',
  container: 'container mx-auto px-4 md:px-6',
  section: 'py-8 md:py-12',
  formSection: 'grid grid-cols-1 md:grid-cols-2 gap-6',
};

// Карточки и контейнеры, используем переменные темы tailwind
export const containers: ContainerComposition = {
  card: 'border rounded-lg p-6 bg-card text-card-foreground',
  panel: 'border rounded-lg shadow-sm bg-background',
  resultContainer: 'p-4 rounded-md bg-muted',
  resultContainerWithBg: 'p-4 rounded-md border bg-muted',
};

// Типографика использует переменные темы
export const typography: TypographyComposition = {
  heading1: 'text-3xl md:text-4xl font-bold tracking-tight text-foreground',
  heading2: 'text-2xl md:text-3xl font-bold text-foreground',
  heading3: 'text-xl md:text-2xl font-semibold text-foreground',
  heading4: 'text-lg font-semibold text-foreground',
  h5: 'text-base font-semibold text-foreground',
  paragraph: 'text-base text-foreground',
  caption: 'text-sm text-foreground dark:text-foreground',
  small: 'text-sm',
  preformatted: 'font-mono text-sm whitespace-pre-wrap break-words',
  srOnly: 'sr-only',
};

// Формы
export const forms: FormsComposition = {
  inputWrapper: 'space-y-2',
  checkboxGroup: 'flex flex-wrap gap-3 mb-4',
  buttonsGroup: 'flex gap-3',
  formGrid: 'grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6',
  formGridCompact: 'grid grid-cols-1 gap-4',
  formGridWide: 'grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6',
  formGroup: 'mb-4 md:mb-6',
  formGroupInline: 'flex flex-col sm:flex-row sm:items-center sm:space-x-2',
  formLabeledField: 'grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-2 md:gap-4 items-start',
  button: 'inline-flex items-center justify-center font-medium',
  submitButton:
    'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium bg-primary text-primary-foreground shadow hover:bg-primary/90 transition-colors',
};

// Интерактивные элементы, используя стили из tailwind
export const interactive: InteractiveComposition = {
  button:
    'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50',
  buttonPrimary: 'bg-primary text-primary-foreground shadow hover:bg-primary/90',
  buttonSecondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
  buttonOutline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
  link: 'text-primary underline-offset-4 hover:underline',
};

// Состояния и отзывчивость, используя семантические цвета
export const states: StateComposition = {
  error: 'text-destructive',
  success: 'text-success',
  warning: 'text-warning',
  info: 'text-info',
};

// Анимации
export const animations: AnimationComposition = {
  fadeIn: 'animate-fade-in',
  slideUp: 'animate-fade-up',
  slideLeft: 'animate-slide-left',
  slideRight: 'animate-slide-right',
  scaleUp: 'animate-scale-up',
  pulse: 'animate-pulse',
};

// Утилиты
export const utils: UtilityComposition = {
  srOnly: 'sr-only',
  visuallyHidden: 'absolute w-0 h-0 overflow-hidden',
  truncate: 'truncate',
  noWrap: 'whitespace-nowrap',
  pointer: 'cursor-pointer',
};

// Стили для grid-контейнеров
export const gridStyles: GridStylesComposition = {
  base: 'grid',
  cols1: 'grid-cols-1',
  cols2: 'grid-cols-1 sm:grid-cols-2',
  cols3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
  cols4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
  gap4: 'gap-4',
  gap6: 'gap-6',
  gap8: 'gap-8',
};

// Компоненты доступности
export const accessibility: AccessibilityComposition = {
  skipLink:
    'sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 focus:z-50 focus:p-4 focus:bg-white focus:text-primary focus:border-2 focus:border-primary focus:w-auto focus:h-auto focus:shadow-md focus:rounded',
  focusRing:
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
  highContrast: 'text-foreground bg-background border border-foreground',
  ariaLive: 'sr-only',
};

// Отступы
export const spacing: SpacingComposition = {
  gapXs: 'gap-1',
  gapSm: 'gap-2',
  gapMd: 'gap-4',
  gapLg: 'gap-6',
  gapXl: 'gap-8',
  p0: 'p-0',
  p1: 'p-1',
  p2: 'p-2',
  p4: 'p-4',
  p6: 'p-6',
  p8: 'p-8',
  m0: 'm-0',
  m1: 'm-1',
  m2: 'm-2',
  m4: 'm-4',
  m6: 'm-6',
  m8: 'm-8',
};

// Границы
export const borders: BordersComposition = {
  default: 'border',
  rounded: 'rounded',
  roundedSm: 'rounded-sm',
  roundedMd: 'rounded-md',
  roundedLg: 'rounded-lg',
  roundedFull: 'rounded-full',
};

// Переходы
export const transitions: TransitionsComposition = {
  default: 'transition-all duration-200',
  fast: 'transition-all duration-100',
  slow: 'transition-all duration-300',
  none: 'transition-none',
};

// Адаптивность
export const responsive: ResponsiveComposition = {
  hideOnMobile: 'hidden sm:block',
  showOnMobile: 'block sm:hidden',
  hideOnTablet: 'hidden md:block',
  showOnTablet: 'block md:hidden',
  hideOnDesktop: 'hidden lg:block',
  showOnDesktop: 'block lg:hidden',
};

// Макеты сеток
export const gridLayouts: GridLayoutsComposition = {
  oneColumn: 'grid grid-cols-1 gap-4',
  twoColumns: 'grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6',
  threeColumns: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6',
  fourColumns: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6',
  autoFit: 'grid grid-cols-1 sm:grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)) gap-4',
};

// Текстовые стили для различных элементов
export const text: TextComposition = {
  primary: 'text-primary',
  secondary: 'text-secondary',
  success: 'text-success',
  error: 'text-error',
  warning: 'text-warning',
  info: 'text-info',
  muted: 'text-muted-foreground dark:text-muted-foreground',
  subtle: 'text-muted-foreground dark:text-muted-foreground',
  emphasis: 'font-medium text-foreground',
  highEmphasis: 'font-semibold text-foreground',
  lowEmphasis: 'text-foreground dark:text-foreground',
  disabled: 'text-muted-foreground dark:text-muted-foreground',
  heading: 'font-bold text-foreground',
  subheading: 'font-semibold text-foreground dark:text-muted-foreground',
};

// Экспорт стилей для результатов
export { resultContainers };
