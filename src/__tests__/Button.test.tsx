import React from 'react';

import { render, screen } from '@testing-library/react';

import { Button } from '@/shared/ui/inputs/button/Button';

describe('Button', () => {
  it('отображается корректно с базовыми свойствами', () => {
    render(<Button>Тестовая кнопка</Button>);

    const button = screen.getByRole('button', { name: 'Тестовая кнопка' });
    expect(button).toBeInTheDocument();
    // Проверяем тип по умолчанию
    expect(button).toHaveAttribute('type', 'button');
  });

  it('принимает различные варианты оформления', () => {
    const { rerender } = render(<Button variant="default">Кнопка</Button>);
    let button = screen.getByRole('button', { name: 'Кнопка' });
    expect(button).toHaveClass('bg-primary');

    rerender(<Button variant="secondary">Кнопка</Button>);
    button = screen.getByRole('button', { name: 'Кнопка' });
    expect(button).toHaveClass('bg-secondary');

    rerender(<Button variant="outline">Кнопка</Button>);
    button = screen.getByRole('button', { name: 'Кнопка' });
    expect(button).toHaveClass('border');
  });

  it('поддерживает различные размеры', () => {
    const { rerender } = render(<Button size="md">Кнопка</Button>);
    let button = screen.getByRole('button', { name: 'Кнопка' });
    expect(button).toHaveClass('h-9');

    rerender(<Button size="sm">Кнопка</Button>);
    button = screen.getByRole('button', { name: 'Кнопка' });
    expect(button).toHaveClass('h-8');

    rerender(<Button size="lg">Кнопка</Button>);
    button = screen.getByRole('button', { name: 'Кнопка' });
    expect(button).toHaveClass('h-10');
  });

  it('поддерживает полную ширину', () => {
    render(<Button fullWidth>Кнопка во всю ширину</Button>);
    const button = screen.getByRole('button', { name: 'Кнопка во всю ширину' });
    expect(button).toHaveClass('w-full');
  });

  it('корректно обрабатывает отключение', () => {
    render(<Button disabled>Отключенная кнопка</Button>);
    const button = screen.getByRole('button', { name: 'Отключенная кнопка' });
    expect(button).toBeDisabled();
  });

  it('поддерживает ARIA-атрибуты для доступности', () => {
    render(
      <Button
        aria-label="Описание кнопки"
        aria-controls="controlled-element"
        aria-describedby="description-element"
        aria-pressed={true}
        aria-expanded={true}
        aria-current="page"
      >
        Доступная кнопка
      </Button>,
    );

    const button = screen.getByRole('button', { name: 'Описание кнопки' });
    expect(button).toHaveAttribute('aria-label', 'Описание кнопки');
    expect(button).toHaveAttribute('aria-controls', 'controlled-element');
    expect(button).toHaveAttribute('aria-describedby', 'description-element');
    expect(button).toHaveAttribute('aria-pressed', 'true');
    expect(button).toHaveAttribute('aria-expanded', 'true');
    expect(button).toHaveAttribute('aria-current', 'page');
  });
});
