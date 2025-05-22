import React, { forwardRef } from 'react';

import { withMemo } from '@/shared/lib/utils/memo';
import { cn } from '@/styles/common';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  options: SelectOption[];
  label?: string;
  error?: string;
  hint?: string;
  size?: 'sm' | 'md' | 'lg';
  wrapperClassName?: string;
  labelClassName?: string;
  selectClassName?: string;
  errorClassName?: string;
  hintClassName?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const SelectBase = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      options,
      label,
      error,
      hint,
      size = 'md',
      className,
      wrapperClassName,
      labelClassName,
      selectClassName,
      errorClassName,
      hintClassName,
      leftIcon,
      rightIcon,
      id,
      ...props
    },
    ref,
  ) => {
    const selectId = id || `select-${Math.random().toString(36).substring(2, 9)}`;

    const sizeClasses = {
      sm: 'h-8 px-2 text-xs',
      md: 'h-10 px-3 text-sm',
      lg: 'h-12 px-4 text-base',
    };

    return (
      <div className={cn('space-y-2', wrapperClassName, className)}>
        {label && (
          <label
            htmlFor={selectId}
            className={cn(
              'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
              labelClassName,
            )}
          >
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              {leftIcon}
            </div>
          )}
          <select
            id={selectId}
            className={cn(
              'w-full rounded-md border border-input bg-background',
              'ring-offset-background focus-visible:outline-none focus-visible:ring-2',
              'focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
              sizeClasses[size],
              leftIcon && 'pl-10',
              rightIcon && 'pr-10',
              error && 'border-destructive focus-visible:ring-destructive',
              selectClassName,
            )}
            ref={ref}
            aria-invalid={!!error}
            aria-describedby={error ? `${selectId}-error` : hint ? `${selectId}-hint` : undefined}
            {...props}
          >
            {options.map(option => (
              <option key={option.value} value={option.value} disabled={option.disabled}>
                {option.label}
              </option>
            ))}
          </select>
          {rightIcon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
              {rightIcon}
            </div>
          )}
        </div>
        {error && (
          <p
            id={`${selectId}-error`}
            className={cn('text-sm font-medium text-destructive', errorClassName)}
            role="alert"
          >
            {error}
          </p>
        )}
        {hint && !error && (
          <p id={`${selectId}-hint`} className={cn('text-sm text-muted-foreground', hintClassName)}>
            {hint}
          </p>
        )}
      </div>
    );
  },
);

SelectBase.displayName = 'SelectBase';

export const Select = withMemo(SelectBase);

Select.displayName = 'Select';
