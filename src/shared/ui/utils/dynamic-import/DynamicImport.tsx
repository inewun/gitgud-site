'use client';
// ВАЖНО: Этот компонент должен использоваться только внутри клиентских компонентов!
// Не передавайте функции через props между сервером и клиентом.

import React, { useState, useEffect } from 'react';

export interface DynamicImportProps {
  /**
   * Путь к импортируемому модулю
   */
  src: string;

  /**
   * Компонент для отображения во время загрузки
   */
  loading?: React.ReactNode;

  /**
   * Начать загрузку сразу
   */
  preload?: boolean;

  /**
   * Приоритет загрузки (для оптимизации веб-витальных)
   */
  priority?: 'high' | 'low' | 'auto';

  /**
   * Рендер-проп для отображения загруженного модуля
   */
  children: (module: unknown) => React.ReactNode;

  /**
   * Обработчик ошибок при загрузке
   */
  onError?: (error: Error) => void;
}

/**
 * Компонент для динамического импорта модулей
 * Позволяет загружать код только когда он нужен
 *
 * @example
 * <DynamicImport
 *   src="./charts"
 *   loading={<div>Загрузка графиков...</div>}
 * >
 *   {(Charts) => <Charts.LineChart data={data} />}
 * </DynamicImport>
 */
export function DynamicImport({
  src,
  loading = null,
  preload = false,
  priority = 'auto',
  children,
  onError,
}: DynamicImportProps) {
  const [module, setModule] = useState<unknown>(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!preload) {
      return;
    }

    let isMounted = true;

    const importModule = async () => {
      try {
        // Динамический импорт модуля
        const importedModule = (await import(/* webpackIgnore: true */ src)) as unknown;
        if (isMounted) {
          setModule(importedModule);
        }
      } catch (err) {
        if (isMounted) {
          const error = err instanceof Error ? err : new Error(String(err));
          setError(error);
          onError?.(error);
        }
      }
    };

    // Используем requestIdleCallback для низкого приоритета
    if (priority === 'low' && typeof window !== 'undefined' && 'requestIdleCallback' in window) {
      void (
        window as Window & { requestIdleCallback?: (cb: () => void) => void }
      ).requestIdleCallback(() => {
        void importModule();
      });
    } else {
      void importModule();
    }

    return () => {
      isMounted = false;
    };
  }, [src, preload, priority, onError]);

  // Если произошла ошибка, показываем сообщение
  if (error) {
    return <div className="dynamic-import-error">Ошибка загрузки модуля: {error.message}</div>;
  }

  // Если модуль загружен, вызываем рендер-функцию
  if (module) {
    return <>{children(module)}</>;
  }

  // В процессе загрузки показываем loader
  return <>{loading}</>;
}
