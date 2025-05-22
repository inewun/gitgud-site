import React, { forwardRef } from 'react';
import type { InputHTMLAttributes } from 'react';

import { cn } from '@/shared/lib/utils';
import { withMemo } from '@/shared/lib/utils/memo';

export interface TextInputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  wrapperClassName?: string;
  labelClassName?: string;
  inputClassName?: string;
  errorClassName?: string;
  hintClassName?: string;
}

const TextInputFieldBase = forwardRef<HTMLInputElement, TextInputFieldProps>(
  (
    {
      label,
      error,
      hint,
      className,
      wrapperClassName,
      labelClassName,
      inputClassName,
      errorClassName,
      hintClassName,
      leftIcon,
      rightIcon,
      id,
      ...props
    },
    ref,
  ) => {
    const inputId = id || `input-${Math.random().toString(36).substring(2, 9)}`;

    return (
      <div className={cn('space-y-2', wrapperClassName, className)}>
        {label && (
          <label
            htmlFor={inputId}
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
          <input
            id={inputId}
            className={cn(
              'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm',
              'ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium',
              'placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2',
              'focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
              leftIcon && 'pl-10',
              rightIcon && 'pr-10',
              error && 'border-destructive focus-visible:ring-destructive',
              inputClassName,
            )}
            ref={ref}
            aria-invalid={!!error}
            aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              {rightIcon}
            </div>
          )}
        </div>
        {error && (
          <p
            id={`${inputId}-error`}
            className={cn('text-sm font-medium text-destructive', errorClassName)}
            role="alert"
          >
            {error}
          </p>
        )}
        {hint && !error && (
          <p id={`${inputId}-hint`} className={cn('text-sm text-muted-foreground', hintClassName)}>
            {hint}
          </p>
        )}
      </div>
    );
  },
);

TextInputFieldBase.displayName = 'TextInputFieldBase';

export const TextInputField = withMemo(TextInputFieldBase);

TextInputField.displayName = 'TextInputField';
