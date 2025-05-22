#!/usr/bin/env node

/**
 * Скрипт для проверки Web Vitals на основе данных из Vercel Analytics или локальных сборов
 * Устанавливает пороговые значения для Core Web Vitals и проверяет их соответствие
 *
 * Использование:
 * node scripts/check-web-vitals.js --env=production
 */

const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const minimist = require('minimist');

// Получаем аргументы командной строки
const args = minimist(process.argv.slice(2));
const environment = args.env || 'development';
const verbose = args.verbose || false;

// Определяем пороговые значения для Web Vitals по средам
const thresholds = {
  development: {
    LCP: 2500, // ms
    FID: 100, // ms
    CLS: 0.1, // единица
    FCP: 1800, // ms
    TTI: 3800, // ms
    TBT: 200, // ms
  },
  production: {
    LCP: 2000, // ms - строже для производства
    FID: 70, // ms
    CLS: 0.05, // единица - строже для производства
    FCP: 1500, // ms
    TTI: 3500, // ms
    TBT: 150, // ms
  },
  // Специальные настройки для мобильных устройств
  mobile: {
    LCP: 2700, // ms - мобильные чуть медленнее
    FID: 120, // ms
    CLS: 0.15, // единица - мобильные с большей вероятностью смещения
    FCP: 2000, // ms
    TTI: 4200, // ms
    TBT: 250, // ms
  },
};

// Функция для получения данных о Web Vitals
const getWebVitals = async () => {
  // В реальном проекте здесь может быть логика для извлечения данных
  // из Vercel Analytics, Google Analytics или другого сервиса

  // Для демонстрации возвращаем моковые данные
  // В реальном проекте заменить на фактический API-запрос
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({
        LCP: {
          desktop: 1950,
          mobile: 2600,
        },
        FID: {
          desktop: 65,
          mobile: 110,
        },
        CLS: {
          desktop: 0.04,
          mobile: 0.12,
        },
        FCP: {
          desktop: 1450,
          mobile: 1850,
        },
        TTI: {
          desktop: 3400,
          mobile: 4100,
        },
        TBT: {
          desktop: 140,
          mobile: 220,
        },
      });
    }, 1000);
  });
};

// Функция для проверки значений метрик
const checkMetrics = (metrics, deviceType = 'desktop') => {
  const results = {
    pass: true,
    details: {},
  };

  const thresholdType = deviceType === 'mobile' ? 'mobile' : environment;
  const currentThresholds = thresholds[thresholdType];

  Object.entries(metrics).forEach(([metricName, values]) => {
    const value = values[deviceType];
    const threshold = currentThresholds[metricName];

    if (!threshold) return; // Пропускаем метрики без пороговых значений

    // Определяем, прошла ли метрика проверку
    const isPassing = ['CLS'].includes(metricName)
      ? value <= threshold // Для CLS лучше меньшее значение
      : value <= threshold; // Для остальных метрик тоже лучше меньшее значение

    results.details[metricName] = {
      value,
      threshold,
      pass: isPassing,
      deviceType,
    };

    // Если хоть одна метрика не проходит, весь тест не проходит
    if (!isPassing) {
      results.pass = false;
    }
  });

  return results;
};

// Функция для вывода результатов в консоль
const printResults = results => {
  console.log(`\n🏎️  Результаты проверки Core Web Vitals (${environment}):\n`);

  Object.entries(results).forEach(([deviceType, deviceResults]) => {
    console.log(`📱 ${deviceType.toUpperCase()}:\n`);

    if (deviceResults.pass) {
      console.log('  ✅ Все метрики соответствуют пороговым значениям!');
    } else {
      console.log('  ❌ Некоторые метрики не соответствуют пороговым значениям.');
    }

    if (verbose || !deviceResults.pass) {
      console.log('\n  Детали метрик:');
      Object.entries(deviceResults.details).forEach(([metricName, metricDetails]) => {
        const icon = metricDetails.pass ? '✅' : '❌';
        console.log(
          `  ${icon} ${metricName}: ${metricDetails.value}ms (порог: ${metricDetails.threshold}ms)`,
        );
      });
    }

    console.log(''); // Пустая строка для разделения
  });
};

