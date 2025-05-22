'use client';

import { useEffect } from 'react';

/**
 * Опции для аналитики
 */
interface AnalyticsOptions {
  /**
   * Уникальный идентификатор отслеживания
   */
  trackingId: string;
  /**
   * Включить отслеживание маршрутов
   */
  trackRoutes?: boolean;
  /**
   * Включить отслеживание кликов
   */
  trackClicks?: boolean;
  /**
   * Включить отслеживание ошибок
   */
  trackErrors?: boolean;
}

// Мокинг аналитики для демонстрации
function initAnalytics(options: AnalyticsOptions): void {
  // console.log('Analytics initialized with options:', options); // Удалено для линтера

  // Мокаем отправку событий
  window.trackEvent = (_category: string, _action: string, _label?: string) => {
    // console.log(`Analytics Event: ${category} - ${action} - ${label || 'N/A'}`); // Удалено для линтера
  };

  // Отслеживание изменений маршрута
  if (options.trackRoutes) {
    // console.log('Route tracking enabled'); // Удалено для линтера
  }

  // Отслеживание кликов
  if (options.trackClicks) {
    // console.log('Click tracking enabled'); // Удалено для линтера
  }

  // Отслеживание ошибок
  if (options.trackErrors) {
    // console.log('Error tracking enabled'); // Удалено для линтера

    window.addEventListener('error', _event => {
      // console.log(`Analytics Error: ${event.message}`); // Удалено для линтера
    });
  }
}

// Расширяем глобальный объект Window для типизации метода отслеживания событий
declare global {
  interface Window {
    trackEvent: (category: string, action: string, label?: string) => void;
  }
}

/**
 * Компонент аналитики для приложения
 *
 * Инициализирует средства отслеживания и телеметрии после загрузки страницы.
 * Реализует отложенную загрузку, чтобы не блокировать основной контент.
 *
 * @returns null - компонент не рендерит UI
 */
function Analytics() {
  useEffect(() => {
    // Отложенная инициализация аналитики
    const initTimeout = setTimeout(() => {
      try {
        // Инициализация аналитики с базовыми настройками
        // В реальном приложении здесь будет реальный ID отслеживания
        initAnalytics({
          trackingId: 'DEMO-TRACKING-ID',
          trackRoutes: true,
          trackClicks: false,
          trackErrors: true,
        });

        // Отправляем событие о загрузке страницы
        window.trackEvent('Page', 'Load', document.title);

        // Отслеживание времени нахождения на странице
        const startTime = new Date();

        // Отправляем информацию о времени сессии при выгрузке страницы
        window.addEventListener('beforeunload', () => {
          const sessionTime = Math.round((new Date().getTime() - startTime.getTime()) / 1000);
          window.trackEvent('Session', 'Duration', `${sessionTime} seconds`);
        });
      } catch (error) {
        // Ошибка инициализации аналитики (console.error удалён для линтера)
      }
    }, 1000);

    // Очистка таймера при размонтировании компонента
    return () => {
      clearTimeout(initTimeout);
    };
  }, []);

  // Компонент не рендерит UI
  return null;
}

export default Analytics;
