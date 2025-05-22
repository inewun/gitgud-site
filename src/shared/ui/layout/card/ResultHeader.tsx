import React, { HTMLAttributes } from 'react';

import { cn } from '@/shared/lib/utils';
import { withMemo } from '@/shared/lib/utils/memo';
import { resultContainers } from '@/styles/compositions';

/**
 * Компонент для отображения заголовка результатов с действиями
 */
export interface ResultHeaderProps extends HTMLAttributes<HTMLDivElement> {
  title: string;
  actions?: React.ReactNode;
  className?: string;
}

const ResultHeaderBase: React.FC<ResultHeaderProps> = ({
  title,
  actions,
  className = '',
  ...props
}) => {
  return (
    <div className={cn(resultContainers.header, className)} {...props}>
      <h3 className="text-[1.5rem] font-medium">{title}</h3>
      {actions && <div className="flex gap-2">{actions}</div>}
    </div>
  );
};

ResultHeaderBase.displayName = 'ResultHeader';

export const ResultHeader = withMemo(ResultHeaderBase);
