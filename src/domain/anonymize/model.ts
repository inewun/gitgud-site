import { UseAnonymizeOptions } from './types';

/**
 * Регулярные выражения для поиска персональных данных в тексте
 *
 * @property {RegExp} names - Находит полные имена в формате "Иванов Иван Иванович" или "Иванов И.И." с учетом кириллицы и латиницы
 * @property {RegExp} emails - Находит email адреса в различных форматах (username@domain.zone)
 * @property {RegExp} phones - Находит телефонные номера в различных форматах (+7 (123) 456-78-90, 8 123 456 78 90, и т.д.)
 * @property {RegExp} dates - Находит даты в формате ДД.ММ.ГГГГ, ДД-ММ-ГГГГ или ДД/ММ/ГГГГ
 * @property {RegExp} addresses - Находит адреса в формате "г. Москва, Ленинская ул. 10"
 * @property {RegExp} ips - Находит IP-адреса в формате IPv4 (123.123.123.123)
 */
export const REGEX_PATTERNS = {
  names: /(?<!\w)([A-ZА-Я][a-zа-я]+)\s+(?:([A-ZА-Я])[a-zа-я]*\.?\s+)?([A-ZА-Я][a-zа-я]+)(?!\w)/g,
  emails: /(?<!\w)[\w.+-]+@(?:[\w-]+\.)+[\w-]{2,63}(?!\w)/g,
  phones:
    /(?<!\w)(?:\+?\d{1,3}[-.\s]?)?\(?(?:\d{1,4})\)?[-.\s]?(?:\d{1,4})[-.\s]?(?:\d{1,9})(?!\w)/g,
  dates: /(?<!\d)(\d{1,2}[./-]\d{1,2}[./-]\d{2,4})(?!\d)/g,
  addresses: /г\.\s*[А-Я][а-я]+,\s+[А-Я][а-я]+\s+ул\.\s+\d+/g,
  ips: /\b((?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?))\b/g,
};

/**
 * Анонимизирует текст, заменяя персональные данные маркерами
 * @param text Исходный текст для анонимизации
 * @param options Настройки для выборочной анонимизации
 * @returns Анонимизированный текст
 */
export const anonymizeText = (text: string, options: Partial<UseAnonymizeOptions> = {}): string => {
  const {
    replaceNames = true,
    replaceEmails = true,
    replacePhones = true,
    replaceDates = false,
    replaceAddresses = false,
    replaceIPs = false,
  } = options;

  let anonymized = text;

  // Заменяем имена
  if (replaceNames) {
    try {
      anonymized = anonymized.replace(REGEX_PATTERNS.names, '[ИМЯ]');
    } catch (regexError) {
      throw new Error('Ошибка при обработке имен');
    }
  }

  // Заменяем email-адреса
  if (replaceEmails) {
    try {
      anonymized = anonymized.replace(REGEX_PATTERNS.emails, '[EMAIL]');
    } catch (regexError) {
      throw new Error('Ошибка при обработке email-адресов');
    }
  }

  // Заменяем даты - должны обрабатываться перед телефонами и IP
  if (replaceDates) {
    try {
      anonymized = anonymized.replace(REGEX_PATTERNS.dates, '[ДАТА]');
    } catch (regexError) {
      throw new Error('Ошибка при обработке дат');
    }
  }

  // Заменяем IP-адреса - должны обрабатываться перед телефонами
  if (replaceIPs) {
    try {
      anonymized = anonymized.replace(REGEX_PATTERNS.ips, '[IP-АДРЕС]');
    } catch (regexError) {
      throw new Error('Ошибка при обработке IP-адресов');
    }
  }

  // Заменяем телефоны
  if (replacePhones) {
    try {
      anonymized = anonymized.replace(REGEX_PATTERNS.phones, '[ТЕЛЕФОН]');
    } catch (regexError) {
      throw new Error('Ошибка при обработке телефонных номеров');
    }
  }

  // Заменяем адреса
  if (replaceAddresses) {
    try {
      anonymized = anonymized.replace(REGEX_PATTERNS.addresses, '[АДРЕС]');
    } catch (regexError) {
      throw new Error('Ошибка при обработке адресов');
    }
  }

  return anonymized;
};
