import React, { forwardRef, ButtonHTMLAttributes } from 'react';

import { cva, type VariantProps } from 'class-variance-authority';

import { useTranslation } from '@/shared/lib/useTranslation';
import { cn } from '@/shared/lib/utils';
import { withMemo, propsComparison } from '@/shared/lib/utils/memo';

const buttonVariants = cva(
  'rounded-md inline-flex items-center justify-center relative focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary disabled:opacity-50 disabled:pointer-events-none overflow-hidden',
  {
    variants: {
      variant: {
        default: 'bg-primary text-white hover:bg-primary-hover focus-visible:ring-primary/70',
        secondary:
          'bg-secondary text-secondary-foreground hover:bg-secondary/90 focus-visible:ring-secondary/70',
        outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
        subtle: 'bg-subtle text-foreground hover:bg-accent hover:text-foreground',
        ghost: 'bg-transparent hover:bg-subtle hover:text-accent-foreground',
        link: 'text-primary hover:underline underline-offset-4',
        destructive:
          'bg-destructive text-destructive-foreground hover:bg-destructive/90 focus-visible:ring-destructive',
      },
      size: {
        xs: 'h-7 px-2.5 text-xs',
        sm: 'h-8 px-3 text-sm',
        md: 'h-10 px-4 py-2',
        lg: 'h-11 px-5 py-2',
        xl: 'h-12 px-6 py-2.5 text-lg',
        icon: 'h-10 w-10 p-0',
      },
      animation: {
        none: '',
        ripple: 'animate-ripple',
        lift: 'hover:-translate-y-1 active:translate-y-0 transition-transform',
        scale: 'hover:scale-[1.02] active:scale-[0.98] transition-transform',
        pulse: 'transition-shadow hover:shadow-[0_0_0_4px_rgba(var(--primary)/0.1)]',
      },
      fullWidth: {
        true: 'w-full',
      },
      rounded: {
        true: 'rounded-full',
        false: 'rounded-md',
      },
      elevated: {
        true: 'shadow-sm hover:shadow-md transition-shadow',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
      animation: 'none',
      rounded: false,
      elevated: false,
    },
  },
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  /** Иконка, отображаемая слева */
  leftIcon?: React.ReactNode;
  /** Иконка, отображаемая справа */
  rightIcon?: React.ReactNode;
  /** Состояние загрузки */
  isLoading?: boolean;
  /** Состояние нажатия кнопки (для toggle-кнопок) */
  isPressed?: boolean;
  /** ID элемента с описанием кнопки (для доступности) */
  'aria-describedby'?: string;
}

/**
 * Основной компонент кнопки
 *
 * @example
 * <Button variant="default" size="md" animation="lift">Кнопка</Button>
 * <Button variant="outline" rounded elevated>С иконкой</Button>
 */
const ButtonBase = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      animation,
      fullWidth,
      rounded,
      elevated,
      leftIcon,
      rightIcon,
      isLoading,
      isPressed,
      children,
      type = 'button',
      ...props
    },
    ref,
  ) => {
    const { t } = useTranslation();

    // Спиннер с более плавной анимацией для 2025
    const loadingSpinner = (
      <svg
        className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
        xmlns="http://www.w3.org/2000/svg"
        role="status"
        aria-hidden="true"
        aria-label={t('common.loading')}
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="3"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
    );

    // Эффект пульсации для анимации ripple
    const renderRippleEffect = () => {
      if (animation === 'ripple' && !isLoading && !props.disabled) {
        return (
          <span className="absolute inset-0 overflow-hidden rounded-md pointer-events-none">
            <span className="absolute inset-0 rounded-md ripple-effect" />
          </span>
        );
      }
      return null;
    };

    // Показываем спиннер вместо левой иконки при загрузке
    const iconContent = isLoading ? loadingSpinner : leftIcon;

    // Проверяем, имеет ли кнопка только иконку без текста
    // и есть ли у неё aria-label для доступности
    const hasOnlyIcon = (leftIcon || rightIcon) && !children;
    const hasAriaLabel = !!props['aria-label'];

    // Проверяем, является ли кнопка полностью пустой (ни текста, ни иконки)
    const isEmptyButton = !children && !leftIcon && !rightIcon;

    // Проверяем, имеет ли кнопка размер 'icon'
    const isIconButton = size === 'icon';

    // Определяем доступное описание для кнопки без текста
    let accessibleLabel = props['aria-label'];

    if (!hasAriaLabel) {
      if (hasOnlyIcon || isIconButton) {
        accessibleLabel = t('common.buttonAction', { defaultValue: 'Кнопка действия' });
      } else if (isEmptyButton) {
        accessibleLabel = t('common.emptyButton', { defaultValue: 'Интерактивная кнопка' });
      }
    }

    return (
      <button
        className={cn(
          buttonVariants({ variant, size, animation, fullWidth, rounded, elevated }),
          className,
        )}
        ref={ref}
        type={type}
        disabled={isLoading || props.disabled}
        aria-busy={isLoading ? 'true' : undefined}
        aria-disabled={props.disabled ? 'true' : undefined}
        aria-pressed={isPressed}
        aria-expanded={props['aria-expanded']}
        aria-label={accessibleLabel}
        {...props}
      >
        {iconContent && (
          <span className={cn('flex items-center justify-center', children ? 'mr-2' : '')}>
            {iconContent}
          </span>
        )}
        {children}
        {rightIcon && !isLoading && (
          <span className={cn('flex items-center justify-center', children ? 'ml-2' : '')}>
            {rightIcon}
          </span>
        )}
        {renderRippleEffect()}
      </button>
    );
  },
);

ButtonBase.displayName = 'Button';

/**
 * Мемоизированный компонент кнопки
 * Применяем целевую мемоизацию только для конкретных пропсов
 */
export const Button = withMemo(ButtonBase, (prev, next) =>
  propsComparison(prev, next, [
    'variant',
    'size',
    'animation',
    'fullWidth',
    'rounded',
    'elevated',
    'isLoading',
    'isPressed',
    'disabled',
    'children',
    'className',
    'aria-describedby',
  ]),
);

Button.displayName = 'Button';
