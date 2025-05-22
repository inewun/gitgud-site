import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';

import { Button } from '@/shared/ui/inputs/button';
import { AccessibleFocus } from '@/shared/ui/utils/accessible-focus';

/**
 * Набор тестов для проверки компонентов в граничных условиях
 * Тестирует экстремальные значения и пограничные случаи
 */
describe('Граничные случаи компонентов', () => {
  describe('Button - граничные случаи', () => {
    test('Рендерится с очень длинным текстом', () => {
      const longText =
        'Это очень длинный текст кнопки который превышает обычные размеры кнопки и должен корректно обрабатываться компонентом без переполнения или искажения интерфейса пользователя при отображении этого текста'.repeat(
          3,
        );

      render(
        <Button style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {longText}
        </Button>,
      );

      expect(screen.getByRole('button')).toHaveTextContent(longText);
      // Контейнер не должен переполняться
      expect(screen.getByRole('button')).toHaveStyle({
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
      });
    });

    test('Рендерится с пустым содержимым', () => {
      render(<Button>{''}</Button>);

      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
      // Должна иметь минимальную ширину и высоту
      expect(button).not.toHaveStyle({ width: '0px', height: '0px' });
    });

    test('Корректно обрабатывает многочисленные быстрые клики', async () => {
      const mockFn = jest.fn();
      const user = userEvent.setup();

      render(<Button onClick={mockFn}>Тест множественных кликов</Button>);

      // Симулируем быстрые клики
      await user.click(screen.getByRole('button'));
      await user.click(screen.getByRole('button'));
      await user.click(screen.getByRole('button'));
      await user.click(screen.getByRole('button'));
      await user.click(screen.getByRole('button'));

      // Все клики должны быть обработаны
      expect(mockFn).toHaveBeenCalledTimes(5);
    });
  });

  describe('AccessibleFocus - граничные случаи', () => {
    test('Рендерится с вложенными интерактивными элементами', () => {
      render(
        <AccessibleFocus data-testid="accessible-focus">
          <button>Вложенная кнопка</button>
          <input type="text" placeholder="Вложенный ввод" />
          <a href="https://example.com">Вложенная ссылка</a>
        </AccessibleFocus>,
      );

      // Основной элемент должен быть корректно отрендерен
      const container = screen.getByTestId('accessible-focus');
      expect(container).toHaveAttribute('tabIndex', '0');

      // Вложенные элементы должны быть доступны
      expect(screen.getByRole('button', { name: 'Вложенная кнопка' })).toBeInTheDocument();
      expect(screen.getByRole('textbox')).toBeInTheDocument();
      expect(screen.getByRole('link')).toBeInTheDocument();
    });

    test('Доступна для клавиатурной навигации', () => {
      render(
        <AccessibleFocus>
          <span>Фокусируемый контент</span>
        </AccessibleFocus>,
      );

      const element = screen.getByRole('button');

      // Элемент должен быть фокусируемым с клавиатуры
      expect(element).toHaveAttribute('tabIndex', '0');
      expect(element).toHaveAccessibleName();
      expect(element).toHaveAttribute('aria-live', 'polite');
    });

    test('Корректно обрабатывает отсутствие содержимого', () => {
      render(<AccessibleFocus>{null}</AccessibleFocus>);

      const container = screen.getByRole('button');
      expect(container).toBeInTheDocument();
      expect(container).toBeEmptyDOMElement();
      // Должен сохранять функциональность
      expect(container).toHaveAttribute('tabIndex', '0');
    });
  });
});
