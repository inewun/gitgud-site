import 'framer-motion';

// Исправляем несоответствие типов в CSSStyleDeclarationWithTransform
declare module 'framer-motion' {
  // Приводим тип к более точному и расширенному варианту
  interface CSSStyleDeclaration {
    x?: string;
    y?: string;
    z?: string;
    [key: `--${string}`]: string | undefined;
  }

  interface CSSStyleDeclarationWithTransform
    extends Omit<CSSStyleDeclaration, 'transition' | 'direction'> {
    x: string;
    y: string;
    z: string;
    [key: `--${string}`]: string | number | undefined;
  }
}
