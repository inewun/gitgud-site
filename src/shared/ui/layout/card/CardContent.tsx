import React, { forwardRef } from 'react';

import { cn } from '@/lib/utils';
import { withMemo, propsComparison } from '@/shared/lib/utils/memo';

/**
 * Компонент содержимого карточки
 */
const CardContentBase = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('p-6 pt-0', className)} {...props} />
  ),
);

CardContentBase.displayName = 'CardContentBase';

export const CardContent = withMemo(CardContentBase, (prev, next) =>
  propsComparison(prev, next, ['className', 'children']),
);

CardContent.displayName = 'CardContent';
