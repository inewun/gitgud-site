'use client';

import React, { Component, ErrorInfo, ReactNode, useCallback, useState } from 'react';

import { AlertOctagon } from 'lucide-react';

import { ExtendedError } from '@/shared/hooks/useErrorHandler';
import { cn } from '@/shared/lib/utils';
import { withMemo } from '@/shared/lib/utils/memo';
import { typography, containers, states } from '@/styles/compositions';

import { Button } from '../../inputs/button/Button';

/**
 * Пропсы для компонента отображения ошибки
 */
interface ErrorFallbackProps {
  /** Объект ошибки */
  error: Error | ExtendedError;
  /** Обработчик сброса/перезагрузки */
  resetError: () => void;
  /** Дополнительные CSS классы */
  className?: string;
}

/**
 * Компонент отображения ошибки - используется в качестве fallback в ErrorBoundary
 */
const ErrorFallback = withMemo(({ error, resetError, className }: ErrorFallbackProps) => {
  // Проверяем, имеет ли ошибка расширенный формат
  const isExtendedError = 'code' in error;
  const errorMessage = error.message || 'Произошла неизвестная ошибка';
  const errorDetails = isExtendedError
    ? error.details
    : (error as Error & { stack?: string }).stack || 'Нет дополнительной информации об ошибке';

  return (
    <div
      className={cn(containers.card, 'border-destructive', className)}
      role="alert"
      aria-live="assertive"
    >
      <div className="flex items-start gap-3">
        <div className="text-destructive" aria-hidden="true">
          <AlertOctagon size={24} />
        </div>

        <div className="flex-1">
          <h3 className={`${typography.heading3} ${states.error}`}>Произошла ошибка</h3>

          <p className={`${typography.paragraph} mt-2`}>{errorMessage}</p>

          {errorDetails && (
            <details className="mt-3">
              <summary className={`cursor-pointer ${typography.caption}`}>
                Технические детали
              </summary>
              <div className="mt-2 p-3 bg-muted rounded-md">
                <pre className={typography.preformatted}>{errorDetails}</pre>
              </div>
            </details>
          )}

          <div className="mt-4">
            <Button onClick={resetError} variant="default" aria-label="Попробовать снова">
              Попробовать снова
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
});

/**
 * Пропсы для компонента ErrorBoundary
 */
export interface ErrorBoundaryProps {
  /** Дочерние компоненты */
  children: ReactNode;
  /** Компонент для отображения при ошибке */
  fallback?: ReactNode | ((props: { error: Error; resetError: () => void }) => ReactNode);
  /** Обработчик ошибки */
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  /** Дополнительные CSS классы */
  className?: string;
}

/**
 * Состояние компонента ErrorBoundary
 */
interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * Компонент ErrorBoundary для перехвата и обработки ошибок в дочерних компонентах
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   return (
 *     <ErrorBoundary>
 *       Компоненты, которые могут вызвать ошибку
 *     </ErrorBoundary>
 *   );
 * }
 * ```
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // eslint-disable-next-line no-console
    console.error('Ошибка перехвачена ErrorBoundary:', error, errorInfo);

    // Если передан обработчик ошибок, вызываем его
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // Здесь можно отправить ошибку в систему мониторинга
    // reportErrorToService(error, errorInfo);
  }

  resetError = () => {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    this.setState({ hasError: false, error: null });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      // Если передан пользовательский fallback-компонент
      if (this.props.fallback) {
        // Если fallback - функция, вызываем ее с ошибкой и функцией сброса
        if (typeof this.props.fallback === 'function') {
          return this.props.fallback({
            error: this.state.error || new Error('Unknown error'),
            resetError: this.resetError,
          });
        }
        // Иначе просто возвращаем готовый компонент
        return this.props.fallback;
      }

      // Иначе отображаем стандартный компонент ошибки
      return (
        <ErrorFallback
          error={this.state.error || new Error('Unknown error')}
          resetError={this.resetError}
          className={this.props.className}
        />
      );
    }

    return this.props.children;
  }
}

/**
 * Хук-версия ErrorBoundary для функциональных компонентов
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { ErrorBoundary, error, resetError } = useErrorBoundary();
 *
 *   return (
 *     <ErrorBoundary>
 *       Компоненты, которые могут вызвать ошибку
 *     </ErrorBoundary>
 *   );
 * }
 * ```
 */
export function useErrorBoundary() {
  const [error, setError] = useState<Error | null>(null);

  const resetError = useCallback(() => {
    setError(null);
  }, []);

  const ErrorFallbackComponent = useCallback(
    () => (error ? <ErrorFallback error={error} resetError={resetError} /> : null),
    [error, resetError],
  );

  const FunctionalErrorBoundary = useCallback(
    ({ children }: { children: ReactNode }) => {
      if (error) {
        return <ErrorFallbackComponent />;
      }

      return <>{children}</>;
    },
    [error, ErrorFallbackComponent],
  );

  return {
    error,
    setError,
    resetError,
    ErrorBoundary: FunctionalErrorBoundary,
    ErrorFallback: ErrorFallbackComponent,
  };
}
