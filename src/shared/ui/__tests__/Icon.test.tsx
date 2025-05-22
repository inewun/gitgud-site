import { render, screen } from '@testing-library/react';

import { Icon } from '../media/icon';

// Создаем мок-компонент иконки для тестов
const MockIconComponent = ({ className }: { className?: string }) => (
  <svg data-testid="svg-icon" className={className} viewBox="0 0 24 24">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />
  </svg>
);

describe('Icon', () => {
  it('должен отображать SVG-компонент иконки', () => {
    render(<Icon icon={MockIconComponent} />);
    expect(screen.getByTestId('svg-icon')).toBeInTheDocument();
  });

  it('должен отображать строковую иконку (css-класс)', () => {
    render(<Icon icon="icon-class" data-testid="string-icon" />);
    const iconElement = screen.getByTestId('string-icon');
    expect(iconElement).toHaveClass('icon-class');
  });

  it('должен применять дополнительные классы к компоненту иконки', () => {
    render(<Icon icon={MockIconComponent} className="custom-class" />);
    expect(screen.getByTestId('svg-icon')).toHaveClass('custom-class');
  });

  it('должен применять дополнительные классы к строковой иконке', () => {
    render(<Icon icon="icon-class" className="custom-class" data-testid="string-icon" />);
    expect(screen.getByTestId('string-icon')).toHaveClass('icon-class');
    expect(screen.getByTestId('string-icon')).toHaveClass('custom-class');
  });

  it('должен устанавливать атрибут role по умолчанию', () => {
    render(<Icon icon={MockIconComponent} data-testid="icon-wrapper" />);
    expect(screen.getByTestId('icon-wrapper')).toHaveAttribute('role', 'img');
  });

  it('должен устанавливать пользовательское значение role', () => {
    render(<Icon icon={MockIconComponent} role="presentation" data-testid="icon-wrapper" />);
    expect(screen.getByTestId('icon-wrapper')).toHaveAttribute('role', 'presentation');
  });

  it('должен устанавливать aria-label при предоставлении', () => {
    render(
      <Icon icon={MockIconComponent} aria-label="Значок профиля" data-testid="icon-wrapper" />,
    );
    expect(screen.getByTestId('icon-wrapper')).toHaveAttribute('aria-label', 'Значок профиля');
  });

  it('должен передавать дополнительные HTML-атрибуты', () => {
    render(<Icon icon={MockIconComponent} data-testid="icon-wrapper" tabIndex={0} />);

    const iconWrapper = screen.getByTestId('icon-wrapper');
    expect(iconWrapper).toHaveAttribute('tabindex', '0');
  });

  test('Показывает иконку с доступной подписью', () => {
    render(<Icon icon={MockIconComponent} label="Описание иконки" data-testid="test-icon" />);

    const icon = screen.getByTestId('test-icon');
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveAttribute('aria-label', 'Описание иконки');
  });

  test('Правильно передает дополнительные атрибуты', () => {
    render(
      <Icon
        icon={MockIconComponent}
        data-testid="test-icon"
        aria-label="Тестовая иконка"
        tabIndex={0}
      />,
    );

    const icon = screen.getByTestId('test-icon');
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveAttribute('aria-label', 'Тестовая иконка');
    expect(icon).toHaveAttribute('tabindex', '0');
  });
});
