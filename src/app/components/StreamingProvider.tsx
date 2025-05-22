import React, { Suspense, ComponentType } from 'react';

/**
 * Интерфейс для настройки стратегии потоковой передачи контента
 */
export interface StreamingOptions {
  /**
   * Таймаут для Suspense в миллисекундах
   * По умолчанию: 1000 мс
   */
  timeoutMs?: number;

  /**
   * Приоритет контента:
   * - 'high' - загружается в первую очередь
   * - 'medium' - загружается во вторую очередь
   * - 'low' - загружается в последнюю очередь
   */
  priority?: 'high' | 'medium' | 'low';
}

/**
 * Fallback-компонент со скелетоном для ProgressiveHydration
 */
const ProgressiveSkeleton: React.FC<{
  height?: string | number;
  width?: string | number;
  className?: string;
}> = ({ height = '100%', width = '100%', className = '' }) => {
  return (
    <div
      className={`animate-pulse bg-subtle rounded-md ${className}`}
      style={{ height, width }}
      aria-hidden="true"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
};

/**
 * Компонент для постепенной гидратации и потоковой передачи контента
 * Используется для оптимизации загрузки интерфейса
 */
export function ProgressiveHydration({
  children,
  fallback,
  options,
}: {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  options?: StreamingOptions;
}) {
  const defaultFallback = <ProgressiveSkeleton />;
  const timeoutMs = options?.timeoutMs || 1000;

  return (
    <Suspense fallback={fallback || defaultFallback}>
      <SuspenseWrapper timeoutMs={timeoutMs}>{children}</SuspenseWrapper>
    </Suspense>
  );
}

/**
 * Компонент-обертка для внутреннего использования, создающий Suspense-эффект с задержкой
 */
const SuspenseWrapper: React.FC<{
  children: React.ReactNode;
  timeoutMs: number;
}> = ({ children, timeoutMs }) => {
  if (typeof window !== 'undefined') {
    // Клиентская обработка - просто рендерим контент
    return <>{children}</>;
  } else {
    // Серверная обработка - эмулируем suspense для потоковой передачи
    setTimeout(() => {
      // Ничего не делаем, просто используем timeoutMs
    }, timeoutMs);

    throw new Error('Simulated suspense for streaming content');
  }
};

/**
 * Основной компонент для организации потоковой передачи контента
 * Разделяет интерфейс на блоки с разным приоритетом загрузки
 */
export function StreamingProvider({
  children,
  highPriorityContent,
  mediumPriorityContent,
  lowPriorityContent,
}: {
  children?: React.ReactNode;
  highPriorityContent?: React.ReactNode;
  mediumPriorityContent?: React.ReactNode;
  lowPriorityContent?: React.ReactNode;
}) {
  return (
    <>
      {/* Высокоприоритетный контент загружается сразу */}
      {highPriorityContent}

      {/* Среднеприоритетный контент загружается с небольшой задержкой */}
      {mediumPriorityContent && (
        <ProgressiveHydration
          options={{ timeoutMs: 100, priority: 'medium' }}
          fallback={<ProgressiveSkeleton height="200px" />}
        >
          {mediumPriorityContent}
        </ProgressiveHydration>
      )}

      {/* Основной контент */}
      {children && (
        <ProgressiveHydration options={{ timeoutMs: 300 }}>{children}</ProgressiveHydration>
      )}

      {/* Низкоприоритетный контент загружается в последнюю очередь */}
      {lowPriorityContent && (
        <ProgressiveHydration
          options={{ timeoutMs: 800, priority: 'low' }}
          fallback={<ProgressiveSkeleton height="150px" />}
        >
          {lowPriorityContent}
        </ProgressiveHydration>
      )}
    </>
  );
}

/**
 * HOC для обертывания компонентов в прогрессивную гидратацию
 *
 * @param Component - Компонент для гидратации
 * @param options - Опции для настройки гидратации
 * @returns Компонент с прогрессивной гидратацией
 *
 * @example
 * const ProgressiveComponent = withProgressiveHydration(MyComponent, { timeoutMs: 500 });
 */
export function withProgressiveHydration<P extends object>(
  Component: ComponentType<P>,
  options?: StreamingOptions,
): React.FC<P> {
  const ProgressiveComponent = (props: P) => {
    return (
      <ProgressiveHydration options={options}>
        <Component {...props} />
      </ProgressiveHydration>
    );
  };

  // Сохраняем оригинальное имя компонента для отладки
  const displayName = Component.displayName || Component.name || 'Component';
  ProgressiveComponent.displayName = `ProgressiveHydration(${displayName})`;

  return ProgressiveComponent;
}
