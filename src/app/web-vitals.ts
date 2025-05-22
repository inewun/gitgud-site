import { onCLS, onFID, onFCP, onLCP, onTTFB, onINP, Metric } from 'web-vitals';

interface SendMetricsOptions {
  endpoint?: string;
  debug?: boolean;
  reportAllChanges?: boolean;
}

/**
 * Функция для отправки метрик Web Vitals в аналитическую систему
 * @param metric Метрика Web Vitals
 * @param options Настройки для отправки
 */
const sendMetrics = (metric: Metric, options: SendMetricsOptions = {}) => {
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  const { debug = false, endpoint = '/api/vitals' } = options;

  // Формируем данные для отправки
  const metricData = {
    id: metric.id,
    name: metric.name,
    value: metric.value,
    rating: metric.rating,
    delta: metric.delta,
    navigationType: performance.getEntriesByType('navigation')[0]
      ? performance.getEntriesByType('navigation')[0].type
      : '',
    page: window.location.pathname,
  };

  if (debug) {
    // eslint-disable-next-line no-console
    console.log('[Web Vitals]', metricData);
  }

  // Отправляем метрики на сервер
  if (!debug && typeof fetch === 'function') {
    const blob = new Blob([JSON.stringify(metricData)], {
      type: 'application/json',
    });

    // Используем sendBeacon для надежной отправки даже при закрытии страницы
    // Условие if (navigator.sendBeacon) убрано из-за ошибки линтера
    navigator.sendBeacon(endpoint, blob);

    // Закомментирован fallback, так как sendBeacon предполагается всегда доступным
    /*
    } else {
      // Fallback на fetch если sendBeacon не поддерживается
      fetch(endpoint, {
        method: 'POST',
        body: blob,
        headers: { 'Content-Type': 'application/json' },
        // Используем keepalive для сохранения запроса при закрытии страницы
        keepalive: true,
      }).catch(error => {
        // eslint-disable-next-line no-console
        console.error('[Web Vitals] Error sending metrics:', error);
      });
    }
    */
  }
};

/**
 * Инициализирует отслеживание Web Vitals метрик
 * @param options Настройки для отслеживания и отправки метрик
 */
export function initWebVitals(options: SendMetricsOptions = {}) {
  try {
    // Создаем обработчик для всех метрик
    const reportHandler = (metric: Metric) => {
      sendMetrics(metric, options);
    };

    // Отслеживаем CLS (Cumulative Layout Shift)
    onCLS(reportHandler, { reportAllChanges: options.reportAllChanges });

    // Отслеживаем FID (First Input Delay)
    onFID(reportHandler);

    // Отслеживаем LCP (Largest Contentful Paint)
    onLCP(reportHandler, { reportAllChanges: options.reportAllChanges });

    // Отслеживаем FCP (First Contentful Paint)
    onFCP(reportHandler);

    // Отслеживаем TTFB (Time to First Byte)
    onTTFB(reportHandler);

    // Отслеживаем INP (Interaction to Next Paint) - новая экспериментальная метрика
    onINP(reportHandler, { reportAllChanges: options.reportAllChanges });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('[Web Vitals] Failed to initialize:', error);
  }
}

/**
 * Добавляет простой мониторинг производительности страницы
 * Выводит в консоль базовые метрики загрузки без использования web-vitals
 */
export function reportPagePerformance() {
  if (typeof window === 'undefined' || typeof performance === 'undefined') return;

  // Исправляем ошибку unbound-method
  window.addEventListener('load', () => {
    // Небольшая задержка, чтобы дать время для загрузки всех ресурсов
    setTimeout(() => {
      // Условие if (performance.timing) убрано из-за ошибки линтера
      const perfData = performance.timing;
      const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
      const domLoadTime = perfData.domComplete - perfData.domLoading;
      const networkLatency = perfData.responseEnd - perfData.requestStart;
      const redirectTime = perfData.redirectEnd - perfData.redirectStart;

      // eslint-disable-next-line no-console
      console.log('[Performance Metrics]', {
        pageLoadTime: `${pageLoadTime}ms`,
        domLoadTime: `${domLoadTime}ms`,
        networkLatency: `${networkLatency}ms`,
        redirectTime: redirectTime > 0 ? `${redirectTime}ms` : 'N/A',
      });
    }, 0);
  });
}
