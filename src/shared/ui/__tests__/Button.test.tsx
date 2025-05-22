import { render, screen, fireEvent } from '@testing-library/react';

import { Button } from '../inputs';

describe('Button', () => {
  it('должна отображаться с текстовым содержимым', () => {
    render(<Button>Нажми меня</Button>);
    const button = screen.getByText('Нажми меня');
    expect(button).toBeInTheDocument();
  });

  it('должна применять базовые классы стилей', () => {
    render(<Button>Текст кнопки</Button>);
    const button = screen.getByText('Текст кнопки');

    expect(button).toHaveClass('rounded-md');
    expect(button).toHaveClass('transition-colors');
    expect(button).toHaveClass('focus-visible:outline-none');
  });

  it('должна применять стили в зависимости от варианта', () => {
    const { rerender } = render(<Button variant="default">Кнопка</Button>);
    let button = screen.getByText('Кнопка');

    expect(button).toHaveClass('bg-primary');
    expect(button).toHaveClass('text-white');

    rerender(<Button variant="secondary">Кнопка</Button>);
    button = screen.getByText('Кнопка');

    expect(button).toHaveClass('bg-secondary');

    rerender(<Button variant="outline">Кнопка</Button>);
    button = screen.getByText('Кнопка');

    expect(button).toHaveClass('border');

    rerender(<Button variant="ghost">Кнопка</Button>);
    button = screen.getByText('Кнопка');

    expect(button).toHaveClass('bg-transparent');
    expect(button).toHaveClass('hover:bg-subtle');
  });

  it('должна применять стили в зависимости от размера', () => {
    const { rerender } = render(<Button size="sm">Кнопка</Button>);
    let button = screen.getByText('Кнопка');

    expect(button).toHaveClass('h-8');
    expect(button).toHaveClass('px-3');
    expect(button).toHaveClass('text-xs');

    rerender(<Button size="md">Кнопка</Button>);
    button = screen.getByText('Кнопка');

    expect(button).toHaveClass('h-9');
    expect(button).toHaveClass('px-4');
    expect(button).toHaveClass('py-2');

    rerender(<Button size="lg">Кнопка</Button>);
    button = screen.getByText('Кнопка');

    expect(button).toHaveClass('h-10');
    expect(button).toHaveClass('px-6');
  });

  it('должна быть неактивной при disabled=true', () => {
    render(<Button disabled>Кнопка</Button>);
    const button = screen.getByText('Кнопка');

    expect(button).toBeDisabled();
    expect(button).toHaveClass('disabled:opacity-50');
  });

  it('должна отображать индикатор загрузки при isLoading=true', () => {
    render(<Button isLoading>Кнопка</Button>);

    const svgElement = document.querySelector('svg.animate-spin');
    expect(svgElement).toBeInTheDocument();

    expect(screen.getByText('Кнопка')).toBeInTheDocument();
  });

  it('должна вызывать функцию обработчика при клике', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Кнопка</Button>);

    const button = screen.getByText('Кнопка');
    fireEvent.click(button);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('не должна вызывать обработчик клика при isLoading=true', () => {
    const handleClick = jest.fn();
    render(
      <Button onClick={handleClick} isLoading>
        Кнопка
      </Button>,
    );

    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(handleClick).not.toHaveBeenCalled();
  });

  it('должна иметь правильные aria-атрибуты при разных состояниях', () => {
    const { rerender } = render(<Button>Обычная кнопка</Button>);
    let button = screen.getByRole('button');

    // Обычная кнопка не должна иметь aria-busy и aria-disabled
    expect(button).not.toHaveAttribute('aria-busy');
    expect(button).not.toHaveAttribute('aria-disabled');

    // Кнопка в состоянии загрузки
    rerender(<Button isLoading>Загрузка</Button>);
    button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-busy', 'true');

    // Свойство disabled должно устанавливать aria-disabled
    rerender(<Button disabled>Неактивная кнопка</Button>);
    button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-disabled', 'true');

    // Спиннер должен иметь правильные атрибуты для скринридеров
    rerender(<Button isLoading>Кнопка со спиннером</Button>);
    const spinner = document.querySelector('svg[role="status"]');
    expect(spinner).toBeInTheDocument();
    expect(spinner).toHaveAttribute('aria-label', 'common.loading');
  });
});
