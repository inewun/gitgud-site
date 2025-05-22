import React, { forwardRef } from 'react';

import { cn } from '@/lib/utils';
import { withMemo, propsComparison } from '@/shared/lib/utils/memo';

/**
 * Компонент описания карточки
 */
const CardDescriptionBase = forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p ref={ref} className={cn('text-sm text-muted-foreground', className)} {...props} />
));

CardDescriptionBase.displayName = 'CardDescriptionBase';

export const CardDescription = withMemo(CardDescriptionBase, (prev, next) =>
  propsComparison(prev, next, ['className', 'children']),
);

CardDescription.displayName = 'CardDescription';
