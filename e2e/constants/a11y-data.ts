// Группировка компонентов UI для оптимизации тестирования
export const componentGroups = {
  // Базовые интерактивные элементы формы
  formElements: {
    name: 'элементы форм',
    selectors: [
      'input[type="text"]',
      'input[type="email"]',
      'input[type="password"]',
      'input[type="number"]',
      'input[type="checkbox"]',
      'input[type="radio"]',
      'select',
      'textarea',
    ],
  },
  // Кнопки и интерактивные элементы
  buttons: {
    name: 'кнопки и интерактивные элементы',
    selectors: [
      '.Button',
      'button[class*="button"]',
      '[role="switch"]',
      '[role="button"][aria-expanded]',
      'button:not([aria-hidden="true"])',
    ],
  },
  // Навигация
  navigation: {
    name: 'элементы навигации',
    selectors: [
      'a[href]',
      '[role="tab"]',
      'nav a, nav button',
      '[aria-label*="pagination"] button, [aria-label*="pagination"] a',
    ],
  },
  // Всплывающие элементы
  popups: {
    name: 'всплывающие элементы',
    selectors: [
      '[role="dialog"]',
      '[role="tooltip"]',
      '[role="menu"] button, [role="menuitem"]',
      'button[aria-haspopup="true"]',
    ],
  },
  // Элементы доступности
  accessibility: {
    name: 'элементы доступности',
    selectors: [
      '[aria-label*="accessibility"] button',
      '[aria-label*="theme"] button',
      '[aria-label*="contrast"] button',
    ],
  },
};

// Конкретные критические пути фокуса для проверки
export const criticalFocusFlows = [
  {
    name: 'Основная форма',
    elements: [
      'form',
      'input[name="name"]',
      'input[name="email"]',
      'textarea',
      'button[type="submit"]',
    ],
    expectedOrder: true,
  },
  {
    name: 'Навигация шапки',
    elements: ['nav a', 'button[aria-label*="menu"]', 'button[aria-label*="theme"]'],
    expectedOrder: true,
  },
];
