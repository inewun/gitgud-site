/**
 * Композиции стилей для форм
 *
 * Эти композиции помогают избежать повторения одинаковых комбинаций
 * классов Tailwind в разных компонентах.
 */

export interface FormVariants {
  base: string;
  group: string;
  label: string;
  input: string;
  textarea: string;
  select: string;
  checkbox: string;
  radio: string;
  helper: string;
  error: string;
  layouts: {
    default: string;
    compact: string;
    inline: string;
  };
  states: {
    valid: string;
    invalid: string;
    disabled: string;
    readOnly: string;
  };
}

/**
 * Композиции стилей для форм
 */
export const formVariants: FormVariants = {
  base: 'w-full',
  group: 'mb-4',
  label: 'block text-sm font-medium mb-2 text-foreground',
  input:
    'w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
  textarea:
    'w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 min-h-[120px]',
  select:
    'w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
  checkbox:
    'h-4 w-4 rounded border-input bg-background text-primary focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
  radio:
    'h-4 w-4 rounded-full border-input bg-background text-primary focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
  helper: 'mt-1 text-xs text-muted-foreground',
  error: 'mt-1 text-xs text-error',

  layouts: {
    default: 'space-y-6',
    compact: 'space-y-4',
    inline: 'flex items-end gap-4',
  },

  states: {
    valid: 'border-success focus:ring-success/50',
    invalid: 'border-error focus:ring-error/50',
    disabled: 'opacity-50 cursor-not-allowed bg-muted',
    readOnly: 'bg-muted cursor-default',
  },
};
