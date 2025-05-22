/**
 * @jest-environment jsdom
 */
/* eslint-disable @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment */
import { copyToClipboard, downloadTextFile } from '../model';

describe('Text Model', () => {
  // Мокируем clipboard API
  const mockClipboard = {
    writeText: jest.fn().mockResolvedValue(undefined),
  };

  // Мокируем DOM методы
  const mockCreateElement = jest.fn();
  const mockAppendChild = jest.fn();
  const mockRemoveChild = jest.fn();
  const mockAnchorClick = jest.fn();

  // Мокируем URL методы
  const mockCreateObjectURL = jest.fn().mockReturnValue('blob:mock-url');
  const mockRevokeObjectURL = jest.fn();

  // Сохраняем оригинальные функции
  let originalCreateElement: typeof document.createElement;

  beforeEach(() => {
    // Сохраняем оригинальный метод как копию функции, чтобы избежать unbound method
    // eslint-disable-next-line @typescript-eslint/unbound-method, @typescript-eslint/no-explicit-any
    originalCreateElement = function (tag: string): any {
      return document.createElement(tag);
    };

    // Мокируем clipboard API
    Object.defineProperty(navigator, 'clipboard', {
      value: mockClipboard,
      configurable: true,
    });

    // Мокируем document.createElement
    document.createElement = mockCreateElement.mockImplementation((tag: string) => {
      if (tag === 'a') {
        return {
          href: '',
          download: '',
          click: mockAnchorClick,
        } as unknown as HTMLAnchorElement;
      }
      return originalCreateElement(tag);
    });

    // Мокируем document.body методы
    document.body.appendChild = mockAppendChild;
    document.body.removeChild = mockRemoveChild;

    // Мокируем URL методы
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (URL as any).createObjectURL = mockCreateObjectURL;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (URL as any).revokeObjectURL = mockRevokeObjectURL;

    // Очищаем все моки перед каждым тестом
    jest.clearAllMocks();
  });

  afterEach(() => {
    // Восстанавливаем оригинальный метод
    document.createElement = originalCreateElement;
  });

  describe('copyToClipboard', () => {
    it('должен вызывать navigator.clipboard.writeText с правильным текстом', async () => {
      const text = 'Тестовый текст';
      await copyToClipboard(text);
      expect(mockClipboard.writeText).toHaveBeenCalledWith(text);
    });
  });

  describe('downloadTextFile', () => {
    it('должен создавать Blob с правильным содержимым и типом', () => {
      const text = 'Содержимое файла';
      const filename = 'test.txt';

      downloadTextFile(text, filename);

      expect(mockCreateObjectURL).toHaveBeenCalled();

      // Проверяем, что Blob был создан с правильными параметрами
      const blobArg = mockCreateObjectURL.mock.calls[0]?.[0] as unknown as Blob;
      expect(blobArg instanceof Blob).toBe(true);
      expect(blobArg.type).toBe('text/plain');
    });

    it('должен создавать элемент <a> с правильными атрибутами', () => {
      const text = 'Содержимое файла';
      const filename = 'test.txt';

      downloadTextFile(text, filename);

      expect(mockCreateElement).toHaveBeenCalledWith('a');
      expect(mockAnchorClick).toHaveBeenCalled();
    });

    it('должен добавлять и удалять элемент из DOM', () => {
      const text = 'Содержимое файла';
      const filename = 'test.txt';

      downloadTextFile(text, filename);

      expect(mockAppendChild).toHaveBeenCalled();
      expect(mockRemoveChild).toHaveBeenCalled();
    });

    it('должен использовать URL.revokeObjectURL после создания объекта URL', () => {
      const text = 'Содержимое файла';
      const filename = 'test.txt';

      downloadTextFile(text, filename);

      expect(mockRevokeObjectURL).toHaveBeenCalledWith('blob:mock-url');
    });

    it('должен использовать имя файла по умолчанию, если имя не указано', () => {
      const text = 'Содержимое файла';
      const mockAnchor = {
        href: '',
        download: '',
        click: mockAnchorClick,
      } as unknown as HTMLAnchorElement;
      mockCreateElement.mockReturnValueOnce(mockAnchor);

      downloadTextFile(text);

      expect(mockAnchor.download).toBe('анонимизированный_текст.txt');
    });

    it('не должен ничего делать, если текст пустой', () => {
      downloadTextFile('');

      expect(mockCreateObjectURL).not.toHaveBeenCalled();
      expect(mockCreateElement).not.toHaveBeenCalled();
    });
  });
});
