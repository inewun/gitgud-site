import React, { ReactElement } from 'react';

import { render, screen, RenderOptions } from '@testing-library/react';
import * as testingLibraryWithin from '@testing-library/react';
import * as userEventModule from '@testing-library/user-event';

import { AriaAnnouncer } from '@/shared/ui/utils/accessibility';
import { HydrationProvider } from '@/shared/ui/utils/hydration';

const userEvent = userEventModule.default;
const within = testingLibraryWithin.within;

/**
 * Типы ролей ARIA для удобного доступа в тестах
 * https://www.w3.org/TR/wai-aria/#role_definitions
 */
export const AriaRoles = {
  // Структурные роли
  APPLICATION: 'application',
  ARTICLE: 'article',
  CELL: 'cell',
  COLUMNHEADER: 'columnheader',
  DEFINITION: 'definition',
  DIRECTORY: 'directory',
  DOCUMENT: 'document',
  FEED: 'feed',
  FIGURE: 'figure',
  GROUP: 'group',
  HEADING: 'heading',
  IMG: 'img',
  LIST: 'list',
  LISTITEM: 'listitem',
  MATH: 'math',
  NONE: 'none',
  NOTE: 'note',
  PRESENTATION: 'presentation',
  ROW: 'row',
  ROWGROUP: 'rowgroup',
  ROWHEADER: 'rowheader',
  SEPARATOR: 'separator',
  TABLE: 'table',
  TERM: 'term',
  TOOLBAR: 'toolbar',
  TOOLTIP: 'tooltip',

  // Виджеты
  ALERT: 'alert',
  ALERTDIALOG: 'alertdialog',
  BUTTON: 'button',
  CHECKBOX: 'checkbox',
  COMBOBOX: 'combobox',
  DIALOG: 'dialog',
  GRID: 'grid',
  LINK: 'link',
  LISTBOX: 'listbox',
  MENU: 'menu',
  MENUBAR: 'menubar',
  MENUITEM: 'menuitem',
  METER: 'meter',
  OPTION: 'option',
  PROGRESSBAR: 'progressbar',
  RADIO: 'radio',
  RADIOGROUP: 'radiogroup',
  SCROLLBAR: 'scrollbar',
  SEARCHBOX: 'searchbox',
  SLIDER: 'slider',
  SPINBUTTON: 'spinbutton',
  SWITCH: 'switch',
  TAB: 'tab',
  TABLIST: 'tablist',
  TABPANEL: 'tabpanel',
  TEXTBOX: 'textbox',
  TIMER: 'timer',
  TREE: 'tree',
  TREEGRID: 'treegrid',
  TREEITEM: 'treeitem',

  // Динамические области
  BANNER: 'banner',
  COMPLEMENTARY: 'complementary',
  CONTENTINFO: 'contentinfo',
  FORM: 'form',
  MAIN: 'main',
  NAVIGATION: 'navigation',
  REGION: 'region',
  SEARCH: 'search',

  // Live Regions
  LOG: 'log',
  MARQUEE: 'marquee',
  STATUS: 'status',

  // Оповещения
  ALERT_ROLES: ['alert', 'alertdialog', 'status'],
} as const;

/**
 * Тип ролей ARIA для типовой безопасности
 */
export type AriaRole = keyof typeof AriaRoles;

/**
 * Интерфейс для кастомных опций рендеринга
 */
interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  /**
   * Дополнительные провайдеры для тестирования
   */
  withProviders?: boolean;

  /**
   * Начальная ширина экрана для тестирования отзывчивого дизайна
   */
  initialViewport?: {
    width: number;
    height: number;
  };

  /**
   * RTL (Right-to-Left) режим для тестирования интернационализации
   */
  rtl?: boolean;
}

/**
 * Провайдер для всех тестов
 * Оборачивает компоненты во все необходимые провайдеры
 */
function AllTheProviders({ children, rtl = false }: { children: React.ReactNode; rtl?: boolean }) {
  return (
    <div dir={rtl ? 'rtl' : 'ltr'} data-testid="test-wrapper">
      <HydrationProvider>
        {/* В реальном приложении здесь могут быть и другие провайдеры */}
        <AriaAnnouncer />
        {children}
      </HydrationProvider>
    </div>
  );
}

/**
 * Функция для рендеринга компонентов в тестах
 * Добавляет все необходимые провайдеры и контекст
 *
 * @param ui - Компонент для рендеринга
 * @param options - Опции для рендеринга
 * @returns Результат рендеринга с дополнительными утилитами
 *
 * @example
 * const { getByRole, user } = renderWithProviders(<Button>Click me</Button>);
 * await user.click(getByRole('button', { name: /click me/i }));
 */
