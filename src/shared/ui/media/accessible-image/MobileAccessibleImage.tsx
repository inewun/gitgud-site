'use client';

import Image from 'next/image';
import React, { useState } from 'react';

import { cn } from '@/shared/lib/utils';
import { withMemo } from '@/shared/lib/utils/memo';
import { ErrorBoundary } from '@/shared/ui/feedback/error-boundary/ErrorBoundary';

export interface MobileAccessibleImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  loading?: 'lazy' | 'eager';
  sizes?: string;
  fallbackSrc?: string;
  onError?: (error: Error) => void;
  'aria-describedby'?: string;
  'aria-labelledby'?: string;
}

/**
 * Компонент для отображения изображений с улучшенной доступностью и обработкой ошибок
 * Добавляет поддержку ARIA атрибутов для скринридеров
 */
const MobileAccessibleImageBase: React.FC<MobileAccessibleImageProps> = ({
  src,
  alt,
  width,
  height,
  className,
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  priority = false,
  loading,
  sizes,
  fallbackSrc,
  onError,
  'aria-describedby': ariaDescribedby,
  'aria-labelledby': ariaLabelledby,
  ...rest
}) => {
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  const [hasError, setHasError] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  const [isLoaded, setIsLoaded] = useState(false);

  const handleError = (error: Error) => {
    setHasError(true);
    if (onError) {
      onError(error);
    }
  };

  const handleLoad = () => {
    setIsLoaded(true);
  };

  // Определяем приоритет для LCP изображений
  const usesPriority = priority || loading === 'eager';

  // Компонент для отображения ошибки
  const ImageErrorFallback = () => (
    <div
      className={cn(
        'flex items-center justify-center bg-subtle rounded overflow-hidden',
        className,
      )}
      role="img"
      aria-label={alt || 'Изображение не удалось загрузить'}
      style={{ width, height }}
    >
      {fallbackSrc ? (
        <Image src={fallbackSrc} alt={alt} width={width} height={height} className="object-cover" />
      ) : (
        <div className="flex flex-col items-center p-4 text-center">
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
          <p className="mt-2 text-xs text-muted">{alt || 'Изображение не удалось загрузить'}</p>
        </div>
      )}
    </div>
  );

  return (
    <ErrorBoundary fallback={<ImageErrorFallback />}>
      <div className={cn('relative', hasError && 'hidden')}>
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          className={cn(
            'transition-opacity duration-300',
            !isLoaded && 'opacity-0',
            isLoaded && 'opacity-100',
            className,
          )}
          priority={usesPriority}
          loading={loading}
          sizes={sizes}
          onError={() => {
            handleError(new Error('Ошибка загрузки изображения'));
          }}
          onLoad={handleLoad}
          aria-describedby={ariaDescribedby}
          aria-labelledby={ariaLabelledby}
          {...rest}
        />
        {/* Индикатор загрузки */}
        {!isLoaded && !hasError && (
          <div
            className="absolute inset-0 flex items-center justify-center bg-subtle animate-pulse"
            role="progressbar"
            aria-valuetext="Загрузка изображения..."
            aria-busy={!isLoaded}
          >
            <svg
              className="w-8 h-8 text-muted animate-spin"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          </div>
        )}
      </div>
      {hasError && <ImageErrorFallback />}
    </ErrorBoundary>
  );
};

export const MobileAccessibleImage = withMemo(MobileAccessibleImageBase);
