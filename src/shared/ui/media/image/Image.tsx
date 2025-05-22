'use client';

import NextImage, { ImageProps as NextImageProps } from 'next/image';
import React, { useState, useEffect } from 'react';

import { cn } from '@/shared/lib/utils';
import { withMemo } from '@/shared/lib/utils/memo';

export interface ImageProps
  extends Omit<NextImageProps, 'onError' | 'onLoadingComplete' | 'placeholder'> {
  /** Дополнительные классы для стилизации */
  className?: string;
  /** Показывать размытую версию изображения во время загрузки */
  withBlur?: boolean;
  /** Показывать скелетон во время загрузки */
  withSkeleton?: boolean;
  /** Обработчик ошибки загрузки */
  onError?: (error: Error) => void;
  /** Обработчик успешной загрузки */
  onLoad?: () => void;
  /** ARIA-атрибуты для улучшения доступности */
  'aria-label'?: string;
  'aria-hidden'?: boolean;
}

/**
 * Компонент обертка над Next.js Image с дополнительными возможностями
 * - Поддержка размытия во время загрузки
 * - Отслеживание загрузки и ошибок
 * - Улучшенная доступность
 */
const ImageComponent: React.FC<ImageProps> = ({
  src,
  alt,
  className,
  width,
  height,
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  priority = false,
  quality = 90,
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  withBlur = false,
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  withSkeleton = false,
  onError,
  onLoad,
  'aria-label': ariaLabel,
  'aria-hidden': ariaHidden,
  ...props
}) => {
  const [isLoading, setIsLoading] = useState(!priority);
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  const [hasError, setHasError] = useState(false);

  // Обработчик загрузки изображения
  const handleLoad = () => {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    setIsLoading(false);
    if (onLoad) onLoad();
  };

  // Обработчик ошибки загрузки
  const handleError = (error: Error) => {
    setHasError(true);
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    setIsLoading(false);
    if (onError) onError(error);
    // eslint-disable-next-line no-console
    console.error('Ошибка загрузки изображения:', error);
  };

  // Сбросить состояние при изменении источника
  useEffect(() => {
    setIsLoading(!priority);
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    setHasError(false);
  }, [src, priority]);

  // Если произошла ошибка, показываем заглушку
  if (hasError) {
    return (
      <div
        className={cn(
          'flex items-center justify-center bg-muted/30 rounded overflow-hidden',
          className,
        )}
        style={{ width, height }}
        role="img"
        aria-label={ariaLabel || alt || 'Изображение не удалось загрузить'}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-8 w-8 text-muted"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M8 12h.01M12 12h.01M16 12h.01M20 12h.01"
          />
        </svg>
      </div>
    );
  }

  return (
    <div className={cn('relative', className)}>
      <NextImage
        src={src}
        alt={alt}
        width={width}
        height={height}
        quality={quality}
        priority={priority}
        className={cn(
          'transition-opacity duration-300',
          !isLoading && 'opacity-100',
          isLoading && !withBlur && 'opacity-0',
          isLoading && withBlur && 'opacity-70 blur-sm scale-105',
        )}
        onLoadingComplete={handleLoad}
        onError={() => {
          handleError(new Error('Ошибка загрузки изображения'));
        }}
        aria-label={ariaLabel}
        aria-hidden={ariaHidden}
        {...props}
      />

      {/* Скелетон для загрузки */}
      {isLoading && withSkeleton && (
        <div
          className="absolute inset-0 bg-muted/20 animate-pulse rounded overflow-hidden"
          aria-hidden="true"
        />
      )}
    </div>
  );
};

// Компонент для прелоадинга критичных изображений
const Preload = ({ src, ...props }: { src: string; [key: string]: unknown }) => {
  return <link rel="preload" as="image" href={src} {...props} />;
};

const ImageMemo = withMemo(
  ImageComponent,
  (prev, next) =>
    prev.src === next.src &&
    prev.width === next.width &&
    prev.height === next.height &&
    prev.priority === next.priority,
);

// Добавляем Preload как свойство компонента ImageMemo
const ImageWithPreload = Object.assign(ImageMemo, { Preload });

ImageWithPreload.displayName = 'Image';

const ImageBase = ImageWithPreload;

ImageBase.displayName = 'ImageBase';

export const Image = withMemo(ImageBase);

export default Image;