export function renderWithProviders(
  ui: ReactElement,
  {
    withProviders = true,
    rtl = false,
    initialViewport,
    ...renderOptions
  }: CustomRenderOptions = {},
) {
  // Настройка размеров окна для адаптивного дизайна
  if (initialViewport) {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: initialViewport.width,
    });

    Object.defineProperty(window, 'innerHeight', {
      writable: true,
      configurable: true,
      value: initialViewport.height,
    });

    window.dispatchEvent(new Event('resize'));
  }

  // Создаем экземпляр userEvent для эффективного тестирования взаимодействия
  const user = userEvent.setup();

  // Функция для рендеринга компонента
  const renderResult = render(ui, {
    wrapper: withProviders ? props => <AllTheProviders {...props} rtl={rtl} /> : undefined,
    ...renderOptions,
  });

  return {
    ...renderResult,
    user,

    /**
     * Находит элемент по роли и тексту
     */
    findByRoleAndText: async (role: string, text: string | RegExp) => {
      return renderResult.findByRole(role, { name: text });
    },

    /**
     * Находит все элементы с указанной ролью
     */
    getAllByRoleAndName: (role: string, name: string | RegExp) => {
      return renderResult.getAllByRole(role, { name });
    },

    /**
     * Проверяет доступность элемента
     */
    checkAccessibility: (element: HTMLElement) => {
      // Проверяем наличие базовых атрибутов доступности
      const hasAriaLabel = element.hasAttribute('aria-label');
      const hasAriaLabelledBy = element.hasAttribute('aria-labelledby');
      const hasAriaDescribedBy = element.hasAttribute('aria-describedby');

      return {
        hasAccessibleName: hasAriaLabel || hasAriaLabelledBy || element.textContent?.trim() !== '',
        hasDescription: hasAriaDescribedBy,
        isFocusable: element.tabIndex >= 0,
      };
    },
  };
}

/**
 * Улучшенные методы для тестирования на основе ролей
 */
export const byRole = {
  /**
   * Находит кнопку по тексту
   */
  button: (name: string | RegExp) => screen.getByRole('button', { name }),

  /**
   * Находит ссылку по тексту
   */
  link: (name: string | RegExp) => screen.getByRole('link', { name }),

  /**
   * Находит поле ввода по лейблу
   */
  textbox: (name: string | RegExp) => screen.getByRole('textbox', { name }),

  /**
   * Находит чекбокс по лейблу
   */
  checkbox: (name: string | RegExp) => screen.getByRole('checkbox', { name }),

  /**
   * Находит радиокнопку по лейблу
   */
  radio: (name: string | RegExp) => screen.getByRole('radio', { name }),

  /**
   * Находит заголовок по содержимому
   */
  heading: (name: string | RegExp) => screen.getByRole('heading', { name }),

  /**
   * Находит алерт по тексту
   */
  alert: (name?: string | RegExp) =>
    name ? screen.getByRole('alert', { name }) : screen.getByRole('alert'),

  /**
   * Находит элемент списка по тексту
   */
  listitem: (name: string | RegExp) => screen.getByRole('listitem', { name }),

  /**
   * Находит регион по имени
   */
  region: (name: string | RegExp) => screen.getByRole('region', { name }),

  /**
   * Собственный метод для поиска любой роли
   */
  custom: (role: string, name?: string | RegExp) =>
    name ? screen.getByRole(role, { name }) : screen.getByRole(role),
};

/**
 * Утилиты для асинхронного тестирования
 */
export const customWaitFor = {
  /**
   * Ожидает появления элемента с определенной ролью
   */
  role: async (role: string, name?: string | RegExp) => {
    return name ? await screen.findByRole(role, { name }) : await screen.findByRole(role);
  },

  /**
   * Ожидает исчезновения элемента с определенной ролью
   */
  roleToDisappear: async (role: string, name?: string | RegExp) => {
    const options = name ? { name } : undefined;
    return await screen.findByRole(role, {
      ...options,
      hidden: true,
    });
  },

  /**
   * Ожидает появления сообщения
   */
  alertMessage: async (message: string | RegExp) => {
    return await screen.findByRole('alert', { name: message });
  },
};

/**
 * Утилиты для утверждений на основе ролей
 */
export const expectByRole = {
  /**
   * Проверяет наличие элемента с указанной ролью и именем
   */
  toBeInTheDocument: (role: string, name?: string | RegExp) => {
    const element = name ? screen.queryByRole(role, { name }) : screen.queryByRole(role);
    expect(element).toBeInTheDocument();
    return element;
  },

  /**
   * Проверяет отсутствие элемента с указанной ролью и именем
   */
  not: {
    toBeInTheDocument: (role: string, name?: string | RegExp) => {
      const element = name ? screen.queryByRole(role, { name }) : screen.queryByRole(role);
      expect(element).not.toBeInTheDocument();
      return element;
    },
  },

  /**
   * Проверяет, что кнопка доступна
   */
  buttonToBeEnabled: (name: string | RegExp) => {
    const button = screen.getByRole('button', { name });
    expect(button).toBeEnabled();
    return button;
  },

  /**
   * Проверяет, что кнопка отключена
   */
  buttonToBeDisabled: (name: string | RegExp) => {
    const button = screen.getByRole('button', { name });
    expect(button).toBeDisabled();
    return button;
  },
};

// Переэкспортируем нужные функции из testing-library
export { userEvent };
export { within };
export { customWaitFor as waitFor };
// Экспортируем всё остальное из testing-library, кроме waitFor и within
export {
  render,
  screen,
  act,
  cleanup,
  configure,
  fireEvent,
  createEvent,
  getNodeText,
  getQueriesForElement,
  prettyDOM,
  queries,
  queryHelpers,
  getRoles,
  isInaccessible,
  logRoles,
  // Исключаем waitFor и within, которые мы уже экспортировали с кастомными реализациями
  // waitFor,
  // within
} from '@testing-library/react';

/**
 * Простой тест для проверки работоспособности утилит
 */
describe('Test Utils', () => {
  it('should properly render components', () => {
    const { getByText } = renderWithProviders(<div>Test Component</div>);
    expect(getByText('Test Component')).toBeInTheDocument();
  });
});
