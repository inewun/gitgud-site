import React, { forwardRef } from 'react';

import { cn } from '@/lib/utils';
import { withMemo, propsComparison } from '@/shared/lib/utils/memo';

/**
 * Компонент заголовка карточки
 */
const CardHeaderBase = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('p-6 pb-2', className)} {...props} />
  ),
);

CardHeaderBase.displayName = 'CardHeaderBase';

export const CardHeader = withMemo(CardHeaderBase, (prev, next) =>
  propsComparison(prev, next, ['className', 'children']),
);

CardHeader.displayName = 'CardHeader';
