import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Утилита для объединения CSS-классов с поддержкой Tailwind CSS
 * Предотвращает конфликты классов Tailwind путем автоматического разрешения конфликтов
 *
 * @param inputs - Классы для объединения
 * @returns Объединенная строка классов без конфликтов
 *
 * @example
 * // Вместо конкатенации строк
 * // ❌ className="flex flex-row items-center"
 *
 * // Используйте
 * // ✅ className={cn(layout.flexRowCenter)}
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
