/**
 * Конфигурация мониторинга ошибок с помощью Sentry
 *
 * Этот модуль настраивает Sentry для отслеживания ошибок в приложении
 * И предоставляет функции для ручного логирования ошибок
 */
import * as Sentry from '@sentry/nextjs';

/**
 * Инициализация Sentry с соответствующими настройками
 * Вызывается автоматически при импорте этого модуля
 */
const initSentry = () => {
  // Проверяем наличие DSN в переменных окружения
  if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
    Sentry.init({
      dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
      // Настройки для разных окружений
      environment: process.env.NODE_ENV,
      // Не отправлять ошибки в режиме разработки
      enabled: process.env.NODE_ENV === 'production',
      // Настройки для пользовательских данных
      beforeSend(event, _hint) {
        // В production режиме убираем PII (Personally Identifiable Information) из ошибок
        if (process.env.NODE_ENV === 'production') {
          // Удаляем email, имена, IP и т.д. из данных пользователей
          if (event.user) {
            delete event.user.email;
            delete event.user.ip_address;
          }
          // Можно добавить другие преобразования данных
        }
        return event;
      },
      // Производительность
      tracesSampleRate: 0.1,
    });
  } else {
    // eslint-disable-next-line no-console
    console.warn(
      'Sentry DSN not found. Error monitoring is disabled. Set NEXT_PUBLIC_SENTRY_DSN in your environment variables.',
    );
  }
};

// Инициализируем Sentry, если мы в браузере
if (typeof window !== 'undefined') {
  initSentry();
}

/**
 * Записывает ошибку в Sentry с дополнительным контекстом
 */
export const logError = (
  error: Error | string,
  context?: Record<string, unknown>,
  level: 'fatal' | 'error' | 'warning' | 'log' | 'info' | 'debug' = 'error',
) => {
  // Создаем экземпляр ошибки, если передана строка
  const errorObj = typeof error === 'string' ? new Error(error) : error;

  // Добавляем контекст
  if (context) {
    Sentry.withScope(scope => {
      Object.entries(context).forEach(([key, value]) => {
        scope.setExtra(key, value);
      });

      // Отправляем ошибку в Sentry с этим скоупом
      Sentry.captureException(errorObj, {
        level,
      });
    });
  } else {
    // Отправляем ошибку в Sentry без доп. контекста
    Sentry.captureException(errorObj, {
      level,
    });
  }

  // В режиме разработки выводим ошибку в консоль
  if (process.env.NODE_ENV !== 'production') {
    // eslint-disable-next-line no-console
    console.error(errorObj);
    if (context) {
      // eslint-disable-next-line no-console
      console.error('Error context:', context);
    }
  }
};

/**
 * Устанавливает информацию о пользователе для отслеживания ошибок
 * Вызывается после авторизации пользователя
 */
export const setUserContext = (user: { id: string; username?: string }) => {
  Sentry.setUser({
    id: user.id,
    username: user.username,
  });
};

/**
 * Очищает информацию о пользователе
 * Вызывается при выходе из системы
 */
export const clearUserContext = () => {
  Sentry.setUser(null);
};

// Создаем объект с методами мониторинга
const monitoring = {
  logError,
  setUserContext,
  clearUserContext,
};

export default monitoring;
