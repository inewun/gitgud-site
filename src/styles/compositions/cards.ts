/**
 * Композиции стилей для карточек
 *
 * Эти композиции помогают избежать повторения одинаковых комбинаций
 * классов Tailwind в разных компонентах.
 */

export interface CardVariants {
  base: string;
  header: string;
  content: string;
  footer: string;
  variants: {
    default: string;
    bordered: string;
    elevated: string;
    interactive: string;
  };
}

/**
 * Композиции стилей для карточек
 */
export const cardVariants: CardVariants = {
  base: 'rounded-lg bg-card text-card-foreground overflow-hidden',
  header: 'p-6 border-b border-border/50',
  content: 'p-6',
  footer: 'p-6 border-t border-border/50 flex justify-end gap-4',

  variants: {
    default: 'shadow-sm',
    bordered: 'border border-border',
    elevated: 'shadow-md',
    interactive: 'transition-shadow hover:shadow-md cursor-pointer',
  },
};
