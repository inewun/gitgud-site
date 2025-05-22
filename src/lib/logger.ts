/**
 * Модуль логирования для приложения
 * Обеспечивает унифицированное логирование ошибок и информации
 * с возможностью переключения между production/development режимами
 */

/**
 * Уровни логирования
 */
export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
  NONE = 4,
}

/**
 * Настройки логгера
 */
interface LoggerOptions {
  logLevel: LogLevel;
  isProd: boolean;
  shouldReportToService: boolean;
}

/**
 * Класс логгера
 */
class Logger {
  private options: LoggerOptions;

  constructor() {
    this.options = {
      // В production логируем только ошибки и предупреждения
      logLevel: process.env.NODE_ENV === 'production' ? LogLevel.WARN : LogLevel.DEBUG,
      isProd: process.env.NODE_ENV === 'production',
      shouldReportToService: process.env.NEXT_PUBLIC_ERROR_REPORTING === 'true',
    };
  }

  /**
   * Логирование отладочной информации
   * @param message Сообщение
   * @param data Дополнительные данные
   */
  debug(message: string, ...data: string[]): void {
    if (this.options.logLevel <= LogLevel.DEBUG) {
      // eslint-disable-next-line no-console
      console.debug(`[DEBUG] ${message}`, ...data);
    }
  }

  /**
   * Логирование информации
   * @param message Сообщение
   * @param data Дополнительные данные
   */
  info(message: string, ...data: string[]): void {
    if (this.options.logLevel <= LogLevel.INFO) {
      // eslint-disable-next-line no-console
      console.info(`[INFO] ${message}`, ...data);
    }
  }

  /**
   * Логирование предупреждений
   * @param message Сообщение
   * @param data Дополнительные данные
   */
  warn(message: string, ...data: string[]): void {
    if (this.options.logLevel <= LogLevel.WARN) {
      // eslint-disable-next-line no-console
      console.warn(`[WARN] ${message}`, ...data);
    }
  }

  /**
   * Логирование ошибок
   * @param message Сообщение об ошибке
   * @param error Объект ошибки
   * @param data Дополнительные данные
   */
  error(message: string, error?: Error, ...data: string[]): void {
    if (this.options.logLevel <= LogLevel.ERROR) {
      // eslint-disable-next-line no-console
      console.error(`[ERROR] ${message}`, error, ...data);
    }

    // Отправка ошибок в мониторинг-сервис в production
    if (this.options.isProd && this.options.shouldReportToService) {
      this.reportErrorToService(message, error, data);
    }
  }

  /**
   * Отправка ошибки во внешний сервис мониторинга
   * @param message Сообщение об ошибке
   * @param error Объект ошибки
   * @param data Дополнительные данные
   */
  private reportErrorToService(message: string, error?: Error, data?: string[]): void {
    // Реализация отправки ошибок в сервис (например, Sentry, LogRocket, etc.)
    // Метод-заглушка, который может быть реализован в будущем
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const reportData = {
      message,
      error:
        error instanceof Error
          ? {
              name: error.name,
              message: error.message,
              stack: error.stack,
            }
          : error,
      extraData: data,
      timestamp: new Date().toISOString(),
    };

    // Здесь может быть вызов API сервиса мониторинга
    // void fetch });
  }

  /**
   * Обновление настроек логгера
   * @param options Новые настройки
   */
  update(options: Partial<LoggerOptions>): void {
    this.options = { ...this.options, ...options };
  }
}

// Создаем и экспортируем единый экземпляр логгера
export const logger = new Logger();
export default logger;
