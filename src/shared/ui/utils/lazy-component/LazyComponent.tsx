'use client';
// ВАЖНО: Этот компонент должен использоваться только внутри клиентских компонентов!
// Не передавайте функции через props между сервером и клиентом.

import React, { ComponentType, useState, useEffect } from 'react';

export interface LazyComponentProps<T = unknown> {
  /**
   * Функция для динамической загрузки компонента
   */
  loader: () => Promise<{ default: ComponentType<T> }>;

  /**
   * Компонент для отображения во время загрузки
   */
  fallback?: React.ReactNode;

  /**
   * Задержка перед отображением fallback
   * Помогает избежать мигания при быстрой загрузке
   */
  delayMs?: number;

  /**
   * Включить отложенную загрузку
   */
  enabled?: boolean;

  /**
   * Пропсы, передаваемые в загружаемый компонент
   */
  componentProps?: T;

  /**
   * Событие при успешной загрузке компонента
   */
  onLoad?: () => void;

  /**
   * Событие при ошибке загрузки компонента
   */
  onError?: (error: Error) => void;
}

/**
 * Компонент для ленивой загрузки других компонентов
 * Позволяет разделить код на чанки для оптимизации загрузки
 *
 * @example
 * <LazyComponent
 *   loader={() => import('./HeavyComponent')}
 *   fallback={<Spinner />}
 * />
 */
export function LazyComponent<T = unknown>({
  loader,
  fallback = null,
  delayMs = 200,
  enabled = true,
  componentProps,
  onLoad,
  onError,
}: LazyComponentProps<T>) {
  const [Component, setComponent] = useState<ComponentType<T> | null>(null);
  const [loading, setLoading] = useState(enabled);
  const [error, setError] = useState<Error | null>(null);
  const [showFallback, setShowFallback] = useState(false);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    let isMounted = true;
    let timeoutId: NodeJS.Timeout | null = null;

    if (delayMs > 0) {
      timeoutId = setTimeout(() => {
        if (isMounted) {
          setShowFallback(true);
        }
      }, delayMs);
    } else {
      setShowFallback(true);
    }

    loader()
      .then(module => {
        if (isMounted) {
          setComponent(() => module.default);
          setLoading(false);
          onLoad?.();
        }
      })
      .catch((err: unknown) => {
        if (isMounted) {
          const error = err instanceof Error ? err : new Error(String(err));
          setError(error);
          setLoading(false);
          onError?.(error);
        }
      });

    return () => {
      isMounted = false;
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [loader, enabled, delayMs, onLoad, onError]);

  // Отображаем ошибку, если что-то пошло не так
  if (error) {
    return <div className="lazy-component-error">Ошибка загрузки компонента: {error.message}</div>;
  }

  // Если загрузка завершена, отображаем компонент
  if (!loading && Component) {
    if (componentProps) {
      return <Component {...componentProps} />;
    }
    return null;
  }

  // Во время загрузки отображаем fallback
  return showFallback ? <>{fallback}</> : null;
}
