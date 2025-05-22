import React, { forwardRef } from 'react';
import type { TextareaHTMLAttributes } from 'react';

import { withMemo } from '@/shared/lib/utils/memo';
import { cn } from '@/styles/common';

export interface TextareaFieldProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
  wrapperClassName?: string;
  labelClassName?: string;
  textareaClassName?: string;
  errorClassName?: string;
  hintClassName?: string;
}

const TextareaFieldBase = forwardRef<HTMLTextAreaElement, TextareaFieldProps>(
  (
    {
      label,
      error,
      hint,
      className,
      wrapperClassName,
      labelClassName,
      textareaClassName,
      errorClassName,
      hintClassName,
      id,
      ...props
    },
    ref,
  ) => {
    const textareaId = id || `textarea-${Math.random().toString(36).substring(2, 9)}`;

    return (
      <div className={cn('space-y-2', wrapperClassName, className)}>
        {label && (
          <label
            htmlFor={textareaId}
            className={cn(
              'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
              labelClassName,
            )}
          >
            {label}
          </label>
        )}
        <textarea
          id={textareaId}
          className={cn(
            'flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm',
            'ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none',
            'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
            'disabled:cursor-not-allowed disabled:opacity-50',
            error && 'border-destructive focus-visible:ring-destructive',
            textareaClassName,
          )}
          ref={ref}
          aria-invalid={!!error}
          aria-describedby={error ? `${textareaId}-error` : hint ? `${textareaId}-hint` : undefined}
          {...props}
        />
        {error && (
          <p
            id={`${textareaId}-error`}
            className={cn('text-sm font-medium text-destructive', errorClassName)}
            role="alert"
          >
            {error}
          </p>
        )}
        {hint && !error && (
          <p
            id={`${textareaId}-hint`}
            className={cn('text-sm text-muted-foreground', hintClassName)}
          >
            {hint}
          </p>
        )}
      </div>
    );
  },
);

TextareaFieldBase.displayName = 'TextareaFieldBase';

export const TextareaField = withMemo(TextareaFieldBase);

TextareaField.displayName = 'TextareaField';
