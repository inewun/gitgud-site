'use client';

import React, { useState, useId } from 'react';

import { cn } from '@/lib/utils';
import { withMemo } from '@/shared/lib/utils/memo';

export interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  /**
   * Текст метки чекбокса
   */
  label: string;
  /**
   * Дополнительное описание для чекбокса
   */
  description?: string;
  /**
   * Состояние чекбокса (выбран/не выбран)
   */
  checked?: boolean;
  /**
   * Обработчик изменения состояния
   */
  onChange?: (checked: boolean) => void;
  /**
   * Имя поля (для форм)
   */
  name?: string;
  /**
   * Уникальный идентификатор
   */
  id?: string;
  /**
   * CSS классы для кастомизации
   */
  className?: string;
  /**
   * CSS классы для контейнера
   */
  containerClassName?: string;
  /**
   * CSS классы для лейбла
   */
  labelClassName?: string;
  /**
   * CSS классы для описания
   */
  descriptionClassName?: string;
  /**
   * Отключает чекбокс
   */
  disabled?: boolean;
  /**
   * Обязательное поле
   */
  required?: boolean;
  /**
   * Сообщение об ошибке
   */
  error?: string;
  /**
   * CSS классы для сообщения об ошибке
   */
  errorClassName?: string;
}

const CheckboxBase: React.FC<CheckboxProps> = ({
  label,
  description,
  checked = false,
  onChange,
  name,
  id: externalId,
  className = '',
  containerClassName = '',
  labelClassName = '',
  descriptionClassName = '',
  disabled = false,
  required = false,
  error,
  errorClassName = '',
  ...rest
}) => {
  const [isChecked, setIsChecked] = useState(checked);
  const generatedId = useId();
  const checkboxId = externalId || generatedId;
  const descriptionId = useId();
  const errorId = useId();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return;

    const newCheckedState = e.target.checked;
    setIsChecked(newCheckedState);

    if (onChange) {
      onChange(newCheckedState);
    }
  };

  // Если checked передан как проп, используем его (контролируемый компонент)
  // В противном случае используем внутреннее состояние (неконтролируемый)
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  const isControlled = checked !== undefined;
  const isCheckedFinal = isControlled ? checked : isChecked;

  // Создаем строку с ID для aria-describedby, включая только существующие элементы
  const ariaDescribedby =
    [description ? descriptionId : '', error ? errorId : ''].filter(Boolean).join(' ') || undefined;

  return (
    <div className={cn('relative flex items-start', containerClassName)}>
      <div className="flex items-center h-5">
        <input
          type="checkbox"
          id={checkboxId}
          name={name}
          checked={isCheckedFinal}
          onChange={handleChange}
          disabled={disabled}
          required={required}
          className={cn(
            'h-4 w-4 rounded border-gray-300 text-primary',
            'focus:ring-primary',
            'focus:outline-none focus:ring-2 focus:ring-offset-2',
            'transition-all duration-200 ease-in-out',
            disabled && 'opacity-50 cursor-not-allowed',
            error && 'border-red-500',
            className,
          )}
          aria-describedby={ariaDescribedby}
          aria-invalid={!!error}
          {...rest}
        />
      </div>
      <div className="ml-3 text-sm">
        <label
          htmlFor={checkboxId}
          className={cn(
            'font-medium text-foreground dark:text-foreground',
            disabled && 'opacity-50 cursor-not-allowed',
            labelClassName,
          )}
        >
          {label}
          {required && (
            <span className="text-red-500 ml-1" aria-hidden="true">
              *
            </span>
          )}
        </label>

        {description && (
          <p
            id={descriptionId}
            className={cn(
              'text-muted-foreground dark:text-muted-foreground mt-1',
              descriptionClassName,
            )}
          >
            {description}
          </p>
        )}

        {error && (
          <p id={errorId} className={cn('text-red-500 mt-1', errorClassName)} role="alert">
            {error}
          </p>
        )}
      </div>
    </div>
  );
};

CheckboxBase.displayName = 'Checkbox';

export const Checkbox = withMemo(CheckboxBase);
