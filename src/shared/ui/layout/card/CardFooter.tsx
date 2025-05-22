import React, { forwardRef } from 'react';

import { cn } from '@/lib/utils';
import { withMemo, propsComparison } from '@/shared/lib/utils/memo';

/**
 * Компонент подвала карточки
 */
const CardFooterBase = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('flex items-center p-6 pt-0', className)} {...props} />
  ),
);

CardFooterBase.displayName = 'CardFooterBase';

export const CardFooter = withMemo(CardFooterBase, (prev, next) =>
  propsComparison(prev, next, ['className', 'children']),
);

CardFooter.displayName = 'CardFooter';
