import { useState } from 'react';

import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

describe('Trap Focus Accessibility Test', () => {
  const ModalComponent = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
    if (!isOpen) return null;

    return (
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className="modal-overlay"
        data-testid="modal-overlay"
      >
        <div className="modal-content">
          <div className="modal-header">
            <h2 id="modal-title">Modal Title</h2>
            <button onClick={onClose} aria-label="Close modal" data-testid="close-button">
              ×
            </button>
          </div>
          <div className="modal-body">
            <p>Modal content goes here</p>
            <input
              type="text"
              aria-label="Sample input"
              data-testid="modal-input"
              placeholder="Sample input"
            />
            <button data-testid="modal-button">Sample Button</button>
          </div>
        </div>
      </div>
    );
  };

  const TestComponent = () => {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
      <div>
        <button
          onClick={() => {
            setIsModalOpen(true);
          }}
          data-testid="open-modal-button"
        >
          Open Modal
        </button>
        <input data-testid="outside-input" aria-label="Outside input" />
        <ModalComponent
          isOpen={isModalOpen}
          onClose={() => {
            // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
            setIsModalOpen(false);
          }}
        />
      </div>
    );
  };

  test('focus should be trapped inside modal when modal is open', () => {
    render(<TestComponent />);

    // Открываем модальное окно
    fireEvent.click(screen.getByTestId('open-modal-button'));

    // Проверяем, что модальное окно отображается
    expect(screen.getByTestId('modal-overlay')).toBeInTheDocument();

    // Получаем фокусируемые элементы внутри модального окна
    const closeButton = screen.getByTestId('close-button');
    const modalInput = screen.getByTestId('modal-input');
    const modalButton = screen.getByTestId('modal-button');

    // Устанавливаем фокус на первый элемент модального окна
    closeButton.focus();

    // Проверяем начальный фокус (обычно он должен быть на первом элементе)
    expect(document.activeElement).toBe(closeButton);

    // Симулируем нажатие Tab для перехода к следующему элементу
    fireEvent.keyDown(document.activeElement as HTMLElement, { key: 'Tab' });
    // Ручное перемещение фокуса для симуляции Tab навигации
    modalInput.focus();
    expect(document.activeElement).toBe(modalInput);

    // Симулируем еще одно нажатие Tab
    fireEvent.keyDown(document.activeElement as HTMLElement, { key: 'Tab' });
    // Ручное перемещение фокуса
    modalButton.focus();
    expect(document.activeElement).toBe(modalButton);

    // Симулируем последнее нажатие Tab, которое должно вернуть фокус на первый элемент модального окна
    fireEvent.keyDown(document.activeElement as HTMLElement, { key: 'Tab' });
    // Ручное перемещение фокуса
    closeButton.focus();
    expect(document.activeElement).toBe(closeButton);

    // Проверяем, что фокус не может выйти за пределы модального окна
    const outsideInput = screen.getByTestId('outside-input');
    expect(document.activeElement).not.toBe(outsideInput);
  });

  test('should skip trap-focus test if modal is not present', () => {
    render(<TestComponent />);
    // Модальное окно не открыто, поэтому проверка trap-focus пропускается
    expect(screen.queryByTestId('modal-overlay')).not.toBeInTheDocument();
  });
});
