import { render, screen, fireEvent } from '@testing-library/react';

import { TextareaField } from '../inputs';

describe('TextareaField', () => {
  it('должен отображаться с указанной меткой', () => {
    render(<TextareaField id="test-textarea" label="Описание" />);

    expect(screen.getByLabelText('Описание')).toBeInTheDocument();
    expect(screen.getByText('Описание')).toBeInTheDocument();
  });

  it('должен отображать текст ошибки при наличии', () => {
    render(<TextareaField id="test-textarea" label="Описание" error="Обязательное поле" />);

    expect(screen.getByText('Обязательное поле')).toBeInTheDocument();
    expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true');
  });

  it('должен устанавливать атрибуты доступности', () => {
    render(
      <TextareaField
        id="test-textarea"
        label="Описание"
        error="Обязательное поле"
        aria-required={true}
      />,
    );

    const textarea = screen.getByRole('textbox');
    expect(textarea).toHaveAttribute('aria-required', 'true');
    expect(textarea).toHaveAttribute('aria-invalid', 'true');
    expect(textarea).toHaveAttribute('aria-describedby', 'test-textarea-error');
  });

  it('должен применять классы для поля с ошибкой', () => {
    render(<TextareaField id="test-textarea" error="Ошибка" />);

    const textarea = screen.getByRole('textbox');
    expect(textarea).toHaveClass('border-destructive');
  });

  it('позволяет вводить текст', () => {
    render(<TextareaField id="test-textarea" />);

    const textarea = screen.getByRole('textbox');
    fireEvent.change(textarea, { target: { value: 'Текст примера' } });

    expect(textarea).toHaveValue('Текст примера');
  });

  it('должен передавать пользовательские пропсы в textarea', () => {
    render(
      <TextareaField id="test-textarea" placeholder="Введите текст..." maxLength={100} readOnly />,
    );

    const textarea = screen.getByRole('textbox');
    expect(textarea).toHaveAttribute('placeholder', 'Введите текст...');
    expect(textarea).toHaveAttribute('maxLength', '100');
    expect(textarea).toHaveAttribute('readOnly');
  });

  it('должен применять пользовательские классы', () => {
    render(<TextareaField id="test-textarea" className="custom-class" />);

    const container = screen.getByRole('textbox').parentElement;
    expect(container).toHaveClass('custom-class');
  });
});
