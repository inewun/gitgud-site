import {
  HTMLAttributes,
  ButtonHTMLAttributes,
  InputHTMLAttributes,
  TextareaHTMLAttributes,
  ReactNode,
} from 'react';

/**
 * Базовый интерфейс для всех компонентов с поддержкой className
 */
export interface BaseComponentProps {
  className?: string;
}

/**
 * Интерфейс для компонентов с детьми
 */
export interface WithChildrenProps {
  children?: ReactNode;
}

/**
 * Типы для кнопок
 */
export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';
export type ButtonSize = 'default' | 'sm' | 'lg' | 'icon';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>, BaseComponentProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
}

/**
 * Типы для текстовых полей
 */
export interface TextInputFieldProps
  extends InputHTMLAttributes<HTMLInputElement>,
    BaseComponentProps {
  label?: string;
  error?: string;
  hint?: string;
  leftAddon?: ReactNode;
  rightAddon?: ReactNode;
  fullWidth?: boolean;
}

/**
 * Типы для многострочных текстовых полей
 */
export interface TextareaFieldProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement>,
    BaseComponentProps {
  label?: string;
  error?: string;
  hint?: string;
  fullWidth?: boolean;
  resize?: 'none' | 'vertical' | 'horizontal' | 'both';
}

/**
 * Типы для чекбокса
 */
export interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement>, BaseComponentProps {
  label?: string;
  error?: string;
  hint?: string;
}

/**
 * Типы для карточек
 */
export interface CardProps
  extends HTMLAttributes<HTMLDivElement>,
    BaseComponentProps,
    WithChildrenProps {}

export interface CardHeaderProps
  extends HTMLAttributes<HTMLDivElement>,
    BaseComponentProps,
    WithChildrenProps {}

export interface CardFooterProps
  extends HTMLAttributes<HTMLDivElement>,
    BaseComponentProps,
    WithChildrenProps {}

export interface CardTitleProps
  extends HTMLAttributes<HTMLHeadingElement>,
    BaseComponentProps,
    WithChildrenProps {}

export interface CardDescriptionProps
  extends HTMLAttributes<HTMLParagraphElement>,
    BaseComponentProps,
    WithChildrenProps {}

export interface CardContentProps
  extends HTMLAttributes<HTMLDivElement>,
    BaseComponentProps,
    WithChildrenProps {}

/**
 * Типы для навигации
 */
export interface NavigationMenuProps extends HTMLAttributes<HTMLDivElement>, BaseComponentProps {}

export interface NavigationItemProps {
  href: string;
  label: string;
  icon?: ReactNode;
  isActive?: boolean;
}

/**
 * Типы для иконок и медиа
 */
export interface IconProps extends HTMLAttributes<HTMLSpanElement>, BaseComponentProps {
  name: string;
  size?: number | string;
  color?: string;
}

export interface ImageProps extends HTMLAttributes<HTMLImageElement>, BaseComponentProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
  priority?: boolean;
  blur?: boolean;
}

/**
 * Типы для шапки и подвала
 */
export interface HeaderProps extends HTMLAttributes<HTMLElement>, BaseComponentProps {}

/**
 * Типы для обработки ошибок
 */
export interface ErrorBoundaryProps extends BaseComponentProps, WithChildrenProps {
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
  className?: string;
}

/**
 * Типы для темы
 */
export interface ThemeToggleProps extends HTMLAttributes<HTMLButtonElement>, BaseComponentProps {}

/**
 * Типы для аналитики и производительности
 */
export interface AnalyticsProps {}

/**
 * Типы для контейнеров и обёрток
 */
export interface MotionWrapperProps
  extends HTMLAttributes<HTMLDivElement>,
    BaseComponentProps,
    WithChildrenProps {
  animate?: boolean;
  delay?: number;
  duration?: number;
  type?: 'fade' | 'slide' | 'scale' | 'bounce';
}
