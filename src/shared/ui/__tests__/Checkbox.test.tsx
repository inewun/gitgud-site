import React from 'react';

import { render, screen, fireEvent } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';

import { Checkbox } from '../inputs/checkbox';

expect.extend(toHaveNoViolations);

describe('Checkbox', () => {
  it('рендерится с корректной меткой', () => {
    render(<Checkbox label="Тестовый чекбокс" />);
    expect(screen.getByLabelText('Тестовый чекбокс')).toBeInTheDocument();
  });

  it('изменяет состояние при клике', () => {
    const handleChange = jest.fn();
    render(<Checkbox label="Тестовый чекбокс" onChange={handleChange} />);

    const checkbox = screen.getByLabelText('Тестовый чекбокс');
    fireEvent.click(checkbox);

    expect(handleChange).toHaveBeenCalledWith(true);
  });

  it('рендерится в состоянии disabled', () => {
    render(<Checkbox label="Тестовый чекбокс" disabled />);

    const checkbox = screen.getByLabelText('Тестовый чекбокс');
    expect(checkbox).toBeDisabled();
  });

  it('отображает описание при наличии', () => {
    render(<Checkbox label="Тестовый чекбокс" description="Дополнительная информация" />);

    expect(screen.getByText('Дополнительная информация')).toBeInTheDocument();
  });

  it('отображает сообщение об ошибке', () => {
    render(<Checkbox label="Тестовый чекбокс" error="Ошибка валидации" />);

    const errorMessage = screen.getByText('Ошибка валидации');
    expect(errorMessage).toBeInTheDocument();
    expect(errorMessage).toHaveAttribute('role', 'alert');
  });

  it('поддерживает начальное состояние checked', () => {
    render(<Checkbox label="Тестовый чекбокс" checked />);

    const checkbox = screen.getByLabelText('Тестовый чекбокс');
    expect(checkbox).toBeChecked();
  });

  it('отображает индикатор required при необходимости', () => {
    render(<Checkbox label="Обязательное поле" required />);

    expect(screen.getByText('*')).toBeInTheDocument();
  });

  it('соответствует требованиям доступности WCAG', async () => {
    const { container } = render(
      <Checkbox
        label="Доступный чекбокс"
        description="Подробное описание для скринридеров"
        id="a11y-checkbox"
      />,
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
