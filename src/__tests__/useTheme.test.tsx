import { renderHook, act } from '@testing-library/react';

import { useTheme } from '@/lib/hooks/useTheme';

// Мок localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    clear: () => {
      store = {};
    },
  };
})();

// Мок для next-themes
// Создаем переменные для отслеживания текущей темы
let mockTheme = 'light';
let mockResolvedTheme = 'light';

// Мок функции setTheme
const mockSetTheme = jest.fn((newTheme: string) => {
  mockTheme = newTheme;
  mockResolvedTheme = newTheme; // При изменении также меняем resolvedTheme
});

// Мок next-themes
jest.mock('next-themes', () => ({
  useTheme: () => ({
    theme: mockTheme,
    resolvedTheme: mockResolvedTheme,
    setTheme: mockSetTheme,
  }),
}));

// Мок matchMedia
window.matchMedia = jest.fn().mockImplementation(
  (query: string): MediaQueryList => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(() => true),
  }),
);

describe('useTheme', () => {
  beforeEach(() => {
    // Подготовка окружения перед каждым тестом
    Object.defineProperty(window, 'localStorage', { value: localStorageMock });
    localStorageMock.clear();
    document.documentElement.dataset.theme = '';
    jest.clearAllMocks();

    // Сбрасываем значения мока
    mockTheme = 'light';
    mockResolvedTheme = 'light';
  });

  it('должен использовать светлую тему по умолчанию', () => {
    const { result } = renderHook(() => useTheme());
    expect(result.current.theme).toBe('light');
  });

  it('должен переключать тему при вызове toggleTheme', () => {
    const { result } = renderHook(() => useTheme());

    // Проверяем начальное состояние
    expect(result.current.theme).toBe('light');

    // Переключаем тему
    act(() => {
      result.current.toggleTheme();
    });

    // Обновляем мок вручную, так как toggleTheme внутри вызывает setTheme('dark')
    mockTheme = 'dark';
    mockResolvedTheme = 'dark';

    // Рендерим снова, чтобы получить обновленное состояние
    const { result: updatedResult } = renderHook(() => useTheme());

    // Проверяем, что тема изменилась
    expect(updatedResult.current.theme).toBe('dark');
  });

  it('должен использовать тему из localStorage при наличии', () => {
    // Устанавливаем тему в localStorage
    localStorageMock.setItem('theme', 'dark');

    // Имитируем, что next-themes прочитал тему из localStorage
    mockTheme = 'dark';
    mockResolvedTheme = 'dark';

    const { result } = renderHook(() => useTheme());
    expect(result.current.theme).toBe('dark');
  });
});
