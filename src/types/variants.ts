import { type VariantProps } from 'class-variance-authority';

/**
 * Общий тип для свойств вариантов компонентов, созданных с использованием CVA
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ComponentVariants<T extends (...args: unknown[]) => any> = VariantProps<T>;
