import dynamic from 'next/dynamic';
import type { DynamicOptionsLoadingProps } from 'next/dynamic';
import React from 'react';

export interface LazyLoadOptions {
  loading?: React.ComponentType<DynamicOptionsLoadingProps>;
  ssr?: boolean;
}

/**
 * Простая заглушка компонента загрузки по умолчанию
 */
export const DefaultLoadingFallback = () => (
  <div className="flex items-center justify-center w-full h-full min-h-[200px]">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
  </div>
);

/**
 * Утилита для ленивой загрузки компонентов с помощью Next.js dynamic import
 * Экспортируем прямо dynamic из next/dynamic для простоты использования
 *
 * @example
 * ```tsx
 * // Обычное использование
 * const LazyComponent = dynamic(() => import('@/path/to/Component'));
 *
 * // С пользовательским лоадером и отключенным SSR
 * const LazyComponent = dynamic(() => import('@/path/to/Component'), {
 *   loading: () => <LoadingSpinner />,
// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
 *   ssr: false
 * });
 * ```
 */
export const lazyLoad = dynamic;
