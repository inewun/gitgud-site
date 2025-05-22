/**
 * Опции, передаваемые в функцию анонимизации или хук useAnonymize.
 * Определяют, какие типы данных нужно анонимизировать.
 */
import { useState, useCallback } from 'react';

import { anonymize } from '../core/anonymizer';

export interface UseAnonymizeOptions {
  /** Анонимизировать адреса электронной почты */
  anonymizeEmails?: boolean;
  /** Анонимизировать номера телефонов */
  anonymizePhones?: boolean;
  /** Анонимизировать имена (если возможно определить) */
  anonymizeNames?: boolean;
  /** Анонимизировать числовые последовательности (например, ID, номера карт) */
  anonymizeNumbers?: boolean;
  /** Заменять найденные данные плейсхолдером */
  replacementPlaceholder?: string;
  // Добавьте другие опции по мере необходимости
}

/**
 * Хук для анонимизации текста в UI-слое, использующий опции UI формата
 * @param options Настройки анонимизации
 * @returns Функции и состояние для работы с анонимизацией
 */
export const useAnonymize = (options: Partial<UseAnonymizeOptions> = {}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const anonymizeText = useCallback(
    (text: string): string => {
      if (!text) return '';

      setIsProcessing(true);
      setError(null);

      try {
        const result = anonymize(text, options);
        return result.anonymizedText;
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Ошибка при анонимизации'));
        return text;
      } finally {
        setIsProcessing(false);
      }
    },
    [options],
  );

  return {
    anonymizeText,
    isProcessing,
    error,
  };
};
