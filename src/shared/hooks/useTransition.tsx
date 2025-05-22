'use client';

import { useTransition, useState, useCallback, useDeferredValue } from 'react';

/**
 * Опции для хука useTransitionValue
 */
interface TransitionOptions<T> {
  /**
   * Начальное значение
   */
  initialValue: T;

  /**
   * Функция для обработки изменения значения
   */
  onChange?: (value: T) => void;

  /**
   * Флаг использования отложенного значения вместо перехода
   * Полезно для оптимизации производительности при частых обновлениях
   */
  useDeferred?: boolean;

  /**
   * Функция для валидации значения перед применением перехода
// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
   * Возвращает true, если значение валидно, иначе false
   */
  validate?: (value: T) => boolean;
}

/**
 * Хук для работы с значениями в режиме transition
 * Позволяет обновлять состояние без блокировки UI
 *
 * @param options Опции для настройки поведения перехода
 * @returns Объект с текущим значением, функцией для обновления значения и флагом ожидания обновления
 *
 * @example
 * const { value, setValue, isPending } = useTransitionValue({
 *   initialValue: '',
// eslint-disable-next-line no-console
 *   onChange: (val) => console.log('Value changed:', val)
 * });
 *
 * return (
 *   <div>
 *     <input
 *       value={value}
 *       onChange={(e) => setValue(e.target.value)}
 *     />
 *     {isPending && <Spinner />}
 *   </div>
 * );
 */
export function useTransitionValue<T>({
  initialValue,
  onChange,
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  useDeferred = false,
  validate,
}: TransitionOptions<T>) {
  // Состояние для хранения текущего значения
  const [value, setValue] = useState<T>(initialValue);

  // Хук useTransition для отслеживания состояния перехода
  const [isPending, startValueTransition] = useTransition();

  // Отложенное значение для оптимизации частых обновлений
  const deferredValue = useDeferredValue(value);

  // Функция для обновления значения в режиме transition
  const updateValue = useCallback(
    (newValue: T) => {
      // Если есть функция валидации, проверяем значение
      if (validate && !validate(newValue)) {
        return;
      }

      // Если используем отложенное значение вместо перехода
      if (useDeferred) {
        setValue(newValue);
        onChange?.(newValue);
        return;
      }

      // Обновляем значение в режиме transition
      startValueTransition(() => {
        setValue(newValue);
        onChange?.(newValue);
      });
    },
    [onChange, useDeferred, validate],
  );

  return {
    value: useDeferred ? deferredValue : value,
    rawValue: value,
    setValue: updateValue,
    isPending,
    resetValue: useCallback(() => {
      updateValue(initialValue);
    }, [initialValue, updateValue]),
  };
}

/**
 * Хук для выполнения тяжелых вычислений или обновлений UI без блокировки интерфейса
 * Использует startTransition для приоритизации интерактивных обновлений
 *
 * @returns Объект с функциями для работы с переходами и флагом ожидания завершения
 *
 * @example
 * const { runTransition, isPending } = useHeavyTransition();
 *
 * const handleFilterData = (filterParams) => {
 *   runTransition(() => {
 *     const filteredResults = heavyDataProcessing(data, filterParams);
 *     setFilteredData(filteredResults);
 *   });
 * };
 *
 * return (
 *   <div>
 *     <FilterControls onChange={handleFilterData} />
 *     {isPending ? <LoadingIndicator /> : <DataGrid data={filteredData} />}
 *   </div>
 * );
 */
export function useHeavyTransition() {
  const [isPending, startLocalTransition] = useTransition();

  // Функция для выполнения тяжелых вычислений в режиме transition
  const runTransition = useCallback(
    (callback: () => void) => {
      startLocalTransition(callback);
    },
    [startLocalTransition],
  );

  return {
    isPending,
    runTransition,
    startTransition: startLocalTransition,
  };
}

/**
 * Хук для оптимизации поиска и фильтрации в реальном времени
 * Использует комбинацию useDeferredValue и useTransition для плавного UX
 *
 * @param initialQuery Начальный поисковый запрос
 * @param searchFn Функция для выполнения поиска
 * @returns Объект с функциями для работы с поиском
 *
 * @example
 * const {
 *   query,
 *   deferredQuery,
 *   setQuery,
 *   results,
 *   isSearching
 * } = useDeferredSearch('', searchUsers);
 *
 * return (
 *   <div>
 *     <SearchInput value={query} onChange={setQuery} />
 *     {isSearching && <SearchingIndicator />}
 *     <ResultsList results={results} />
 *   </div>
 * );
 */
export function useDeferredSearch<T, R>(
  initialQuery: T,
  searchFn: (query: T) => R,
): {
  query: T;
  deferredQuery: T;
  setQuery: (query: T) => void;
  results: R;
  isSearching: boolean;
} {
  // Состояние для хранения поискового запроса
  const [query, setQuery] = useState<T>(initialQuery);

  // Отложенное значение для поискового запроса
  const deferredQuery = useDeferredValue(query);

  // Определяем, выполняется ли поиск
  const isSearching = query !== deferredQuery;

  // Выполняем поиск с отложенным запросом
  const results = searchFn(deferredQuery);

  return {
    query,
    deferredQuery,
    setQuery,
    results,
    isSearching,
  };
}

/**
 * HOC для оборачивания компонента с поддержкой Concurrent Features
 *
 * @param Component Компонент для обертывания
 * @returns Обернутый компонент с поддержкой Concurrent Features
 *
 * @example
 * const ConcurrentDataGrid = withConcurrentFeatures(DataGrid);
 *
 * // Использование
 * <ConcurrentDataGrid
 *   data={hugeDataset}
 *   onSort={handleSort}
 * />
 */
export function withConcurrentFeatures<P extends object>(
  Component: React.ComponentType<P>,
): React.FC<P> {
  return function ConcurrentComponent(props: P) {
    const { isPending, runTransition } = useHeavyTransition();

    // Функция для выполнения обновлений через transition
    const transitionUpdate = useCallback(
      (updateFn: () => void) => {
        runTransition(updateFn);
      },
      [runTransition],
    );

    return (
      <>
        {isPending && (
          <div
            aria-live="polite"
            aria-busy={true}
            style={{ position: 'absolute', top: 0, right: 0 }}
          >
            <span className="sr-only">Обновление...</span>
          </div>
        )}
        <Component {...props} transitionUpdate={transitionUpdate} isPending={isPending} />
      </>
    );
  };
}
