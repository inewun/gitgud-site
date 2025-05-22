/**
 * Опции для настройки процесса анонимизации
 */
export interface UseAnonymizeOptions {
  /** Заменять ли имена в тексте */
  replaceNames?: boolean;
  /** Заменять ли email-адреса в тексте */
  replaceEmails?: boolean;
  /** Заменять ли телефонные номера в тексте */
  replacePhones?: boolean;
}

/**
 * Типы ошибок, которые могут возникнуть при анонимизации
 */
export type AnonymizeErrorType = 'REGEX_ERROR' | 'SANITIZE_ERROR' | 'INPUT_ERROR' | 'UNKNOWN_ERROR';

/**
 * Структура ошибки анонимизации
 */
export interface AnonymizeError {
  /** Тип ошибки */
  type: AnonymizeErrorType;
  /** Сообщение об ошибке */
  message: string;
  /** Дополнительные детали ошибки */
  details?: Record<string, unknown>;
}

/**
 * Интерфейс сервиса для анонимизации текста
 * Используется для dependency injection
 */
export interface AnonymizeService {
  /**
   * Анонимизирует текст, заменяя персональные данные на маркеры
   * @param text Текст для анонимизации
   * @param options Опции анонимизации
   * @returns Анонимизированный текст
   */
  anonymizeText(text: string, options?: UseAnonymizeOptions): string;

  /**
   * Санитизирует пользовательский ввод
   * @param input Текст для санитизации
   * @returns Санитизированный текст
   */
  sanitizeInput(input: string): string;
}
