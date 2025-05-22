/**
 * Утилиты для определения окружения выполнения (сервер/клиент)
 */

import { isClient as isClientFn, isServer as isServerFn } from './dom';

/**
 * Проверяет является ли окружение продакшн
 * @returns true, если код выполняется в production режиме
 */
export const isProduction = process.env.NODE_ENV === 'production';

/**
 * Проверяет запущено ли приложение в режиме разработки
 * @returns true, если код выполняется в development режиме
 */
export const isDevelopment = process.env.NODE_ENV === 'development';

/**
 * Безопасно выполняет код только на клиенте
 * @param callback Функция для выполнения на клиенте
 */
export const runOnClient = <T>(callback: () => T): T | undefined => {
  if (isClientFn()) {
    return callback();
  }
  return undefined;
};

/**
 * Безопасно выполняет код только на сервере
 * @param callback Функция для выполнения на сервере
 */
export const runOnServer = <T>(callback: () => T): T | undefined => {
  if (isServerFn()) {
    return callback();
  }
  return undefined;
};
