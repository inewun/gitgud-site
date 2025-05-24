'use client';

import { useEffect, useState } from 'react';

export function MobileTextStyles() {
  const [mediaQueries] = useState({
    small: window.matchMedia('(max-width: 480px)'),
    verySmall: window.matchMedia('(max-width: 360px)'),
  });

  useEffect(() => {
    // Создаем элемент стиля
    const styleElement = document.createElement('style');
    styleElement.id = 'mobile-text-styles';
    document.head.appendChild(styleElement);

    // Функция обновления стилей в зависимости от размера экрана
    const updateStyles = () => {
      if (mediaQueries.verySmall.matches) {
        // Очень маленькие устройства (меньше 360px)
        styleElement.textContent = `
          :root {
            --font-size-xs: 0.65rem;
            --font-size-sm: 0.75rem;
            --font-size-base: 0.85rem;
            --font-size-md: 0.95rem;
            --font-size-lg: 1.05rem;
            --font-size-xl: 1.2rem;
            --font-size-2xl: 1.5rem;
            --font-size-3xl: 1.8rem;
            --font-size-4xl: 2.3rem;
          }
          
          body {
            font-size: 0.85rem;
          }
          
          h1 {
            font-size: clamp(1.6rem, 5.8vw, 2.3rem) !important;
            line-height: 1.15;
          }
          
          h2 {
            font-size: clamp(1.2rem, 4.8vw, 1.6rem) !important;
            line-height: 1.2;
          }
          
          h3 {
            font-size: 1rem !important;
            line-height: 1.3;
          }
          
          p {
            font-size: 0.85rem !important;
            line-height: 1.5;
            margin-bottom: 0.7em;
          }
          
          button, input, select, textarea {
            font-size: 0.85rem !important;
          }
        `;
      } else if (mediaQueries.small.matches) {
        // Маленькие устройства (от 361px до 480px)
        styleElement.textContent = `
          :root {
            --font-size-xs: 0.7rem;
            --font-size-sm: 0.8rem;
            --font-size-base: 0.9rem;
            --font-size-md: 1rem;
            --font-size-lg: 1.125rem;
            --font-size-xl: 1.3rem;
            --font-size-2xl: 1.6rem;
            --font-size-3xl: 1.9rem;
            --font-size-4xl: 2.5rem;
          }
          
          body {
            font-size: 0.9rem;
          }
          
          h1 {
            font-size: clamp(1.8rem, 6vw, 2.5rem) !important;
            line-height: 1.15;
          }
          
          h2 {
            font-size: clamp(1.3rem, 5vw, 1.8rem) !important;
            line-height: 1.2;
          }
          
          h3 {
            font-size: 1.1rem !important;
            line-height: 1.3;
          }
          
          p {
            font-size: 0.9rem !important;
            line-height: 1.5;
            margin-bottom: 0.7em;
          }
          
          button, input, select, textarea {
            font-size: 0.9rem !important;
          }
        `;
      } else {
        // Стандартные размеры для больших экранов
        styleElement.textContent = '';
      }
    };

    // Первоначальное применение стилей
    updateStyles();

    // Добавляем слушатели изменения размера экрана
    const smallListener = () => {
      updateStyles();
    };
    const verySmallListener = () => {
      updateStyles();
    };

    mediaQueries.small.addEventListener('change', smallListener);
    mediaQueries.verySmall.addEventListener('change', verySmallListener);

    // Очистка при размонтировании
    return () => {
      mediaQueries.small.removeEventListener('change', smallListener);
      mediaQueries.verySmall.removeEventListener('change', verySmallListener);
      if (styleElement && styleElement.parentNode) {
        styleElement.parentNode.removeChild(styleElement);
      }
    };
  }, [mediaQueries]);

  return null;
}
