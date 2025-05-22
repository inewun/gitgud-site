import React from 'react';

import { render, screen } from '@testing-library/react';

import { Header } from '@/widgets/header/ui/Header';

// Мок для next/navigation
jest.mock('next/navigation', () => ({
  usePathname: () => '/',
}));

// Мок для ThemeToggle
jest.mock('@/shared/ui/feedback/theme-toggle', () => ({
  ThemeToggle: () => <div data-testid="theme-toggle-mock" />,
}));

// Мокаем matchMedia для мобильного меню
beforeAll(() => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation((query: string) => ({
      matches: true,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })) as unknown,
  });
});

describe('Header', () => {
  it('отображает логотип', () => {
    render(<Header />);

    // Проверяем наличие логотипа
    const logoLink = screen.getByRole('link', { name: 'Логотип' });
    expect(logoLink).toHaveAttribute('href', '/');
  });

  it('отображает навигационные ссылки', () => {
    render(<Header />);

    // Проверяем наличие ссылок
    expect(screen.getAllByText('Главная').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Анонимизация').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Документация').length).toBeGreaterThan(0);
  });

  it('отображает компонент ThemeToggle', () => {
    render(<Header />);

    // Проверяем наличие компонента ThemeToggle
    const themeToggle = screen.getByTestId('theme-toggle-mock');
    expect(themeToggle).toBeInTheDocument();
  });

  // TODO: jsdom не поддерживает Tailwind responsive классы, поэтому этот тест не работает корректно в JSDOM.
  // Поведение мобильного меню лучше покрыть юнит-тестом самого NavigationMenu.
  it.skip('открывает мобильное меню при клике на кнопку', () => {
    // см. комментарий выше
  });
});
