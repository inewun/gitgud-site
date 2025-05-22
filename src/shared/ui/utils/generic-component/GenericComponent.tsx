// ВАЖНО: Этот компонент и его generic-подкомпоненты должны использоваться только внутри клиентских компонентов!
// Не передавайте функции через props между сервером и клиентом.

import React, { memo } from 'react';

/**
 * Тип для определения generic-компонента с базовыми свойствами
 */
export type GenericComponentProps<T> = {
  /**
   * Данные для обработки в компоненте
   */
  data: T;

  /**
   * Функция для рендеринга элемента данных
   * Позволяет кастомизировать отображение каждого элемента
   */
  renderItem?: (item: T, index: number) => React.ReactNode;

  /**
   * Функция для извлечения ключа из элемента данных
   * Используется для оптимизации рендеринга в списках
   */
  keyExtractor?: (item: T, index: number) => string | number;

  /**
   * Дополнительный CSS-класс для корневого элемента
   */
  className?: string;

  /**
   * Дополнительные свойства для корневого элемента
   */
  [key: string]: unknown;
};

/**
 * Тип для generic-списка элементов
 */
export type GenericListProps<T> = {
  /**
   * Массив данных для отображения в списке
   */
  items: T[];

  /**
   * Функция для рендеринга элемента списка
   */
  renderItem: (item: T, index: number) => React.ReactNode;

  /**
   * Функция для извлечения ключа из элемента списка
   */
  keyExtractor?: (item: T, index: number) => string | number;

  /**
   * Дополнительный CSS-класс для списка
   */
  className?: string;

  /**
   * CSS-класс для элементов списка
   */
  itemClassName?: string;

  /**
   * Контент для отображения при пустом списке
   */
  emptyContent?: React.ReactNode;

  /**
   * Дополнительные свойства для списка
   */
  [key: string]: unknown;
};

/**
 * Generic компонент для отображения списка элементов
 * Позволяет типизировать элементы списка для предотвращения ошибок
 *
 * @example
 * // Типизированный список пользователей
 * type User = { id: number; name: string; email: string };
 * <GenericList<User>
 *   items={users}
 *   renderItem={(user) => <UserCard user={user} />}
 *   keyExtractor={(user) => user.id}
 * />
 */
export function GenericList<T>({
  items,
  renderItem,
  keyExtractor = (_, index) => index,
  className = '',
  itemClassName = '',
  emptyContent = <div>Нет данных</div>,
  ...props
}: GenericListProps<T>): React.ReactElement {
  if (items.length === 0) {
    return <>{emptyContent}</>;
  }

  return (
    <ul className={className} {...props}>
      {items.map((item, index) => (
        <li key={keyExtractor(item, index)} className={itemClassName}>
          {renderItem(item, index)}
        </li>
      ))}
    </ul>
  );
}

/**
 * Тип для дженерик-селекта
 */
export type GenericSelectProps<T> = {
  /**
   * Массив опций для селекта
   */
  options: T[];

  /**
   * Выбранное значение
   */
  value: T | null;

  /**
   * Функция обратного вызова при изменении значения
   */
  onChange: (value: T) => void;

  /**
   * Функция для извлечения значения из опции
   */
  getOptionValue?: (option: T) => string | number;

  /**
   * Функция для извлечения лейбла из опции
   */
  getOptionLabel?: (option: T) => string;

  /**
   * Дополнительный CSS-класс для селекта
   */
  className?: string;

  /**
   * Плейсхолдер для селекта
   */
  placeholder?: string;

  /**
   * Отключение селекта
   */
  disabled?: boolean;

  /**
   * ID для связи с лейблом (для доступности)
   */
  id?: string;
};

/**
 * Generic компонент выпадающего списка
 * Позволяет типизировать опции для предотвращения ошибок
 *
 * @example
 * // Типизированный селект для выбора категории
 * type Category = { id: number; name: string; slug: string };
 * <GenericSelect<Category>
 *   options={categories}
 *   value={selectedCategory}
 *   onChange={setSelectedCategory}
 *   getOptionValue={(cat) => cat.id}
 *   getOptionLabel={(cat) => cat.name}
 * />
 */
export function GenericSelect<T extends Record<string, unknown>>({
  options,
  value,
  onChange,
  getOptionValue = (option: T) => {
    if ('id' in option && option.id !== undefined) {
      return option.id as string | number;
    }
    return String(option);
  },
  getOptionLabel = (option: T) => {
    if ('name' in option && option.name !== undefined) {
      return String(option.name);
    }
    if ('title' in option && option.title !== undefined) {
      return String(option.title);
    }
    return String(option);
  },
  className = '',
  placeholder = 'Выберите...',
  disabled = false,
  id,
  ...props
}: GenericSelectProps<T>): React.ReactElement {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedIndex = e.target.selectedIndex - 1; // -1 для учета placeholder
    if (selectedIndex >= 0 && selectedIndex < options.length) {
      onChange(options[selectedIndex]);
    }
  };

  const selectedValue = value ? getOptionValue(value) : '';

  return (
    <select
      id={id}
      className={`generic-select ${className}`}
      value={selectedValue.toString()}
      onChange={handleChange}
      disabled={disabled}
      aria-label={placeholder}
      {...props}
    >
      <option value="" disabled>
        {placeholder}
      </option>
      {options.map((option, index) => (
        <option key={index} value={getOptionValue(option).toString()}>
          {getOptionLabel(option)}
        </option>
      ))}
    </select>
  );
}

/**
 * Функция для создания типизированных generic-компонентов
 * Позволяет создавать компоненты, работающие с определенным типом данных
 *
 * @example
 * // Создание специализированного компонента для работы с пользователями
 * type User = { id: number; name: string; email: string };
 * const UserComponent = createGenericComponent<User>((props) => {
 *   const { data } = props;
 *   return <div>{data.name} ({data.email})</div>;
 * });
 */
export function createGenericComponent<T>(
  Component: React.ComponentType<GenericComponentProps<T>>,
): React.FC<GenericComponentProps<T>> {
  // Используем React.memo для оптимизации производительности
  const Memoized = memo((props: GenericComponentProps<T>) => {
    return <Component {...props} />;
  });
  Memoized.displayName = `GenericComponent(${Component.displayName || Component.name || 'Component'})`;
  return Memoized;
}
