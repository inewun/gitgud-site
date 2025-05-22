'use client';

import React, { useEffect, useState } from 'react';

interface Font {
  family: string;
  weight?: number | string;
  style?: string;
  url?: string;
  preloadText?: string;
}

interface FontPreloaderProps {
  /**
   * Список шрифтов для предзагрузки
   */
  fonts: Font[];

  /**
   * Текст для предзагрузки всех шрифтов
   * если для отдельных шрифтов не указан свой текст
   */
  preloadText?: string;

  /**
   * Скрыть контейнер предзагрузки шрифтов
   */
  hidden?: boolean;

  /**
   * Дополнительный CSS-класс
   */
  className?: string;
}

/**
 * Компонент для предзагрузки шрифтов
 * Помогает избежать FOIT (Flash of Invisible Text) или FOUT (Flash of Unstyled Text)
 *
 * @example
 * <FontPreloader
 *   fonts={[
 *     { family: 'Roboto', weight: 400 },
 *     { family: 'Roboto', weight: 700 },
 *     { family: 'Open Sans', weight: 400, style: 'italic' }
 *   ]}
 *   preloadText="Предзагрузка шрифтов..."
 * />
 */
export function FontPreloader({
  fonts,
  preloadText = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
  hidden = true,
  className = '',
}: FontPreloaderProps) {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // Используем document.fonts если API доступен
    if (typeof document !== 'undefined' && 'fonts' in document) {
      void document.fonts.ready.then(() => {
        setLoaded(true);
      });
    } else {
      // Fallback для старых браузеров
      const timer = setTimeout(() => {
        setLoaded(true);
      }, 500);
      return () => {
        clearTimeout(timer);
      };
    }
  }, []);

  return (
    <div
      className={`font-preloader ${className} ${loaded ? 'loaded' : ''}`}
      aria-hidden="true"
      style={{
        position: hidden ? 'absolute' : 'static',
        visibility: hidden ? 'hidden' : 'visible',
        pointerEvents: 'none',
        zIndex: -1,
        width: '1px',
        height: '1px',
        overflow: 'hidden',
      }}
    >
      {fonts.map((font, index) => (
        <div
          key={`${font.family}-${font.weight || 'normal'}-${font.style || 'normal'}-${index}`}
          style={{
            fontFamily: font.family,
            fontWeight: font.weight || 'normal',
            fontStyle: font.style || 'normal',
          }}
        >
          {font.preloadText || preloadText}
        </div>
      ))}
    </div>
  );
}
