'use client';

import { useCallback, useEffect, useRef } from 'react';

/**
 * Хук useEffectEvent - альтернатива стандартным обработчикам в useEffect
 * Позволяет определить функцию, которая имеет доступ к последним значениям пропсов и состояния,
 * но не вызывает повторное выполнение эффекта при их изменении.
 *
 * @param handler Функция-обработчик события
 * @returns Функция, которую можно использовать внутри useEffect без включения в массив зависимостей
 *
 * @example
 * function UserProfilePage({ userId }) {
 *   const [user, setUser] = useState(null);
 *
 *   // Этот обработчик не вызовет повторное выполнение эффекта при изменении userId
 *   const fetchUser = useEffectEvent(async (userIdToFetch) => {
 *     const userData = await fetchUserData(userIdToFetch);
 *
 *     // Можно безопасно использовать последние значения пропсов и состояния
// eslint-disable-next-line no-console
 *     console.log(`Fetched data for user ${userIdToFetch}, current user: ${userId}`);
 *
 *     setUser(userData);
 *   });
 *
 *   useEffect(() => {
 *     fetchUser(userId);
 *   }, [userId]); // fetchUser не нужно добавлять в зависимости
 *
 *   return <UserProfile user={user} />;
 * }
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useEffectEvent<T extends (...args: unknown[]) => any>(handler: T): T {
  // Сохраняем последнюю версию обработчика в ref
  const handlerRef = useRef<T>(handler);

  // Обновляем ref при каждом рендере
  // Это позволяет всегда иметь доступ к самой последней версии обработчика
  useEffect(() => {
    handlerRef.current = handler;
  });

  // Возвращаем стабильную функцию, которая не изменяется между рендерами,
  // но всегда использует последнюю версию обработчика
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useCallback(
    // Используем функцию для решения проблемы с зависимостями
    ((...args: Parameters<T>) => {
      // Явное приведение типа для решения проблемы с возвратом any
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return handlerRef.current(...args);
    }) as T,
    [],
  );
}

/**
 * Хук useAsyncEffectEvent - версия useEffectEvent для асинхронных функций
 * Предоставляет возможность работать с асинхронными обработчиками в useEffect
 *
 * @param handler Асинхронная функция-обработчик
 * @returns Стабильная функция, вызывающая последнюю версию асинхронного обработчика
 *
 * @example
 * function DataFetcher({ query }) {
 *   const [data, setData] = useState(null);
// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
 *   const [isLoading, setIsLoading] = useState(false);
 *
 *   const fetchData = useAsyncEffectEvent(async (searchQuery) => {
 *     setIsLoading(true);
 *     try {
 *       const result = await api.search(searchQuery);
 *       setData(result);
 *     } catch (error) {
// eslint-disable-next-line no-console
 *       console.error(error);
 *     } finally {
// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
 *       setIsLoading(false);
 *     }
 *   });
 *
 *   useEffect(() => {
 *     fetchData(query);
 *   }, [query]);
 *
 *   return (
 *     <div>
 *       {isLoading ? <Spinner /> : <ResultsList data={data} />}
 *     </div>
 *   );
 * }
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useAsyncEffectEvent<T extends (...args: unknown[]) => Promise<any>>(handler: T): T {
  return useEffectEvent(handler);
}

/**
 * Хук для отложенного запуска эффекта
 * Позволяет запустить эффект с задержкой и предотвращает частые повторные запуски
 *
 * @param effect Функция эффекта для выполнения
 * @param deps Массив зависимостей (как для useEffect)
 * @param delay Задержка в миллисекундах (по умолчанию 200 мс)
 *
 * @example
 * function AutoSaveForm({ formData }) {
 *   // Эффект будет выполняться с задержкой в 500 мс после изменения formData
 *   useDelayedEffect(() => {
 *     saveFormData(formData);
 *   }, [formData], 500);
 *
 *   return <Form data={formData} />;
 * }
 */
export function useDelayedEffect(
  effect: () => (() => void) | undefined,
  deps: React.DependencyList,
  delay = 200,
) {
  // Используем useEffectEvent для предотвращения повторных вызовов эффекта
  const callback = useEffectEvent(effect);

  useEffect(() => {
    const timeout = setTimeout(() => {
      callback();
    }, delay);

    return () => {
      clearTimeout(timeout);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

/**
 * Хук для логирования изменений значения в консоль
 * Использует useEffectEvent для предотвращения лишних вызовов эффекта
 *
 * @param name Имя для идентификации в логах
 * @param value Значение для отслеживания
 *
 * @example
 * function Counter() {
 *   const [count, setCount] = useState(0);
 *
 *   // Будет логировать изменения счетчика без лишних вызовов эффекта
 *   useLogValueChanges('counter', count);
 *
 *   return (
 *     <button onClick={() => setCount(count + 1)}>
 *       Count: {count}
 *     </button>
 *   );
 * }
 */
export function useLogValueChanges<T>(name: string, value: T) {
  // Создаем функцию для логирования с явным приведением типа для совместимости
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const logChange = useEffectEvent((prev: unknown, next: unknown) => {
    // eslint-disable-next-line no-console
    console.log(`[${name}] Changed from:`, prev, 'to:', next);
  });

  const previousValueRef = useRef<T>(value);

  useEffect(() => {
    if (previousValueRef.current !== value) {
      logChange(previousValueRef.current, value);
      previousValueRef.current = value;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);
}

/**
 * Хук для обработки событий пользователя в эффектах
 * Безопасно обрабатывает события без включения обработчика в зависимости эффекта
 *
 * @param handler Функция обработчика события
 * @returns Стабильная функция-обработчик
 *
 * @example
 * function UserActions({ user }) {
 *   const handleUserAction = useEventHandler((action, data) => {
 *     // Логика обработки действия пользователя
 *     trackUserAction(user.id, action, data);
 *   });
 *
 *   useEffect(() => {
 *     const eventListener = (e) => {
 *       handleUserAction('page-interaction', { element: e.target.id });
 *     };
 *
 *     document.addEventListener('click', eventListener);
 *     return () => document.removeEventListener('click', eventListener);
 *   }, []); // Нет необходимости включать handleUserAction в зависимости
 *
 *   return <UserProfile user={user} onAction={handleUserAction} />;
 * }
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useEventHandler<T extends (...args: unknown[]) => any>(handler: T): T {
  return useEffectEvent(handler);
}
