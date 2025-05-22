/**
 * Общие типы данных, используемые в проекте
 *
 * @module shared/lib/utils/types
 */

/**
 * Тип для определения всех ключей объекта
 */
export type ObjectKey = string | number | symbol;

/**
 * Обобщенный тип для определения Record с типами ключа и значения
 */
export type Dictionary<T> = Record<string, T>;

/**
 * Тип для определения функции обратного вызова
 */
export type Callback<T = void> = (...args: unknown[]) => T;

/**
 * Тип для определения асинхронной функции обратного вызова
 */
export type AsyncCallback<T = void> = (...args: unknown[]) => Promise<T>;

/**
 * Тип для определения предиката (функция, возвращающая boolean)
 */
export type Predicate<T> = (value: T) => boolean;

/**
 * Тип для определения промиса или значения
 */
export type MaybePromise<T> = T | Promise<T>;

/**
 * Тип для определения nullable значения
 */
export type Nullable<T> = T | null;

/**
 * Тип для определения optional значения
 */
export type Optional<T> = T | undefined;

/**
 * Тип для определения значения, которое может быть null или undefined
 */
export type Maybe<T> = T | null | undefined;

/**
 * Тип для определения объекта с неизвестными свойствами
 */
export type AnyObject = Record<string, unknown>;

/**
 * Тип для определения объекта с известными свойствами и возможными дополнительными
 */
export type ExtendableObject<T extends AnyObject = Record<string, never>> = T & {
  [key: string]: unknown;
};

/**
 * Тип для определения объекта с ключами как подмножество ключей другого объекта
 */
export type PartialRecord<K extends keyof unknown, T> = Partial<Record<K, T>>;

/**
 * Вспомогательный тип для исключения null и undefined из типа
 */
export type NonNullable<T> = Exclude<T, null | undefined>;

/**
 * Вспомогательный тип для получения возвращаемого типа функции
 */
export type ReturnTypeOf<F extends (...args: unknown[]) => unknown> = ReturnType<F>;

/**
 * Вспомогательный тип для получения типа параметров функции
 */
export type ParametersTypeOf<F extends (...args: unknown[]) => unknown> = Parameters<F>;

/**
 * Вспомогательный тип для определения объединения типов
 */
export type UnionToIntersection<U> = (U extends unknown ? (k: U) => void : never) extends (
  k: infer I,
) => void
  ? I
  : never;
