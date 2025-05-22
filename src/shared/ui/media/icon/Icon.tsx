import React, { isValidElement, cloneElement, HTMLAttributes, FC } from 'react';

import { cn } from '@/shared/lib/utils';
import { withMemo } from '@/shared/lib/utils/memo';

export interface IconProps extends HTMLAttributes<HTMLSpanElement> {
  /** Имя иконки или компонент иконки */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon: React.ReactNode | React.ComponentType<any>;
  /** Размер иконки (ширина и высота) */
  size?: number | 'sm' | 'md' | 'lg' | 'xl';
  /** Цвет иконки */
  color?: string;
  /** Дополнительные классы */
  className?: string;
  /** Атрибут для доступности (aria-label) */
  label?: string;
  /** Устаревший атрибут - используйте aria-label */
  ariaLabel?: string;
  /** Роль иконки для доступности */
  role?: string;
}

/**
 * Компонент Icon для отображения иконок
 * Позволяет использовать готовые иконки или SVG-компоненты
 */
const IconBase: FC<IconProps> = ({
  icon,
  size = 'md',
  color,
  className,
  label,
  ariaLabel,
  role = 'img',
  ...props
}) => {
  const sizeMap = {
    sm: 16,
    md: 24,
    lg: 32,
    xl: 48,
  };

  const sizeValue = typeof size === 'string' ? sizeMap[size] : size;

  const iconProps = {
    className,
    width: sizeValue,
    height: sizeValue,
  };

  const renderIcon = () => {
    if (isValidElement(icon)) {
      return cloneElement(icon, iconProps);
    }

    if (typeof icon === 'function') {
      const IconComponent = icon as React.ComponentType<typeof iconProps>;
      return <IconComponent {...iconProps} />;
    }

    // Если icon - строка, то это CSS-класс
    if (typeof icon === 'string') {
      return null; // Вместо создания i элемента, просто возвращаем null, так как класс добавляем к span
    }

    return icon;
  };

  return (
    <span
      className={cn(
        'inline-flex items-center justify-center',
        typeof icon === 'string' ? icon : '',
        className,
      )}
      style={{ color }}
      role={role}
      aria-label={label || ariaLabel}
      {...props}
    >
      {renderIcon()}
    </span>
  );
};

IconBase.displayName = 'Icon';

export const Icon = withMemo(IconBase);
