'use client';

import { useState, useCallback } from 'react';

import { anonymizeText, UseAnonymizeOptions, AnonymizeError } from '@/domain/anonymize';
import { apiFacade } from '@/services/api.facade';
// Для обратной совместимости с типами из /types
import type { AnonymizeService } from '@/types/anonymize';

interface UseAnonymizeProps {
  /**
   * Сервис для анонимизации, который будет использоваться
   * По умолчанию используется apiFacade
   */
  anonymizeService?: AnonymizeService;
  /**
   * Настройки для выборочной анонимизации определенных типов данных
   */
  options?: Partial<UseAnonymizeOptions>;
}

/**
 * Хук для анонимизации текста, содержащего персональные данные
 * @param props Настройки для выборочной анонимизации и сервис
 * @returns Объект с функцией анонимизации и состояниями процесса
 */
export const useAnonymize = (props: UseAnonymizeProps | Partial<UseAnonymizeOptions> = {}) => {
  // Обеспечиваем обратную совместимость, определяя тип входных параметров
  const isLegacyOptions =
    'replaceNames' in props || 'replaceEmails' in props || 'replacePhones' in props;

  const anonymizeService = isLegacyOptions
    ? apiFacade
    : (props as UseAnonymizeProps).anonymizeService || apiFacade;

  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<AnonymizeError | null>(null);

  /**
   * Обрабатывает ошибки анонимизации и устанавливает соответствующее состояние ошибки
   */
  const handleError = useCallback((err: unknown): void => {
    // Преобразуем ошибки к типу AnonymizeError для обратной совместимости
    if (err instanceof Error) {
      setError({
        type: 'VALIDATION_ERROR',
        message: err.message,
      });
    } else if (typeof err === 'object' && err !== null && 'type' in err) {
      // Это уже может быть ошибка AnonymizeError
      setError(err as AnonymizeError);
    } else {
      // Неизвестная ошибка
      setError({
        type: 'VALIDATION_ERROR',
        message: 'Произошла неизвестная ошибка при анонимизации',
      });
    }
  }, []);

  /**
   * Анонимизирует текст, заменяя персональные данные маркерами
   * @param text Исходный текст для анонимизации
   * @returns Анонимизированный текст
   */
  const handleAnonymizeText = useCallback(
    (text: string): string => {
      if (!text) return '';

      // Перемещено внутрь useCallback для устранения предупреждения зависимостей
      const currentOptions = isLegacyOptions ? props : (props as UseAnonymizeProps).options || {};

      try {
        setIsProcessing(true);
        setError(null);

        let anonymized = '';

        if (typeof anonymizeService.anonymizeText === 'function') {
          anonymized = anonymizeService.anonymizeText(text, currentOptions);
        } else {
          // Преобразуем частичные параметры в полные с дефолтными значениями
          const fullOptions: UseAnonymizeOptions = {
            replaceNames: currentOptions.replaceNames ?? true,
            replaceEmails: currentOptions.replaceEmails ?? true,
            replacePhones: currentOptions.replacePhones ?? true,
            replaceDates: currentOptions.replaceDates ?? false,
            replaceAddresses: currentOptions.replaceAddresses ?? false,
            replaceIPs: currentOptions.replaceIPs ?? false,
          };

          anonymized = anonymizeText(text, fullOptions);
        }

        return anonymized;
      } catch (err) {
        handleError(err);
        return text;
      } finally {
        setIsProcessing(false);
      }
    },
    [props, isLegacyOptions, anonymizeService, handleError],
  );

  return {
    anonymizeText: handleAnonymizeText,
    isProcessing,
    error,
  };
};

export default useAnonymize;
