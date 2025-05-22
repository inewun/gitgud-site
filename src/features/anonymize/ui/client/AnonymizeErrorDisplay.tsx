'use client';

import React from 'react';

import { withMemo } from '@/shared/lib/utils/memo';
import { Button } from '@/shared/ui/inputs/button';
import { states, typography, containers } from '@/styles/compositions';

// Типы ошибок анонимизации
export enum AnonymizeErrorType {
  VALIDATION = 'validation',
  NETWORK = 'network',
  SERVER = 'server',
  UNAUTHORIZED = 'unauthorized',
  UNKNOWN = 'unknown',
}

// Интерфейс ошибки
export interface AnonymizeError {
  type: AnonymizeErrorType;
  message: string;
  details?: string;
  statusCode?: number;
}

// Свойства компонента
export interface AnonymizeErrorDisplayProps {
  error: AnonymizeError;
  onRetry?: () => void;
  onReset?: () => void;
  className?: string;
}

// Компонент отображения ошибок
const AnonymizeErrorDisplayBase: React.FC<AnonymizeErrorDisplayProps> = ({
  error,
  onRetry,
  onReset,
  className,
}) => {
  // Определяем заголовок на основе типа ошибки
  const getTitleByErrorType = (type: AnonymizeErrorType): string => {
    switch (type) {
      case AnonymizeErrorType.VALIDATION:
        return 'Ошибка валидации данных';
      case AnonymizeErrorType.NETWORK:
        return 'Ошибка сети';
      case AnonymizeErrorType.SERVER:
        return 'Ошибка сервера';
      case AnonymizeErrorType.UNAUTHORIZED:
        return 'Необходима авторизация';
      case AnonymizeErrorType.UNKNOWN:
      default:
        return 'Что-то пошло не так';
    }
  };

  // Определяем иконку ошибки
  const getIconByErrorType = (type: AnonymizeErrorType) => {
    switch (type) {
      case AnonymizeErrorType.VALIDATION:
        return '⚠️';
      case AnonymizeErrorType.NETWORK:
        return '🌐';
      case AnonymizeErrorType.SERVER:
        return '🖥️';
      case AnonymizeErrorType.UNAUTHORIZED:
        return '🔒';
      case AnonymizeErrorType.UNKNOWN:
      default:
        return '❌';
    }
  };

  // Главный заголовок ошибки
  const errorTitle = getTitleByErrorType(error.type);

  // Иконка ошибки
  const errorIcon = getIconByErrorType(error.type);

  // Код статуса HTTP (если есть)
  const statusCodeLabel = error.statusCode ? `Код ошибки: ${error.statusCode}` : null;

  return (
    <div
      className={`rounded-lg border p-4 bg-error-bg ${className}`}
      role="alert"
      aria-live="assertive"
    >
      <div className="flex items-start space-x-4">
        <div className={typography.heading3} aria-hidden="true">
          {errorIcon}
        </div>

        <div className="flex-1">
          <h3 className={`${typography.heading4} ${states.error}`}>{errorTitle}</h3>

          <p className={typography.paragraph}>{error.message}</p>

          {error.details && (
            <details className="mt-2">
              <summary className={typography.caption}>Подробности</summary>
              <div className={containers.resultContainer}>
                <code className="whitespace-pre-wrap">{error.details}</code>
              </div>
            </details>
          )}

          {statusCodeLabel && <p className={typography.caption}>{statusCodeLabel}</p>}

          {(onRetry || onReset) && (
            <div className="mt-4 flex flex-wrap gap-3">
              {onRetry && (
                <Button onClick={onRetry} size="sm" variant="secondary">
                  Повторить
                </Button>
              )}

              {onReset && (
                <Button onClick={onReset} size="sm" variant="outline">
                  Сбросить
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

AnonymizeErrorDisplayBase.displayName = 'AnonymizeErrorDisplay';

export const AnonymizeErrorDisplay = withMemo(AnonymizeErrorDisplayBase);
