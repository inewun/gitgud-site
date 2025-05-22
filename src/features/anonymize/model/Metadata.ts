/**
 * Метаданные и константы фичи анонимизации
 */

/**
 * Доступные типы контента для анонимизации
 */
export const ANONYMIZE_CONTENT_TYPES = ['TEXT', 'EMAIL', 'DOCUMENT'] as const;

export type AnonymizeContentType = (typeof ANONYMIZE_CONTENT_TYPES)[number];

/**
 * Уровни безопасности анонимизации
 */
export const ANONYMIZE_SECURITY_LEVELS = ['BASIC', 'ADVANCED', 'MAXIMUM'] as const;

export type AnonymizeSecurityLevel = (typeof ANONYMIZE_SECURITY_LEVELS)[number];

/**
 * Описание функций анонимизации для UI
 */
export const ANONYMIZE_FEATURE_DESCRIPTIONS = {
  replaceNames: {
    title: 'Анонимизация имен',
    description: 'Замена полных имен на маркер [ИМЯ]',
    isDefault: true,
  },
  replaceEmails: {
    title: 'Анонимизация email-адресов',
    description: 'Замена email-адресов на маркер [EMAIL]',
    isDefault: true,
  },
  replacePhones: {
    title: 'Анонимизация телефонов',
    description: 'Замена телефонных номеров на маркер [ТЕЛЕФОН]',
    isDefault: true,
  },
  replaceDates: {
    title: 'Анонимизация дат',
    description: 'Замена дат на маркер [ДАТА]',
    isDefault: false,
  },
  replaceAddresses: {
    title: 'Анонимизация адресов',
    description: 'Замена физических адресов на маркер [АДРЕС]',
    isDefault: false,
  },
  replaceIPs: {
    title: 'Анонимизация IP-адресов',
    description: 'Замена IP-адресов на маркер [IP-АДРЕС]',
    isDefault: false,
  },
};
