import React, { HTMLAttributes } from 'react';

import { cn } from '@/lib/utils';
import { withMemo } from '@/shared/lib/utils/memo';

export interface ResultContainerProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * Содержимое контейнера
   */
  children: React.ReactNode;
  /**
   * Вариант отображения контейнера
   */
  variant?: 'default' | 'withBackground';
  /**
   * Дополнительные CSS классы
   */
  className?: string;
}

/**
 * Контейнер для отображения результатов операций
 */
const ResultContainerBase: React.FC<ResultContainerProps> = ({
  children,
  variant = 'default',
  className = '',
  ...props
}) => {
  return (
    <div
      className={cn(
        'p-4 rounded-b-lg',
        {
          'bg-subtle dark:bg-card': variant === 'withBackground',
        },
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
};

ResultContainerBase.displayName = 'ResultContainer';

export const ResultContainer = withMemo(ResultContainerBase);
