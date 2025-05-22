import { cva } from 'class-variance-authority';

/**
 * Варианты для компонента Card
 */
export const cardVariants = cva(
  [
    'rounded-lg',
    'bg-background dark:bg-background/95',
    'border border-subtle/50 dark:border-muted/10',
    'shadow-sm',
    'transition-all duration-300',
  ],
  {
    variants: {
      padding: {
        default: 'p-6',
        none: '',
      },
      interactive: {
        true: 'hover:shadow-md hover:border-primary/20 hover:-translate-y-0.5 transform',
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        false: '',
      },
      glassmorphism: {
        true: 'glassmorphism backdrop-blur-md',
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        false: '',
      },
      accent: {
        true: 'border-accent/30 dark:border-accent/30 ring-1 ring-accent/20 dark:ring-accent/20',
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        false: '',
      },
    },
    defaultVariants: {
      padding: 'default',
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      interactive: false,
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      glassmorphism: false,
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      accent: false,
    },
  },
);

/**
 * Варианты для компонента Button
 */
export const buttonVariants = cva(
  [
    'inline-flex items-center justify-center gap-2',
    'rounded-lg',
    'text-sm font-medium',
    'transition-all duration-200',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2',
    'disabled:pointer-events-none disabled:opacity-50',
  ],
  {
    variants: {
      variant: {
        default: 'bg-primary text-white hover:bg-primary-dark/90 active:bg-primary-dark',
        secondary:
          'bg-subtle dark:bg-muted/10 text-foreground hover:bg-subtle/80 dark:hover:bg-muted/20',
        outline:
          'border border-subtle/80 dark:border-muted/20 hover:border-primary/30 hover:bg-primary/5 dark:hover:border-primary/40',
        ghost: 'text-foreground hover:bg-subtle/60 dark:hover:bg-muted/5',
        destructive: 'bg-error/90 hover:bg-error text-white',
        success: 'bg-success/90 hover:bg-success text-white',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-button px-button-x py-button-y',
        sm: 'h-button-sm px-button-sm-x text-xs',
        lg: 'h-button-lg px-button-lg-x py-button-lg-y text-base',
        icon: 'h-button w-button',
        'icon-sm': 'h-button-sm w-button-sm',
        'icon-lg': 'h-button-lg w-button-lg',
      },
      fullWidth: {
        true: 'w-full',
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        false: '',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      fullWidth: false,
    },
  },
);

/**
 * Варианты для компонента Input
 */
export const inputVariants = cva(
  [
    'flex h-10 w-full rounded-md',
    'border border-input bg-card px-3 py-2',
    'text-sm text-card-foreground placeholder:text-muted',
    'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50',
    'disabled:cursor-not-allowed disabled:opacity-50',
  ],
  {
    variants: {
      variant: {
        default: 'border-input',
        error: 'border-destructive',
      },
      size: {
        default: 'h-10 px-3 py-2',
        sm: 'h-8 px-2 py-1 text-xs',
        lg: 'h-12 px-4 py-3',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);
