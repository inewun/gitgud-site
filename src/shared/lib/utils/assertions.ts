/**
 * Утилиты для проверки типов данных
 *
 * @module shared/lib/utils/assertions
 */

/**
 * Проверяет, является ли значение строкой
 *
 * @param value - Проверяемое значение
 * @returns true если значение - строка
 */
export function isString(value: unknown): value is string {
  return typeof value === 'string';
}

/**
 * Проверяет, является ли значение числом
 *
 * @param value - Проверяемое значение
 * @returns true если значение - число
 */
export function isNumber(value: unknown): value is number {
  return typeof value === 'number' && !isNaN(value);
}

/**
 * Проверяет, является ли значение булевым
 *
 * @param value - Проверяемое значение
 * @returns true если значение - boolean
 */
export function isBoolean(value: unknown): value is boolean {
  return typeof value === 'boolean';
}

/**
 * Проверяет, является ли значение функцией
 *
 * @param value - Проверяемое значение
 * @returns true если значение - функция
 */
export function isFunction(value: unknown): value is (...args: unknown[]) => unknown {
  return typeof value === 'function';
}

/**
 * Проверяет, является ли значение объектом
 *
 * @param value - Проверяемое значение
 * @returns true если значение - объект (не null)
 */
export function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

/**
 * Проверяет, является ли значение массивом
 *
 * @param value - Проверяемое значение
 * @returns true если значение - массив
 */
export function isArray(value: unknown): value is unknown[] {
  return Array.isArray(value);
}

/**
 * Проверяет, является ли значение null
 *
 * @param value - Проверяемое значение
 * @returns true если значение - null
 */
export function isNull(value: unknown): value is null {
  return value === null;
}

/**
 * Проверяет, является ли значение undefined
 *
 * @param value - Проверяемое значение
 * @returns true если значение - undefined
 */
export function isUndefined(value: unknown): value is undefined {
  return typeof value === 'undefined';
}

/**
 * Проверяет, является ли значение null или undefined
 *
 * @param value - Проверяемое значение
 * @returns true если значение - null или undefined
 */
export function isNullOrUndefined(value: unknown): value is null | undefined {
  return isNull(value) || isUndefined(value);
}

/**
 * Проверяет, является ли значение пустым (null, undefined, пустая строка, пустой массив или объект)
 *
 * @param value - Проверяемое значение
 * @returns true если значение пустое
 */
export function isEmpty(value: unknown): boolean {
  if (isNullOrUndefined(value)) return true;
  if (isString(value)) return value.trim() === '';
  if (isArray(value)) return value.length === 0;
  if (isObject(value)) return Object.keys(value).length === 0;
  return false;
}