// Функция для генерации рекомендаций по улучшению
const generateRecommendations = results => {
  const recommendations = [];

  // Проверяем проблемные метрики и предлагаем улучшения
  const checkMetric = (deviceType, metricName) => {
    const details = results[deviceType]?.details[metricName];
    if (details && !details.pass) {
      switch (metricName) {
        case 'LCP':
          recommendations.push('⚡ Оптимизируйте загрузку основного контента:');
          recommendations.push('  - Используйте предзагрузку критических ресурсов');
          recommendations.push('  - Оптимизируйте изображения (WebP, lazy loading)');
          recommendations.push(
            '  - Внедрите серверный рендеринг (SSR) или статическую генерацию (SSG)',
          );
          break;
        case 'FID':
          recommendations.push('👆 Улучшите интерактивность:');
          recommendations.push('  - Минимизируйте выполнение JavaScript');
          recommendations.push('  - Разделите длительные задачи на более короткие');
          recommendations.push('  - Используйте Web Workers для тяжелых вычислений');
          break;
        case 'CLS':
          recommendations.push('📏 Уменьшите смещение макета:');
          recommendations.push('  - Всегда указывайте размеры для изображений и видео');
          recommendations.push('  - Избегайте вставки контента над существующим содержимым');
          recommendations.push('  - Используйте трансформации CSS вместо изменения позиции');
          break;
        case 'FCP':
          recommendations.push('🚀 Ускорьте первую отрисовку контента:');
          recommendations.push('  - Оптимизируйте критический CSS и включите его в <head>');
          recommendations.push('  - Минимизируйте блокирующие ресурсы');
          recommendations.push('  - Настройте эффективное кэширование');
          break;
        case 'TTI':
          recommendations.push('⏱️ Улучшите время до интерактивности:');
          recommendations.push('  - Сократите размер JavaScript');
          recommendations.push('  - Откладывайте загрузку некритичных скриптов');
          recommendations.push('  - Используйте code-splitting и динамический импорт');
          break;
        case 'TBT':
          recommendations.push('🛑 Уменьшите блокировку основного потока:');
          recommendations.push('  - Оптимизируйте JavaScript-выполнение');
          recommendations.push('  - Перенесите тяжелые вычисления в Web Workers');
          recommendations.push('  - Используйте виртуализацию для длинных списков');
          break;
      }
    }
  };

  // Проверяем все метрики для всех типов устройств
  ['desktop', 'mobile'].forEach(deviceType => {
    ['LCP', 'FID', 'CLS', 'FCP', 'TTI', 'TBT'].forEach(metric => {
      checkMetric(deviceType, metric);
    });
  });

  return recommendations;
};

// Основная функция
async function main() {
  console.log(`🔍 Проверка Web Vitals для окружения: ${environment}`);

  try {
    // Получаем данные о Web Vitals
    const metrics = await getWebVitals();

    // Проверяем метрики для десктопа и мобильных устройств
    const desktopResults = checkMetrics(metrics, 'desktop');
    const mobileResults = checkMetrics(metrics, 'mobile');

    // Объединяем результаты
    const allResults = {
      desktop: desktopResults,
      mobile: mobileResults,
    };

    // Выводим результаты
    printResults(allResults);

    // Если есть проблемы, генерируем рекомендации
    if (!desktopResults.pass || !mobileResults.pass) {
      const recommendations = generateRecommendations(allResults);
      if (recommendations.length > 0) {
        console.log('\n🔧 Рекомендации по улучшению:\n');
        recommendations.forEach(rec => console.log(rec));
      }
    }

    // Возвращаем статус выхода в зависимости от результатов
    process.exit(desktopResults.pass && mobileResults.pass ? 0 : 1);
  } catch (error) {
    console.error('❌ Ошибка при проверке Web Vitals:', error);
    process.exit(1);
  }
}

// Запускаем основную функцию
main();
