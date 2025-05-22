/**
 * @jest-environment jsdom
 */
import * as DOMPurifyModule from 'dompurify';

import { sanitizeInput } from '../sanitize';

// Имитируем функцию isServer, всегда возвращая false, поскольку мы используем jsdom
jest.mock('@/shared/lib/utils/dom', () => ({
  isServer: jest.fn(() => false),
}));

// Определение интерфейса для типизации DOMPurify
interface DOMPurifyType {
  sanitize: (input: string, config?: { ALLOWED_TAGS?: string[] }) => string;
}

// Мокаем dompurify
jest.mock('dompurify', () => ({
  __esModule: true,
  default: {
    sanitize: jest.fn(),
  },
}));

const DOMPurify = DOMPurifyModule.default as DOMPurifyType;

beforeEach(() => {
  jest.clearAllMocks();
});

describe('sanitizeInput', () => {
  it('должен санитизировать вводные данные, используя DOMPurify', () => {
    // Создаем типизированный mockReturnValue
    const mockSanitize = DOMPurify.sanitize as jest.Mock;
    mockSanitize.mockReturnValueOnce('Sanitized text');

    // Получаем результат и проверяем
    const sanitizedText = sanitizeInput('<script>alert("XSS")</script>');
    expect(sanitizedText).toBe('Sanitized text');

    // Проверяем, что вызов был с правильными параметрами
    expect(mockSanitize).toHaveBeenCalledWith('<script>alert("XSS")</script>', {
      ALLOWED_TAGS: [],
    });
  });

  it('должен возвращать пустую строку для null или undefined', () => {
    // Проверяем обработку null
    const nullResult = sanitizeInput(null);
    expect(nullResult).toBe('');

    // Проверяем обработку undefined
    const undefinedResult = sanitizeInput(undefined);
    expect(undefinedResult).toBe('');

    // Проверяем, что DOMPurify не вызывается
    expect(DOMPurify.sanitize).not.toHaveBeenCalled();
  });

  it('должен преобразовывать числа в строки', () => {
    // Создаем типизированный mockReturnValue
    const mockSanitize = DOMPurify.sanitize as jest.Mock;
    mockSanitize.mockReturnValueOnce('123');

    // Вызываем функцию и проверяем результат
    const numberResult = sanitizeInput(123);
    expect(numberResult).toBe('123');

    // Проверяем параметры вызова
    expect(mockSanitize).toHaveBeenCalledWith('123', { ALLOWED_TAGS: [] });
  });

  it('должен преобразовывать объекты в строки при санитизации', () => {
    // Создаем объект с toString
    const obj = {
      toString: () => 'Object string representation',
    };

    // Создаем типизированный mockReturnValue
    const mockSanitize = DOMPurify.sanitize as jest.Mock;
    mockSanitize.mockReturnValueOnce('Object string representation');

    // Вызываем функцию и проверяем результат
    const objectResult = sanitizeInput(obj);
    expect(objectResult).toBe('Object string representation');

    // Проверяем параметры вызова
    expect(mockSanitize).toHaveBeenCalledWith('Object string representation', { ALLOWED_TAGS: [] });
  });
});
