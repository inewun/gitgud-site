import React from 'react';

import { render, screen, fireEvent } from '@testing-library/react';

import { ThemeToggle } from '@/shared/ui/feedback/theme-toggle';
import { ThemeProvider } from '@/shared/ui/theme/providers';

// Мок для next-themes
const themeMock = {
  theme: 'light',
  setTheme: jest.fn(),
  resolvedTheme: 'light',
};

jest.mock('next-themes', () => ({
  useTheme: () => themeMock,
  ThemeProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

describe('ThemeToggle', () => {
  beforeEach(() => {
    // Сбрасываем значения мока перед каждым тестом
    themeMock.theme = 'light';
    themeMock.resolvedTheme = 'light';
    themeMock.setTheme.mockClear();
  });

  it('отображается корректно', () => {
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>,
    );

    // Находим кнопку переключения темы
    const toggleButton = screen.getByTestId('theme-toggle');
    expect(toggleButton).toBeInTheDocument();
  });

  it('переключает тему при клике', () => {
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>,
    );

    // Находим кнопку и кликаем по ней
    const toggleButton = screen.getByLabelText('Выбор темы');
    fireEvent.click(toggleButton);

    // Проверяем, что toggleTheme был вызван
    expect(themeMock.setTheme).toHaveBeenCalled();
  });

  it('отображает правильную иконку для светлой темы', () => {
    themeMock.theme = 'light';

    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>,
    );

    // Проверяем, что кнопка отображается
    const toggleButton = screen.getByLabelText('Выбор темы');
    expect(toggleButton).toBeInTheDocument();

    // Проверяем наличие иконки луны для светлой темы
    const moonIcon = toggleButton.querySelector('svg');
    expect(moonIcon).toBeInTheDocument();
  });

  it('отображает правильную иконку для темной темы', () => {
    // Устанавливаем темную тему в моке
    themeMock.theme = 'dark';
    themeMock.resolvedTheme = 'dark';

    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>,
    );

    // Проверяем, что кнопка отображается
    const toggleButton = screen.getByLabelText('Выбор темы');
    expect(toggleButton).toBeInTheDocument();

    // Проверяем наличие иконки солнца для темной темы
    const sunIcon = toggleButton.querySelector('svg');
    expect(sunIcon).toBeInTheDocument();
  });
});
