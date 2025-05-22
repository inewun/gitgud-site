/**
 * Централизованный механизм обработки ошибок
 * Позволяет унифицировать работу с ошибками во всем приложении
 */

// Типы ошибок, используемые в приложении
export enum ErrorType {
  // Общие ошибки
  UNKNOWN = 'UNKNOWN',
  NETWORK = 'NETWORK',
  TIMEOUT = 'TIMEOUT',

  // Ошибки валидации и формы
  VALIDATION = 'VALIDATION',
  FORM = 'FORM',
  REQUIRED_FIELD = 'REQUIRED_FIELD',

  // Ошибки безопасности
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',

  // Ошибки данных
  NOT_FOUND = 'NOT_FOUND',
  CONFLICT = 'CONFLICT',

  // Технические ошибки
  SERVER = 'SERVER',
  API = 'API',
  DATABASE = 'DATABASE',
}

// Карта кодов HTTP статусов к типам ошибок
export const HTTP_STATUS_TO_ERROR_TYPE: Record<number, ErrorType> = {
  400: ErrorType.VALIDATION,
  401: ErrorType.UNAUTHORIZED,
  403: ErrorType.FORBIDDEN,
  404: ErrorType.NOT_FOUND,
  409: ErrorType.CONFLICT,
  500: ErrorType.SERVER,
};

// Сообщения ошибок по умолчанию для разных типов
export const DEFAULT_ERROR_MESSAGES: Record<ErrorType, string> = {
  [ErrorType.UNKNOWN]: 'Произошла неизвестная ошибка',
  [ErrorType.NETWORK]: 'Ошибка сети. Проверьте подключение к интернету',
  [ErrorType.TIMEOUT]: 'Время ожидания запроса истекло',
  [ErrorType.VALIDATION]: 'Ошибка валидации данных',
  [ErrorType.FORM]: 'Проверьте правильность заполнения формы',
  [ErrorType.REQUIRED_FIELD]: 'Обязательное поле должно быть заполнено',
  [ErrorType.UNAUTHORIZED]: 'Требуется авторизация',
  [ErrorType.FORBIDDEN]: 'Доступ запрещен',
  [ErrorType.NOT_FOUND]: 'Запрашиваемый ресурс не найден',
  [ErrorType.CONFLICT]: 'Конфликт данных',
  [ErrorType.SERVER]: 'Ошибка сервера. Попробуйте позже',
  [ErrorType.API]: 'Ошибка при обращении к API',
  [ErrorType.DATABASE]: 'Ошибка базы данных',
};

// Базовая структура ошибки приложения
export interface AppError {
  type: ErrorType;
  message: string;
  code?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  details?: Record<string, any>;
  originalError?: unknown;
}

/**
 * Класс для создания типизированных ошибок приложения
 */
export class AppErrorImpl extends Error implements AppError {
  type: ErrorType;
  code?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  details?: Record<string, any>;
  originalError?: unknown;

  constructor({
    type = ErrorType.UNKNOWN,
    message,
    code,
    details,
    originalError,
  }: Partial<AppError> & { message?: string }) {
    const errorMessage = message || DEFAULT_ERROR_MESSAGES[type] || 'Произошла ошибка';
    super(errorMessage);

    this.type = type;
    this.code = code;
    this.details = details;
    this.originalError = originalError;

    // Устанавливаем правильное имя класса для отображения в стеке
    this.name = 'AppError';

    // Фиксируем правильный стек вызовов
    Error.captureStackTrace(this, AppErrorImpl);
  }
}

/**
 * Фабрика для создания ошибок приложения
 */
export const createError = (params: Partial<AppError> & { message?: string }): AppErrorImpl => {
  return new AppErrorImpl(params);
};

/**
 * Проверяет, является ли объект ошибкой приложения
 */
export const isAppError = (error: unknown): error is AppError => {
  if (error instanceof AppErrorImpl) return true;
  if (!error || typeof error !== 'object') return false;
  return 'type' in error && Object.values(ErrorType).includes((error as AppError).type);
};

/**
 * Преобразует любую ошибку в стандартную ошибку приложения
 */
export const normalizeError = (error: unknown): AppError => {
  if (isAppError(error)) {
    return error;
  }

  if (error instanceof Error) {
    return createError({
      message: error.message,
      originalError: error,
    });
  }

  return createError({
    message: typeof error === 'string' ? error : 'Неизвестная ошибка',
    originalError: error,
  });
};

/**
 * Создает обработчик ошибок для использования в catch блоках
 */
export const createErrorHandler = (
  onError?: (error: AppError) => void,
  defaultOptions?: Partial<AppError>,
) => {
  return (error: unknown): AppError => {
    const normalizedError = normalizeError(error);

    // Применяем дефолтные опции, если они предоставлены
    if (defaultOptions) {
      Object.assign(normalizedError, defaultOptions);
    }

    // Вызываем обработчик, если он предоставлен
    if (onError) {
      onError(normalizedError);
    }

    return normalizedError;
  };
};

// Экспортируем все функции и типы для использования в приложении
const errorUtils = {
  createError,
  isAppError,
  normalizeError,
  createErrorHandler,
  ErrorType,
};

export default errorUtils;
