import { clsx, type ClassValue } from 'clsx';
import isEqualFn from 'lodash/isEqual';
import { twMerge } from 'tailwind-merge';

/**
 * Объединяет классы tailwind и предотвращает конфликты
 * Использует clsx для условного применения классов и twMerge для объединения
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Функция для глубокого сравнения объектов
 * Реэкспорт lodash isEqual
 */
export const isEqual = isEqualFn;
