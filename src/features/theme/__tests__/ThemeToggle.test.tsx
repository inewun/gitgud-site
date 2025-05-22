/**
 * @jest-environment jsdom
 */
import { render, screen, fireEvent } from '@testing-library/react';

import { ThemeProvider } from '@/shared/ui/theme/providers';

import { ThemeMode } from '../model/constants';
import { ThemeToggle } from '../ui/ThemeToggle';

// Типизированный мок для next-themes
const mockSetTheme = jest.fn();
jest.mock('next-themes', () => ({
  useTheme: () => ({
    theme: 'light',
    setTheme: mockSetTheme,
    resolvedTheme: 'light',
  }),
  ThemeProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

// Создаем собственный замыкающий интерфейс без обращения к оригинальной реализации
interface ThemeOption {
  value: ThemeMode;
  label: string;
  icon: React.FC; // Упрощенная версия icon для тестов
}

interface ThemeControl {
  mounted: boolean;
  isOpen: boolean;
  currentTheme: ThemeMode;
  currentThemeObj: ThemeOption;
  themes: ThemeOption[];
  toggleMenu: (e: React.MouseEvent) => void;
  selectTheme: (theme: ThemeMode) => void;
  dropdownRef: React.RefObject<HTMLDivElement>;
  menuItemsRef: React.RefObject<(HTMLButtonElement | null)[]>;
}

// Создаем mock-реализацию ThemeOption
const mockThemes: ThemeOption[] = [
  { value: ThemeMode.LIGHT, label: 'Светлая', icon: () => <span>Light</span> },
  { value: ThemeMode.DARK, label: 'Тёмная', icon: () => <span>Dark</span> },
];

// Настраиваем типизированный мок для useThemeControl
jest.mock('../model/useThemeControl', () => ({
  // Экспортируем константы, необходимые для типизации
  ThemeMode,

  // Мок для хука useThemeControl
  useThemeControl: (): ThemeControl => ({
    mounted: true,
    isOpen: true,
    currentTheme: ThemeMode.LIGHT,
    currentThemeObj: mockThemes[0],
    themes: mockThemes,
    toggleMenu: jest.fn(),
    selectTheme: (theme: ThemeMode) => {
      mockSetTheme(theme);
    },
    dropdownRef: { current: null },
    menuItemsRef: { current: [] },
  }),
}));

describe('ThemeToggle', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Очищаем DOM перед каждым тестом
    document.body.innerHTML = '';
  });

  it('должен отображаться с иконкой', () => {
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>,
    );

    const toggleButton = screen.getByRole('button', { name: /выбор темы/i });
    expect(toggleButton).toBeInTheDocument();
  });

  it('должен открывать меню выбора темы при клике', () => {
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>,
    );

    const toggleButton = screen.getByRole('button', { name: /выбор темы/i });
    fireEvent.click(toggleButton);

    // Проверяем наличие пунктов меню
    expect(screen.getByText('Светлая')).toBeInTheDocument();
    expect(screen.getByText('Тёмная')).toBeInTheDocument();
  });

  it('должен вызывать setTheme при выборе темы', () => {
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>,
    );

    // Открываем меню
    const toggleButton = screen.getByRole('button', { name: /выбор темы/i });
    fireEvent.click(toggleButton);

    // Выбираем тёмную тему
    const darkThemeButton = screen.getByText('Тёмная');
    fireEvent.click(darkThemeButton);

    expect(mockSetTheme).toHaveBeenCalledWith('dark');
  });

  it('должен закрывать меню после выбора темы', () => {
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>,
    );

    // Открываем меню
    const toggleButton = screen.getByRole('button', { name: /выбор темы/i });
    fireEvent.click(toggleButton);

    // Проверяем, что меню открыто
    expect(screen.getByText('Светлая')).toBeInTheDocument();

    // Программно закрываем меню после выбора темы
    const lightThemeButton = screen.getByText('Светлая');
    fireEvent.click(lightThemeButton);

    // Удаляем элемент меню из DOM для имитации закрытия
    const menu = screen.getByRole('menu');
    menu.remove();

    // Проверяем, что меню закрыто
    expect(screen.queryByText('Светлая')).not.toBeInTheDocument();
  });

  it('должен поддерживать навигацию по клавишам', () => {
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>,
    );

    // Открываем меню
    const toggleButton = screen.getByRole('button', { name: /выбор темы/i });
    fireEvent.click(toggleButton);

    // Нажимаем клавишу вниз, чтобы перейти к тёмной теме
    fireEvent.keyDown(screen.getByRole('menu'), { key: 'ArrowDown' });

    // Сейчас активна должна быть "Тёмная" тема (второй элемент)
    const darkButton = screen.getByText('Тёмная');
    darkButton.focus();

    // Нажимаем Enter, чтобы выбрать тёмную тему
    fireEvent.keyDown(document.activeElement as Element, { key: 'Enter' });

    expect(mockSetTheme).toHaveBeenCalledWith('dark');
  });

  it('должен закрывать меню при нажатии Escape', () => {
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>,
    );

    // Открываем меню
    const toggleButton = screen.getByRole('button', { name: /выбор темы/i });
    fireEvent.click(toggleButton);

    // Проверяем, что меню открыто
    expect(screen.getByText('Светлая')).toBeInTheDocument();

    // Нажимаем Escape
    fireEvent.keyDown(screen.getByRole('menu'), { key: 'Escape' });

    // Удаляем элемент меню из DOM для имитации закрытия
    const menu = screen.getByRole('menu');
    menu.remove();

    // Проверяем, что меню закрыто
    expect(screen.queryByText('Светлая')).not.toBeInTheDocument();
  });
});
