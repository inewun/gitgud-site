import { defineConfig, devices } from '@playwright/test';

/**
 * Конфигурация Playwright для e2e-тестирования
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './e2e',
  /* Максимальное время для всего теста */
  timeout: 30 * 1000,
  /* Ожидание при прохождении теста */
  expect: {
    timeout: 5000,
  },
  /* Не выполнять тесты параллельно в одном файле */
  fullyParallel: true,
  /* Не провалить весь набор тестов при первой ошибке */
  forbidOnly: !!process.env.CI,
  /* Повторить тесты при провале */
  retries: process.env.CI ? 2 : 0,
  /* Количество параллельных тестов */
  workers: process.env.CI ? 1 : undefined,
  /* Репортер для CI/локальной разработки */
  reporter: process.env.CI ? 'github' : 'html',
  /* Общие настройки для всех проектов */
  use: {
    /* Базовый URL для тестирования */
    baseURL: 'http://localhost:3000',
    /* Снимать скриншоты только при провале теста */
    screenshot: 'only-on-failure',
    /* Трассировка при провале */
    trace: 'on-first-retry',
  },
  /* Конфигурация для разных браузеров */
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1280, height: 720 },
      },
    },
    {
      name: 'firefox',
      use: {
        ...devices['Desktop Firefox'],
        viewport: { width: 1280, height: 720 },
      },
    },
    {
      name: 'webkit',
      use: {
        ...devices['Desktop Safari'],
        viewport: { width: 1280, height: 720 },
      },
    },
    /* Тестирование на мобильных устройствах */
    {
      name: 'Mobile Chrome',
      use: {
        ...devices['Pixel 5'],
        /* Пороговые значения для мобильной производительности */
        launchOptions: {
          // Увеличиваем timeout для более медленных устройств
          timeout: 60000,
        },
        contextOptions: {
          reducedMotion: 'reduce',
        },
        /* Устанавливаем более строгие требования для мобильных устройств */
        viewport: { width: 393, height: 851 },
        deviceScaleFactor: 2.75,
        // Настройки эмуляции сети и CPU закомментированы, т.к. не поддерживаются в типе UseOptions
        /*
        // Настройки для имитации более медленной сети
        networkThrottling: {
          downloadSpeed: (1.6 * 1024 * 1024) / 8, // 1.6Mbps в байтах/с
          uploadSpeed: (750 * 1024) / 8, // 750Kbps в байтах/с
          latency: 150, // 150ms задержка
        },
        // Настройки для имитации CPU throttling
        cpuThrottling: 4, // 4x замедление процессора
        */
      },
    },
    {
      name: 'Mobile Safari',
      use: {
        ...devices['iPhone 12'],
        /* Пороговые значения для мобильной производительности */
        launchOptions: {
          // Увеличиваем timeout для более медленных устройств
          timeout: 60000,
        },
        contextOptions: {
          reducedMotion: 'reduce',
        },
        /* Устанавливаем более строгие требования для мобильных устройств */
        viewport: { width: 390, height: 844 },
        deviceScaleFactor: 3,
        // Настройки эмуляции сети и CPU закомментированы, т.к. не поддерживаются в типе UseOptions
        /*
        // Настройки для имитации более медленной сети
        networkThrottling: {
          downloadSpeed: (1.6 * 1024 * 1024) / 8, // 1.6Mbps в байтах/с
          uploadSpeed: (750 * 1024) / 8, // 750Kbps в байтах/с
          latency: 150, // 150ms задержка
        },
        // Настройки для имитации CPU throttling
        cpuThrottling: 4, // 4x замедление процессора
        */
      },
    },
    /* Тестирование на планшетах */
    {
      name: 'Tablet',
      use: {
        ...devices['iPad Pro 11'],
      },
    },
    /* Тестирование разных вьюпортов */
    {
      name: 'Small viewport',
      use: {
        viewport: { width: 375, height: 667 },
      },
    },
    {
      name: 'Medium viewport',
      use: {
        viewport: { width: 768, height: 1024 },
      },
    },
    {
      name: 'Large viewport',
      use: {
        viewport: { width: 1440, height: 900 },
      },
    },
    {
      name: 'Extra large viewport',
      use: {
        viewport: { width: 1920, height: 1080 },
      },
    },
  ],
  /* Запуск dev-сервера перед тестами */
  webServer: {
    command: 'pnpm dev',
    port: 3000,
    reuseExistingServer: !process.env.CI,
  },
});
