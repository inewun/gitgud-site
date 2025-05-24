import React, { memo } from 'react';

/**
 * HOC (Higher Order Component) для применения React.memo к компонентам
 * с правильным сохранением имени и типов
 *
 * @param Component - Компонент для мемоизации
 * @returns Мемоизированный компонент
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function withMemo<T extends React.ComponentType<any>>(
  Component: T,
  areEqual?: (
    prevProps: Readonly<React.ComponentProps<T>>,
    nextProps: Readonly<React.ComponentProps<T>>,
  ) => boolean,
): React.MemoExoticComponent<T> {
  // Применяем React.memo
  const Memoized = memo(Component, areEqual);

  // Сохраняем displayName для отладки
  Memoized.displayName = `Memo(${Component.displayName || Component.name || 'Component'})`;

  // Возвращаем мемоизированный компонент
  return Memoized;
}

// Для хранения последних зависимостей и результатов между вызовами
let lastDeps: unknown[] | null = null;
let lastResult: unknown[] | null = null;

/**
 * Хелпер для мемоизации зависимостей useMemo и useCallback
 *
 * @param deps - Массив зависимостей
 * @returns Массив зависимостей с стабильной ссылкой
 *
 * @example
 * // вместо
 * React.useCallback(() => {...}, [dep1, dep2])
 *
 * // используйте
 * React.useCallback(() => {...}, memoize([dep1, dep2]))
 */
export function memoize<T extends unknown[]>(deps: readonly unknown[]): T {
  // Проверка на равенство массивов
  if (lastDeps && deps.length === lastDeps.length) {
    // Проверяем каждый элемент
    const areEqual = deps.every((dep, i) => Object.is(dep, lastDeps?.[i]));

    if (areEqual) {
      // Если все элементы равны, возвращаем предыдущий результат
      return lastResult as T;
    }
  }

  // Обновляем кеш и возвращаем новый результат
  lastDeps = Array.from(deps);
  lastResult = Array.from(deps);

  return lastResult as T;
}

/**
 * Функция для определения, следует ли обновлять компонент при изменении props
 * Игнорирует функции в props для избежания лишних ререндеров
 *
 * @param prevProps - Предыдущие props
 * @param nextProps - Новые props
// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
 * @returns true если компонент не должен обновляться, false если должен
 */
export function shouldComponentUpdate<P extends object>(
  prevProps: Readonly<P>,
  nextProps: Readonly<P>,
): boolean {
  const prevKeys = Object.keys(prevProps);
  const nextKeys = Object.keys(nextProps);

  // Если количество ключей отличается, нужно обновление
  if (prevKeys.length !== nextKeys.length) {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    return false;
  }

  // Сравниваем значения props
  return prevKeys.every(key => {
    const prevValue = prevProps[key as keyof P];
    const nextValue = nextProps[key as keyof P];

    // Игнорируем функции при сравнении
    if (typeof prevValue === 'function' && typeof nextValue === 'function') {
      return true;
    }

    return Object.is(prevValue, nextValue);
  });
}

/**
 * Вспомогательная функция для проверки, является ли значение сложным объектом или массивом
 */
function isComplexObject(value: unknown): boolean {
  return (
    value !== null &&
    typeof value === 'object' &&
    (Object.keys(value).length > 0 || Array.isArray(value))
  );
}

/**
 * Функция для глубокого сравнения объектов
 */
export function isEqual(obj1: unknown, obj2: unknown, visited = new WeakMap()): boolean {
  // Если объекты имеют один и тот же ссылочный адрес или равны по значению
  if (Object.is(obj1, obj2)) {
    return true;
  }

  // Если один из объектов null или не является объектом
  if (obj1 === null || obj2 === null || typeof obj1 !== 'object' || typeof obj2 !== 'object') {
    return false;
  }

  // Проверка на циклические ссылки
  if (visited.has(obj1)) {
    return visited.get(obj1) === obj2;
  }

  visited.set(obj1, obj2);

  // Если оба объекта являются массивами
  if (Array.isArray(obj1) && Array.isArray(obj2)) {
    if (obj1.length !== obj2.length) return false;
    return obj1.every((item, index) => isEqual(item, obj2[index], visited));
  }

  // Для обычных объектов
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  if (keys1.length !== keys2.length) return false;

  return keys1.every(key => {
    return (
      keys2.includes(key) &&
      isEqual(
        (obj1 as Record<string, unknown>)[key],
        (obj2 as Record<string, unknown>)[key],
        visited,
      )
    );
  });
}

/**
 * Интерфейс для объектов с возможностью внешней синхронизации
 */
interface ExternalStoreInterface {
  SUBSCRIBE_SYMBOL?: unknown;
  GET_SNAPSHOT_SYMBOL?: unknown;
}

/**
 * Проверка на внешние хранилища (useSyncExternalStore)
 */
function areExternalStores(prev: unknown, next: unknown): boolean {
  if (typeof prev === 'object' && prev !== null && typeof next === 'object' && next !== null) {
    const prevIsStore =
      'SUBSCRIBE_SYMBOL' in (prev as ExternalStoreInterface) &&
      'GET_SNAPSHOT_SYMBOL' in (prev as ExternalStoreInterface);
    const nextIsStore =
      'SUBSCRIBE_SYMBOL' in (next as ExternalStoreInterface) &&
      'GET_SNAPSHOT_SYMBOL' in (next as ExternalStoreInterface);

    return prevIsStore && nextIsStore;
  }
  return false;
}

/**
 * Метод сравнения пропсов компонента для React.memo
 */
export function propsComparison<P extends object>(
  prevProps: Readonly<P>,
  nextProps: Readonly<P>,
  keysToCompare?: Array<keyof P>,
  options?: {
    ignoreFunctions?: boolean;
    deep?: boolean;
    ignoreExternalStores?: boolean;
  },
): boolean {
  const defaultOptions = { ignoreFunctions: true, deep: true, ignoreExternalStores: true };
  const opts = options ? { ...defaultOptions, ...options } : defaultOptions;

  // Если указаны конкретные ключи для сравнения, используем их
  const keys = keysToCompare || (Object.keys(prevProps) as Array<keyof P>);

  // Сравниваем каждое свойство из списка ключей
  return keys.every(key => {
    const prevValue = prevProps[key];
    const nextValue = nextProps[key];

    return compareProperty(prevValue, nextValue, opts);
  });
}

// Сравнение одного свойства с учетом различных опций
function compareProperty(
  prevProp: unknown,
  nextProp: unknown,
  opts: {
    ignoreFunctions?: boolean;
    deep?: boolean;
    ignoreExternalStores?: boolean;
  },
): boolean {
  // Игнорируем функции
  if (opts.ignoreFunctions && typeof prevProp === 'function' && typeof nextProp === 'function') {
    return true;
  }

  // Проверяем на useSyncExternalStore
  if (opts.ignoreExternalStores && areExternalStores(prevProp, nextProp)) {
    return true;
  }

  // Глубокое сравнение объектов
  if (opts.deep && isComplexObject(prevProp) && isComplexObject(nextProp)) {
    return isEqual(prevProp, nextProp);
  }

  // Для примитивных типов
  return Object.is(prevProp, nextProp);
}
