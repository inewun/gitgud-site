import * as nextNavigation from 'next/navigation';

import { render, screen } from '@testing-library/react';

import { NavigationMenu } from '../navigation';

// Мокаем usePathname из next/navigation
jest.mock('next/navigation', () => ({
  usePathname: jest.fn(),
}));

describe('NavigationMenu', () => {
  const mockItems = [
    { href: '/', label: 'Главная' },
    { href: '/anonymize', label: 'Анонимизация' },
    { href: '/docs', label: 'Документация' },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('должен отображать все элементы навигации', () => {
    // Мокаем usePathname для возврата текущего пути
    jest.spyOn(nextNavigation, 'usePathname').mockReturnValue('/');

    render(<NavigationMenu items={mockItems} />);

    expect(screen.getByText('Главная')).toBeInTheDocument();
    expect(screen.getByText('Анонимизация')).toBeInTheDocument();
    expect(screen.getByText('Документация')).toBeInTheDocument();
  });

  it('должен отмечать активный элемент', () => {
    // Мокаем текущий путь как /anonymize
    jest.spyOn(nextNavigation, 'usePathname').mockReturnValue('/anonymize');

    render(<NavigationMenu items={mockItems} />);

    // Проверяем атрибут aria-current для активного элемента
    const activeLink = screen.getByText('Анонимизация').closest('a');
    expect(activeLink).toHaveAttribute('aria-current', 'page');

    // Проверяем, что у остальных ссылок нет атрибута aria-current
    const homeLink = screen.getByText('Главная').closest('a');
    const docsLink = screen.getByText('Документация').closest('a');

    expect(homeLink).not.toHaveAttribute('aria-current');
    expect(docsLink).not.toHaveAttribute('aria-current');
  });

  it('должен применять пользовательский класс', () => {
    jest.spyOn(nextNavigation, 'usePathname').mockReturnValue('/');

    render(<NavigationMenu items={mockItems} className="custom-nav-class" />);

    // Находим корневой элемент nav
    const navElement = screen.getByRole('navigation');
    expect(navElement).toHaveClass('custom-nav-class');
  });

  it('должен корректно отображать ссылки с указанными href', () => {
    jest.spyOn(nextNavigation, 'usePathname').mockReturnValue('/');

    render(<NavigationMenu items={mockItems} />);

    // Проверяем атрибуты href у ссылок
    const links = screen.getAllByRole('link');

    expect(links[0]).toHaveAttribute('href', '/');
    expect(links[1]).toHaveAttribute('href', '/anonymize');
    expect(links[2]).toHaveAttribute('href', '/docs');
  });

  it('должен отображать иконки, если они предоставлены', () => {
    const itemsWithIcons = [
      { href: '/', label: 'Главная', icon: <span data-testid="home-icon">🏠</span> },
      {
        href: '/anonymize',
        label: 'Анонимизация',
        icon: <span data-testid="anonymize-icon">🔒</span>,
      },
    ];

    jest.spyOn(nextNavigation, 'usePathname').mockReturnValue('/');

    render(<NavigationMenu items={itemsWithIcons} />);

    // Проверяем наличие иконок
    expect(screen.getByTestId('home-icon')).toBeInTheDocument();
    expect(screen.getByTestId('anonymize-icon')).toBeInTheDocument();
  });

  it('должен устанавливать корректные атрибуты доступности', () => {
    jest.spyOn(nextNavigation, 'usePathname').mockReturnValue('/');

    render(<NavigationMenu items={mockItems} />);

    // Проверяем атрибуты доступности
    const navElement = screen.getByRole('navigation');
    expect(navElement).toHaveAttribute('aria-label', 'Основная навигация');

    // Проверяем aria-label для каждой ссылки
    mockItems.forEach(item => {
      const link = screen.getByText(item.label).closest('a');
      expect(link).toHaveAttribute('aria-label', item.label);
    });
  });
});
