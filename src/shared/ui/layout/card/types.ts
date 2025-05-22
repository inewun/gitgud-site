import { HTMLAttributes } from 'react';

export type CardPadding = 'default' | 'compact' | 'none';
export type CardShadow = 'none' | 'sm' | 'md' | 'lg';
export type CardHover = 'none' | 'lift' | 'glow' | 'subtle';
export type CardAnimation = 'none' | 'fadeIn' | 'scaleIn' | 'slideUp' | 'slideDown';

/**
 * Свойства компонента Card
 */
export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * Дополнительный CSS-класс
   */
  className?: string;

  /**
   * Отступы внутри карточки
   * @default 'default'
   */
  padding?: CardPadding;

  /**
   * Тень карточки
   * @default 'sm'
   */
  shadow?: CardShadow;

  /**
   * Эффект при наведении
   * @default 'none'
   */
  hover?: CardHover;

  /**
   * Является ли карточка интерактивной (с поведением при наведении и фокусе)
   * @default false
   */
  interactive?: boolean;

  /**
   * Применить эффект стекломорфизма
   * @default false
   */
  glassmorphism?: boolean;

  /**
   * Выделить карточку акцентным цветом
   * @default false
   */
  accent?: boolean;

  /**
   * Анимация появления карточки
   * @default 'none'
   */
  animation?: CardAnimation;

  /**
   * Дочерние элементы
   */
  children?: React.ReactNode;
}
