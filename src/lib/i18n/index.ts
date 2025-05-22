import type { IntlShape } from '@formatjs/intl';

// Типы для различных форм множественного числа
// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface PluralRules {
  one: string;
  few?: string;
  many?: string;
  other: string;
}

// Интерфейс для всех поддерживаемых локализаций
export interface Localization {
  locale: string;
  messages: Record<string, string>;
}

// Кеш для интернационализации
const intlCache: Record<string, IntlShape> = {};

// Вспомогательная функция для загрузки файлов локализации
function importLocaleFiles(_pattern: string) {
  // Реализация для замены import.meta.glob
  // Вместо прямого использования import.meta.glob, который не поддерживается в TypeScript
  return {} as Record<string, { default: Record<string, string> }>;
}

// Предзагрузка всех файлов локализации
const locales = {
  common: importLocaleFiles('@/locales/*/common.json'),
  components: importLocaleFiles('@/locales/*/components.json'),
  pages: importLocaleFiles('@/locales/*/pages.json'),
  validation: importLocaleFiles('@/locales/*/validation.json'),
};

/**
 * Создает или возвращает кешированный экземпляр интернационализации
 * @param locale - Код локали
 * @returns Экземпляр IntlShape
 */
export function getIntl(locale: string): IntlShape {
  if (locale in intlCache) {
    return intlCache[locale];
  }

  // Динамически загружаем сообщения для указанной локали
  const messages = loadMessages(locale);

  // Здесь должна быть инициализация intl с использованием IntlMessageFormat,
  // или другой библиотеки. Для примера возвращаем пустой объект.
  const intl = {
    locale,
    messages,
    defaultLocale: 'ru',
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    formatMessage: (descriptor: { id: string }, _values?: Record<string, any>) => {
      // Упрощенная реализация
      const message = messages[descriptor.id] || descriptor.id;
      return message;
    },
  } as unknown as IntlShape;

  intlCache[locale] = intl;
  return intl;
}

/**
 * Загружает сообщения для указанной локали
 * @param locale - Код локали
 * @returns Объект с сообщениями
 */
function loadMessages(locale: string): Record<string, string> {
  try {
    // Создаем результирующий объект для сообщений
    let messages: Record<string, string> = {};

    // Функция для добавления сообщений из модуля, если он существует
    const addMessagesFromModule = (moduleType: keyof typeof locales, locale: string) => {
      const path = `/locales/${locale}/${moduleType}.json`;
      // Находим подходящий модуль из предзагруженных
      const moduleKey = Object.keys(locales[moduleType]).find(key => key.includes(path));

      if (moduleKey) {
        // TypeScript требует явного приведения типа для содержимого JSON файла
        const moduleContent = locales[moduleType][moduleKey] as {
          default: Record<string, string>;
        };
        messages = { ...messages, ...moduleContent.default };
      }
    };

    // Загружаем сообщения из всех типов файлов
    addMessagesFromModule('common', locale);
    addMessagesFromModule('components', locale);
    addMessagesFromModule('pages', locale);
    addMessagesFromModule('validation', locale);

    // Если сообщения не найдены, и это не локаль по умолчанию, пробуем загрузить сообщения для локали по умолчанию
    if (Object.keys(messages).length === 0 && locale !== 'ru') {
      return loadMessages('ru');
    }

    return messages;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(`Не удалось загрузить сообщения для локали ${locale}:`, error);

    // Если не смогли загрузить указанную локаль, пытаемся загрузить локаль по умолчанию
    if (locale !== 'ru') {
      return loadMessages('ru');
    }

    // Если не смогли загрузить даже локаль по умолчанию, возвращаем пустой объект
    return {};
  }
}

/**
 * Форматирует сообщение с учетом множественного числа
 * @param intl - Экземпляр интернационализации
 * @param id - Идентификатор сообщения
 * @param values - Значения для подстановки
 * @returns Отформатированное сообщение
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function formatMessage(intl: IntlShape, id: string, values?: Record<string, any>): string {
  return intl.formatMessage({ id }, values) as string;
}

/**
 * Форматирует сообщение с учетом множественного числа
 * @param intl - Экземпляр интернационализации
 * @param id - Идентификатор сообщения
 * @param count - Количество для определения формы множественного числа
 * @param values - Значения для подстановки
 * @returns Отформатированное сообщение
 */
export function formatPlural(
  intl: IntlShape,
  id: string,
  count: number,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _values?: Record<string, any>,
): string {
  return intl.formatMessage(
    { id },
    {
      count,
    },
  );
}

// Экспортируем доступные локали
export const availableLocales = ['ru', 'en'];
