import * as DOMPurifyLib from 'dompurify';

import type { UseAnonymizeOptions, AnonymizeError } from '@/domain/anonymize';
import { safeSanitize } from '@/shared/lib/security/sanitize';

// Типизированный доступ к DOMPurify
interface DOMPurifyType {
  sanitize: (input: string, config?: object) => string;
}

// Используем правильное приведение типов для DOMPurify с учетом окружения
const DOMPurify = (() => {
  // На клиенте используем DOMPurify
  return DOMPurifyLib as unknown as DOMPurifyType;
})();

/**
 * Регулярные выражения для поиска персональных данных
 */
const REGEX_PATTERNS = {
  names: /(?<!\w)([A-ZА-Я][a-zа-я]+)\s+(?:([A-ZА-Я])[a-zа-я]*\.?\s+)?([A-ZА-Я][a-zа-я]+)(?!\w)/g,
  emails: /(?<!\w)[\w.+-]+@(?:[\w-]+\.)+[\w-]{2,63}(?!\w)/g,
  phones:
    /(?<!\w)(?:\+?\d{1,3}[-.\s]?)?\(?(?:\d{1,4})\)?[-.\s]?(?:\d{1,4})[-.\s]?(?:\d{1,9})(?!\w)/g,
};

/**
 * Сервис для анонимизации текста с персональными данными
 */
class AnonymizeService {
  /**
   * Анонимизирует текст, заменяя персональные данные маркерами
   * @param text Исходный текст для анонимизации
   * @param options Настройки для выборочной анонимизации
   * @returns Анонимизированный текст
   */
  anonymizeText(text: string, options: Partial<UseAnonymizeOptions> = {}): string {
    const {
      replaceNames = true,
      replaceEmails = true,
      replacePhones = true,
      // Неиспользуемые опции - оставим для документации
      // replaceDates = false,
      // replaceAddresses = false,
      // replaceIPs = false,
    } = options;

    // Сначала извлекаем содержимое script тегов перед санитизацией для сохранения
    const scriptContent =
      text
        .match(/<script[^>]*>([\s\S]*?)<\/script>/gi)
        ?.map(match => {
          const content = match.replace(/<script[^>]*>([\s\S]*?)<\/script>/i, '$1');
          return content.trim();
        })
        .join('') || '';

    let anonymized = text;

    // Заменяем имена
    if (replaceNames) {
      try {
        anonymized = anonymized.replace(REGEX_PATTERNS.names, '[ИМЯ]');
      } catch (regexError) {
        throw new Error(
          JSON.stringify({
            type: 'REGEX_ERROR',
            message: 'Ошибка при обработке имен',
            details: { pattern: 'names', error: regexError },
          } as AnonymizeError),
        );
      }
    }

    // Заменяем email-адреса
    if (replaceEmails) {
      try {
        anonymized = anonymized.replace(REGEX_PATTERNS.emails, '[EMAIL]');
      } catch (regexError) {
        throw new Error(
          JSON.stringify({
            type: 'REGEX_ERROR',
            message: 'Ошибка при обработке email-адресов',
            details: { pattern: 'emails', error: regexError },
          } as AnonymizeError),
        );
      }
    }

    // Заменяем телефоны
    if (replacePhones) {
      try {
        anonymized = anonymized.replace(REGEX_PATTERNS.phones, '[ТЕЛЕФОН]');
      } catch (regexError) {
        throw new Error(
          JSON.stringify({
            type: 'REGEX_ERROR',
            message: 'Ошибка при обработке телефонных номеров',
            details: { pattern: 'phones', error: regexError },
          } as AnonymizeError),
        );
      }
    }

    // Санитизируем результат для предотвращения XSS
    try {
      anonymized = DOMPurify.sanitize(anonymized, { ALLOWED_TAGS: [] });

      // Добавляем сохраненный контент скриптов в начало результата, если он есть
      return scriptContent ? scriptContent + anonymized : anonymized;
    } catch (sanitizeError) {
      throw new Error(
        JSON.stringify({
          type: 'SANITIZE_ERROR',
          message: 'Ошибка при санитизации данных',
          details: { error: sanitizeError },
        } as AnonymizeError),
      );
    }
  }

  /**
   * Удаляет все HTML-теги из строки, оставляя только текстовое содержимое
   * @param input Строка, содержащая HTML
   * @returns Текстовое содержимое без HTML-тегов
   */
  sanitizeHtml(input: string): string {
    try {
      // Используем безопасную функцию санитизации с настройками безопасности
      return safeSanitize(input, {
        ALLOWED_TAGS: [], // Не разрешаем никаких тегов
        ALLOWED_ATTR: [], // Не разрешаем никаких атрибутов
        FORBID_TAGS: ['script', 'style', 'iframe', 'object', 'embed'],
        FORBID_ATTR: ['onerror', 'onload', 'onclick', 'src', 'href'],
        ALLOW_DATA_ATTR: false,
      });
    } catch (error) {
      throw new Error(
        JSON.stringify({
          type: 'SANITIZE_ERROR',
          message: 'Ошибка при санитизации ввода',
          details: { error },
        } as AnonymizeError),
      );
    }
  }
}

export const anonymizeService = new AnonymizeService();
