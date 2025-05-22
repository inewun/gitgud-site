import React, { forwardRef } from 'react';

import { cn } from '@/lib/utils';
import { withMemo, propsComparison } from '@/shared/lib/utils/memo';

/**
 * Компонент заголовка карточки
 */
const CardTitleBase = forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement> & { as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' }
>(({ className, children, as: Comp = 'h2', ...props }, ref) => (
  <Comp
    ref={ref}
    className={cn('text-lg font-semibold leading-none tracking-tight', className)}
    {...props}
  >
    {children}
  </Comp>
));

CardTitleBase.displayName = 'CardTitleBase';

export const CardTitle = withMemo(CardTitleBase, (prev, next) =>
  propsComparison(prev, next, ['className', 'children', 'as']),
);

CardTitle.displayName = 'CardTitle';
