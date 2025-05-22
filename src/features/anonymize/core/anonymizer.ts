import { anonymizeText as domainAnonymizeText } from '@/domain/anonymize/model';
import type { UseAnonymizeOptions } from '@/domain/anonymize/types';
import type { UseAnonymizeOptions as UIAnonymizeOptions } from '@/features/anonymize/hooks/useAnonymize';

/**
 * Определяет, использует ли объект с опциями формат UI-слоя
 */
const isUIOptions = (options: Partial<UseAnonymizeOptions | UIAnonymizeOptions>): boolean => {
  return (
    'anonymizeNames' in options || 'anonymizeEmails' in options || 'anonymizePhones' in options
  );
};

/**
 * Преобразует опции из UI-формата в формат домена
 */
const convertOptions = (
  options: Partial<UseAnonymizeOptions | UIAnonymizeOptions>,
): Partial<UseAnonymizeOptions> => {
  const hasUIFormat = isUIOptions(options);

  return {
    replaceNames: hasUIFormat
      ? (options as UIAnonymizeOptions).anonymizeNames
      : (options as UseAnonymizeOptions).replaceNames ?? true,
    replaceEmails: hasUIFormat
      ? (options as UIAnonymizeOptions).anonymizeEmails
      : (options as UseAnonymizeOptions).replaceEmails ?? true,
    replacePhones: hasUIFormat
      ? (options as UIAnonymizeOptions).anonymizePhones
      : (options as UseAnonymizeOptions).replacePhones ?? true,
    replaceDates: (options as UseAnonymizeOptions).replaceDates ?? false,
    replaceAddresses: (options as UseAnonymizeOptions).replaceAddresses ?? false,
    replaceIPs: (options as UseAnonymizeOptions).replaceIPs ?? false,
  };
};

/**
 * Рассчитывает метаданные по анонимизированному тексту
 */
const calculateMetadata = (anonymizedText: string): Record<string, number> => {
  const namesCount = (anonymizedText.match(/\[ИМЯ\]/g) || []).length;
  const emailsCount = (anonymizedText.match(/\[EMAIL\]/g) || []).length;
  const phonesCount = (anonymizedText.match(/\[ТЕЛЕФОН\]/g) || []).length;
  const datesCount = (anonymizedText.match(/\[ДАТА\]/g) || []).length;
  const addressesCount = (anonymizedText.match(/\[АДРЕС\]/g) || []).length;
  const ipsCount = (anonymizedText.match(/\[IP-АДРЕС\]/g) || []).length;

  const totalReplacements =
    namesCount + emailsCount + phonesCount + datesCount + addressesCount + ipsCount;

  return {
    namesCount,
    emailsCount,
    phonesCount,
    datesCount,
    addressesCount,
    ipsCount,
    totalReplacements,
  };
};

/**
 * Адаптер для функции анонимизации, который вызывает domain-функцию
 * и адаптирует результат к формату UI-слоя.
 *
 * @param text Исходный текст.
 * @param options Опции анонимизации.
 * @returns Объект с анонимизированным текстом и метаданными.
 */
export const anonymize = (
  text: string,
  options: Partial<UseAnonymizeOptions | UIAnonymizeOptions> = {},
): { anonymizedText: string; metadata: Record<string, number> } => {
  // Преобразуем UI-опции в Domain-опции
  const domainOptions = convertOptions(options);

  // Вызываем domain-функцию
  let anonymizedText = '';
  try {
    anonymizedText = domainAnonymizeText(text, domainOptions);
  } catch (error) {
    console.error('Ошибка при анонимизации текста:', error);
    // В случае ошибки возвращаем исходный текст
    anonymizedText = text;
  }

  // Создаем объект метаданных с нулевыми значениями
  const metadata: Record<string, number> = {
    namesCount: 0,
    emailsCount: 0,
    phonesCount: 0,
    datesCount: 0,
    addressesCount: 0,
    ipsCount: 0,
    totalReplacements: 0,
  };

  // Безопасно считаем статистику, проверяя тип
  if (typeof anonymizedText === 'string') {
    Object.assign(metadata, calculateMetadata(anonymizedText));
  }

  return { anonymizedText, metadata };
};
