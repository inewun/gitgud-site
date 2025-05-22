/**
 * Индексный файл для экспорта основных утилит
 */

import isEqualFn from 'lodash/isEqual';

import { cn } from '../utils';

// Реэкспортируем cn
export { cn };

/**
 * Функция для глубокого сравнения объектов
 * Обертка вокруг lodash isEqual с типизацией
 *
 * @param object - Первый объект для сравнения
 * @param other - Второй объект для сравнения
 * @returns true если объекты равны, false если не равны
 */
export function deepEqual<T>(object: T, other: T): boolean {
  return isEqualFn(object, other);
}

// Реэкспорт lodash/isEqual для удобного использования
export const isEqual = isEqualFn;

// Пользовательские утилиты для работы с DOM
export * from './dom';

// Утилиты для работы с данными
export * from './format';

// Утилиты для обеспечения доступности
export * from './a11y';

// Типы данных
export * from './types';

// Утилиты для проверки типов данных
export * from './assertions';

// Утилиты для определения окружения
export * from './environment';
