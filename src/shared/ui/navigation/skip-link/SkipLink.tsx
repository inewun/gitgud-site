'use client';

import Link from 'next/link';
import React, { HTMLAttributes } from 'react';

import { cn } from '@/shared/lib/utils';
import { accessibility } from '@/styles/compositions';

export interface SkipLinkProps extends HTMLAttributes<HTMLAnchorElement> {
  /** ID элемента для перехода */
  targetId?: string;
  /** Дочерние элементы */
  children?: React.ReactNode;
}

/**
 * Компонент SkipLink предоставляет ссылку для пропуска навигации
 * и быстрого перехода к основному содержимому страницы.
 * Ссылка становится видимой только при получении фокуса.
 */
export function SkipLink({
  targetId = 'main-content',
  className,
  children = 'Перейти к основному содержимому',
  ...props
}: SkipLinkProps) {
  return (
    <Link
      href={`#${targetId}`}
      className={cn(accessibility.skipLink, className)}
      {...props}
      onClick={e => {
        const target = document.getElementById(targetId);
        if (target) {
          e.preventDefault();
          target.tabIndex = -1;
          target.focus();
          target.scrollIntoView();

          // Сбросим tabIndex после перехода
          setTimeout(() => {
            if (target.tabIndex === -1) {
              target.removeAttribute('tabindex');
            }
          }, 1000);
        }
      }}
    >
      {children}
    </Link>
  );
}
