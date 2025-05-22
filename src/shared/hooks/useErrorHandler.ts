'use client';

import { useState, useCallback, useEffect } from 'react';

/**
 * Интерфейс ошибки с поддержкой подробностей
 */
export interface ExtendedError {
  code?: string;
  message: string;
  details?: string;
  statusCode?: number;
}

/**
 * Интерфейс настроек для хука обработки ошибок
 */
export interface ErrorHandlerOptions {
  /** Таймаут для автоматического очищения ошибок (в миллисекундах) */
  autoResetTimeout?: number;
  /** Обработчик, вызываемый при возникновении ошибки */
  onError?: (error: ExtendedError) => void;
  /** Логировать ошибки в консоль */
  logErrors?: boolean;
  /** Отправлять ошибки в систему мониторинга */
  reportErrors?: boolean;
}

/**
 * Хук для универсальной обработки ошибок в компонентах
 *
 * @param options - настройки обработчика ошибок
 * @returns методы для управления ошибками
 *
 * @example
 * ```tsx
 * const { error, setError, clearError, handleError } = useErrorHandler({
 *   autoResetTimeout: 5000,
 *   logErrors: true
 * });
 *
 * // Использование в обработчике события
 * const handleSubmit = async (data) => {
 *   try {
 *     await submitData(data);
 *   } catch (err) {
 *     handleError(err);
 *   }
 * };
 *
 * // Отображение ошибки в UI
 * {error && <ErrorDisplay error={error} onDismiss={clearError} />}
 * ```
 */
export function useErrorHandler(options: ErrorHandlerOptions = {}) {
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  const { autoResetTimeout, onError, logErrors = true, reportErrors = false } = options;

  // Состояние ошибки
  const [error, setError] = useState<ExtendedError | null>(null);

  // Очистка ошибки
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Форматирование и установка ошибки
  const handleError = useCallback(
    (err: unknown) => {
      const formattedError = formatError(err);

      // Логирование ошибки в консоль
      if (logErrors) {
        // eslint-disable-next-line no-console
        console.error('Ошибка обработана useErrorHandler:', formattedError);
      }

      // Отправка в систему мониторинга, если включено
      if (reportErrors) {
        // Здесь можно интегрировать с сервисом мониторинга, например Sentry
        // reportErrorToMonitoring(formattedError);
      }

      // Установка ошибки в состояние
      setError(formattedError);

      // Вызов дополнительного обработчика, если предоставлен
      if (onError) {
        onError(formattedError);
      }
    },
    [logErrors, onError, reportErrors],
  );

  // Автоматический сброс ошибки через указанное время
  useEffect(() => {
    if (error && autoResetTimeout) {
      const timer = setTimeout(clearError, autoResetTimeout);
      return () => {
        clearTimeout(timer);
      };
    }
  }, [error, autoResetTimeout, clearError]);

  return {
    error,
    setError,
    clearError,
    handleError,
  };
}

/**
 * Форматирует различные типы ошибок в унифицированный формат
 */
function formatError(error: unknown): ExtendedError {
  // Если ошибка уже соответствует нашему формату
  if (error && typeof error === 'object' && 'message' in error) {
    const errObj = error as Partial<ExtendedError>;

    return {
      code: errObj.code || 'ERROR',
      message: errObj.message || 'Произошла неизвестная ошибка',
      details: errObj.details,
      statusCode: errObj.statusCode,
    };
  }

  // Для стандартных ошибок JavaScript
  if (error instanceof Error) {
    return {
      code: 'ERROR',
      message: error.message,
      details: error.stack,
    };
  }

  // Для ошибок с кодом HTTP статуса
  if (typeof error === 'object' && error && 'status' in error) {
    const httpError = error as { status: number; statusText?: string; message?: string };

    return {
      code: `HTTP_ERROR_${httpError.status}`,
      message: httpError.message || httpError.statusText || `Ошибка HTTP ${httpError.status}`,
      statusCode: httpError.status,
    };
  }

  // Для строковых ошибок
  if (typeof error === 'string') {
    return {
      code: 'ERROR',
      message: error,
    };
  }

  // Для всех остальных типов
  return {
    code: 'UNKNOWN_ERROR',
    message: 'Произошла неизвестная ошибка',
    details: JSON.stringify(error),
  };
}
