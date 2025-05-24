import React, { forwardRef } from 'react';

import { cva } from 'class-variance-authority';

import { cn } from '@/shared/lib/utils';
import { withMemo, propsComparison } from '@/shared/lib/utils/memo';

import type { CardProps } from './types';

export { type CardProps } from './types';

const cardVariants = cva(
  'rounded-lg border bg-card text-card-foreground relative overflow-hidden',
  {
    variants: {
      padding: {
        default: 'p-6',
        compact: 'p-4',
        none: '',
      },
      shadow: {
        none: '',
        sm: 'shadow-sm',
        md: 'shadow-md',
        lg: 'shadow-lg',
      },
      hover: {
        none: '',
        lift: 'hover:translate-y-[-2px] transition-hover',
        glow: 'hover:shadow-[0_0_15px_rgba(var(--primary)/0.15)] transition-hover',
        subtle: 'hover:bg-accent/10 transition-hover',
      },
      interactive: {
        true: 'cursor-pointer hover:bg-accent/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 transition-colors',
        false: '',
      },
      glassmorphism: {
        true: 'bg-opacity-60 backdrop-blur-lg backdrop-filter border-opacity-20',
        false: '',
      },
      accent: {
        true: 'border-primary/30',
        false: '',
      },
      animation: {
        none: '',
        fadeIn: 'animate-fade-in',
        scaleIn: 'animate-scale-in',
        slideUp: 'animate-slide-up',
        slideDown: 'animate-slide-down',
      },
    },
    defaultVariants: {
      padding: 'default',
      shadow: 'sm',
      hover: 'none',
      interactive: false,
      glassmorphism: false,
      accent: false,
      animation: 'none',
    },
  },
);

const CardBase = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      className,
      padding,
      shadow,
      hover,
      interactive,
      glassmorphism,
      accent,
      animation,
      children,
      ...props
    },
    ref,
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          cardVariants({
            padding,
            shadow,
            hover,
            interactive,
            glassmorphism,
            accent,
            animation,
          }),
          className,
        )}
        {...props}
        {...(interactive ? { tabIndex: 0 } : {})}
      >
        {children}
        {hover === 'glow' && (
          <div className="absolute inset-0 opacity-0 hover:opacity-100 pointer-events-none">
            <div className="absolute inset-0 bg-primary/5 animate-shimmer" />
          </div>
        )}
      </div>
    );
  },
);

CardBase.displayName = 'Card';

/**
 * Компонент Карточка (Card)
 * Используется как контейнер для группировки связанной информации и действий
 *
 * @example
 * <Card shadow="md" hover="lift" animation="fadeIn">
 *   <CardHeader>
 *     <CardTitle>Заголовок карточки</CardTitle>
 *   </CardHeader>
 *   <CardContent>Содержимое карточки</CardContent>
 * </Card>
 */
export const Card = withMemo(CardBase, (prev, next) =>
  propsComparison(prev, next, [
    'padding',
    'shadow',
    'hover',
    'interactive',
    'glassmorphism',
    'accent',
    'animation',
    'className',
    'children',
  ]),
);

Card.displayName = 'Card';
