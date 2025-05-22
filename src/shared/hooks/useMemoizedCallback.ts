'use client';

import { useCallback, useRef } from 'react';

/**
 * Тип для функции-генератора ключа кэширования
 */
type KeyGenerator<Args extends string[]> = (...args: Args) => string;

/**
 * Опции для хука useMemoizedCallback
 */
interface MemoizedCallbackOptions<Args extends string[]> {
  /** Таймаут для автоматической очистки кэша (в миллисекундах) */
  cacheTimeout?: number;
  /** Максимальный размер кэша (количество записей) */
  maxCacheSize?: number;
  /** Функция для генерации ключа кэша на основе аргументов */
  keyGenerator?: KeyGenerator<Args>;
  /** Логировать попадания в кэш (для отладки) */
  logCacheHits?: boolean;
}

/**
 * Хук для мемоизации результатов вызова callback-функций
 * Кэширует результаты вызова функции с одними и теми же аргументами
 *
 * @param callback - Функция, результаты которой нужно кэшировать
 * @param deps - Зависимости для пересоздания кэша
 * @param options - Опции для настройки кэширования
 * @returns Мемоизированная функция
 *
 * @example
 * ```tsx
 * // Кэширование результатов дорогостоящей функции
 * const fetchUserData = useMemoizedCallback(
 *   async (userId: string) => {
 *     const response = await api.fetchUser(userId);
 *     return response.data;
 *   },
 *   [api],
 *   { cacheTimeout: 60000 } // Кэш валиден 1 минуту
 * );
 *
 * // Использование с асинхронной функцией
 * useEffect(() => {
 *   fetchUserData('user123').then(data => {
 *     setUser(data);
 *   });
 * }, [fetchUserData]);
 * ```
 */
export function useMemoizedCallback<Args extends string[], Result>(
  callback: (...args: Args) => Result,
  deps: React.DependencyList,
  options: MemoizedCallbackOptions<Args> = {},
): (...args: Args) => Result {
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  const { cacheTimeout, maxCacheSize = 100, keyGenerator, logCacheHits = false } = options;

  // Референс к текущему кэшу, сохраняется между рендерами
  const cacheRef = useRef<{
    map: Map<string, { result: Result; timestamp: number }>;
    keys: string[]; // Для отслеживания порядка добавления для LRU
  }>({
    map: new Map(),
    keys: [],
  });

  // Функция для создания ключа кэша на основе аргументов
  const getKey = useCallback<KeyGenerator<Args>>(
    (...args: Args): string => {
      if (keyGenerator) {
        return keyGenerator(...args);
      }
      try {
        return JSON.stringify(args);
      } catch (e) {
        // Если аргументы нельзя сериализовать, используем их строковое представление
        return String(args);
      }
    },
    [keyGenerator],
  );

  // Очистка устаревших записей кэша
  const cleanExpiredCache = useCallback(() => {
    if (!cacheTimeout) return;

    const now = Date.now();
    const cache = cacheRef.current;
    let cleared = 0;

    // Проходим по всем записям и удаляем просроченные
    cache.keys.forEach(key => {
      const entry = cache.map.get(key);
      if (entry && now - entry.timestamp > cacheTimeout) {
        cache.map.delete(key);
        cleared++;
      }
    });

    // Обновляем список ключей, удаляя ключи удаленных записей
    if (cleared > 0) {
      cache.keys = cache.keys.filter(key => cache.map.has(key));
    }
  }, [cacheTimeout]);

  // Мемоизируем функцию с кэшированием результатов
  return useCallback(
    (...args: Args): Result => {
      // Генерируем ключ для текущих аргументов
      const key = getKey(...args);

      // Очищаем истекшие записи кэша
      cleanExpiredCache();

      // Проверяем наличие результата в кэше
      const cache = cacheRef.current;
      const cachedEntry = cache.map.get(key);

      // Если есть в кэше и не истек таймаут
      if (cachedEntry) {
        // Обновляем состояние ключа в LRU (делаем его самым "свежим")
        const keyIndex = cache.keys.indexOf(key);
        if (keyIndex !== -1) {
          cache.keys.splice(keyIndex, 1);
          cache.keys.push(key);
        }

        if (logCacheHits) {
          // eslint-disable-next-line no-console
          console.debug(`Cache hit for key: ${key}`);
        }

        return cachedEntry.result;
      }

      // Если в кэше нет, вычисляем результат
      const result = callback(...args);

      // Если кэш полон, удаляем самую старую запись (LRU)
      if (cache.keys.length >= maxCacheSize) {
        const oldestKey = cache.keys.shift();
        if (oldestKey) cache.map.delete(oldestKey);
      }

      // Сохраняем результат в кэше
      cache.map.set(key, {
        result,
        timestamp: Date.now(),
      });
      cache.keys.push(key);

      return result;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [callback, getKey, cleanExpiredCache, maxCacheSize, logCacheHits],
  );
}

/**
 * Версия хука для асинхронных функций
 * Кэширует промисы для предотвращения повторных запросов
 *
 * @example
 * ```tsx
 * const fetchData = useMemoizedAsyncCallback(
 *   async (id: string) => {
 *     const response = await fetch(`/api/data/${id}`);
 *     return response.json();
 *   },
 *   [],
 *   { cacheTimeout: 5000 }
 * );
 * ```
 */
export function useMemoizedAsyncCallback<Args extends string[], Result>(
  callback: (...args: Args) => Promise<Result>,
  deps: React.DependencyList,
  options: MemoizedCallbackOptions<Args> = {},
): (...args: Args) => Promise<Result> {
  return useMemoizedCallback(callback, deps, options);
}
