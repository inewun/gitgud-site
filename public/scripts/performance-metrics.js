// Скрипт для сбора метрик производительности
(() => {
  if (typeof window !== 'undefined' && 'performance' in window) {
    // Базовые метрики
    window.addEventListener('load', () => {
      setTimeout(() => {
        const perfData = window.performance.timing;
        const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
        const domReadyTime = perfData.domComplete - perfData.domLoading;

        console.info('Page load time:', pageLoadTime);
        console.info('DOM ready time:', domReadyTime);

        // Отправка метрик можно добавить в будущем
      }, 0);
    });
  }
})();
