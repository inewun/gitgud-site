/**
 * Базовые типы для domain-модели анонимизации
 */

/**
 * Настройки для процесса анонимизации текста
 * Позволяют выборочно включать или отключать обработку различных типов персональных данных
 *
 * @property {boolean} replaceNames - Заменять ли имена в формате "Имя Фамилия" на маркер [ИМЯ]
 * @property {boolean} replaceEmails - Заменять ли email адреса на маркер [EMAIL]
 * @property {boolean} replacePhones - Заменять ли телефонные номера на маркер [ТЕЛЕФОН]
 * @property {boolean} replaceDates - Заменять ли даты на маркер [ДАТА]
 * @property {boolean} replaceAddresses - Заменять ли адреса на маркер [АДРЕС]
 * @property {boolean} replaceIPs - Заменять ли IP-адреса на маркер [IP-АДРЕС]
 */
export interface UseAnonymizeOptions {
  /** Заменять имена */
  replaceNames?: boolean;
  /** Заменять адреса электронной почты */
  replaceEmails?: boolean;
  /** Заменять телефонные номера */
  replacePhones?: boolean;
  /** Заменять даты */
  replaceDates?: boolean;
  /** Заменять физические адреса */
  replaceAddresses?: boolean;
  /** Заменять IP-адреса */
  replaceIPs?: boolean;
}

/**
 * Структура ошибки процесса анонимизации
 *
 * @property {string} type - Тип ошибки, один из: 'REGEX_ERROR', 'SANITIZE_ERROR', 'VALIDATION_ERROR'
 * @property {string} message - Человекочитаемое сообщение об ошибке
// eslint-disable-next-line @typescript-eslint/no-explicit-any
 * @property {Record<string, any>} details - Дополнительные детали для отладки ошибки
 */
export interface AnonymizeError {
  type: 'REGEX_ERROR' | 'SANITIZE_ERROR' | 'VALIDATION_ERROR';
  message: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  details?: Record<string, any>;
}

/**
 * Настройки для процессинга текста с дополнительными опциями
 *
 * @property {boolean} dates - Обрабатывать ли даты
 * @property {boolean} addresses - Обрабатывать ли адреса
 * @property {boolean} ips - Обрабатывать ли IP-адреса
 */
export interface TextProcessingSettings {
  dates?: boolean;
  addresses?: boolean;
  ips?: boolean;
}

/**
 * Результат анонимизации на уровне domain
 */
export interface DomainAnonymizeResult {
  /** Анонимизированный текст */
  text: string;
  /** Статистика по заменам */
  stats: {
    namesCount: number;
    emailsCount: number;
    phonesCount: number;
    datesCount: number;
    addressesCount: number;
    ipsCount: number;
    total: number;
  };
}
