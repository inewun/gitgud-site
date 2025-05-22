import React, { HTMLAttributes } from 'react';

import { cn } from '@/shared/lib/utils';
import { withMemo } from '@/shared/lib/utils/memo';
import { resultContainers } from '@/styles/compositions';

/**
 * Компонент для отображения предварительно отформатированного текста
 */
export interface PreformattedTextProps extends HTMLAttributes<HTMLPreElement> {
  content: string;
  className?: string;
}

const PreformattedTextBase: React.FC<PreformattedTextProps> = ({
  content,
  className = '',
  ...props
}) => {
  return (
    <pre className={cn(resultContainers.preformatted, className)} {...props}>
      {content}
    </pre>
  );
};

PreformattedTextBase.displayName = 'PreformattedText';

export const PreformattedText = withMemo(PreformattedTextBase);
