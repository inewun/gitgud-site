import * as DOMPurifyModule from 'dompurify';

import { isServer } from '@/shared/lib/utils/dom';

import { createError, ErrorType } from './errors';

// Типизированный доступ к DOMPurify
interface DOMPurifyType {
  sanitize: (
    input: string,
    options?: {
      ALLOWED_TAGS?: string[];
      ALLOWED_ATTR?: string[];
    },
  ) => string;
}

// Используем безопасное приведение типов с учетом серверного окружения
const DOMPurify = (() => {
  // На сервере JSDOM не доступен
  if (isServer()) {
    // Создаем заглушку для серверного рендеринга
    return {
      sanitize: (html: string) => html.replace(/<\/?[^>]+(>|$)/g, ''), // Простое удаление HTML тегов
    } as DOMPurifyType;
  }

  // На клиенте используем DOMPurify
  return (
    (DOMPurifyModule as unknown as { default?: DOMPurifyType }).default ||
    (DOMPurifyModule as unknown as DOMPurifyType)
  );
})();

/**
 * Интерфейс для ошибок, связанных с санитизацией
 * @deprecated используйте AppError
 */
export interface SanitizeError {
  type: string;
  message: string;
  details?: {
    error: unknown;
  };
}

/**
 * Безопасное приведение к строке для результата санитизации
 */
function safeToString(value: unknown): string {
  if (typeof value === 'string') {
    return value;
  }

  // Проверяем, имеет ли объект метод toString
  if (value !== null && typeof value === 'object') {
    return String(value);
  }

  return String(value);
}

/**
 * Санитизирует пользовательский ввод для предотвращения XSS атак
 * @param input Текст для санитизации
 * @returns Очищенный текст
 * @throws {AppError} Ошибка при санитизации
 */
export const sanitizeInput = (input: unknown): string => {
  try {
    // Проверяем на null и undefined
    if (input === null || input === undefined) {
      return '';
    }

    // Конвертируем любой вход в строку
    const inputStr = String(input);

    // Используем dompurify для очистки HTML и потенциальных XSS
    // Удаляем все HTML теги, но сохраняем их содержимое
    const config = {
      ALLOWED_TAGS: [], // Запрещаем все HTML теги
    };

    const sanitized = DOMPurify.sanitize(inputStr, config);

    // Безопасно приводим результат к строке
    return safeToString(sanitized);
  } catch (error) {
    throw createError({
      type: ErrorType.VALIDATION,
      message: 'Ошибка при санитизации ввода',
      details: { error },
    });
  }
};
