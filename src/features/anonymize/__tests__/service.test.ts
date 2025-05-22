import { anonymize } from '@/features/anonymize/core/anonymizer';
import { sanitizeInput } from '@/features/anonymize/core/sanitizer';

import { anonymizeService } from '../api/anonymize.service';

// Мокаем зависимости
jest.mock('@/features/anonymize/core/anonymizer', () => ({
  anonymize: jest.fn((text: string) => text),
}));

jest.mock('@/features/anonymize/core/sanitizer', () => ({
  sanitizeInput: jest.fn((text: string) => text),
}));

describe('AnonymizeService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('anonymizeText', () => {
    it('должен вызывать anonymize с правильными параметрами', () => {
      const text = 'Тестовый текст с персональными данными';
      // Используем правильные имена полей из UseAnonymizeOptions
      const options = { anonymizeNames: true, anonymizeEmails: false };

      anonymizeService.anonymizeText(text, options);

      // Ожидаем вызов мока с правильными параметрами
      expect(anonymize).toHaveBeenCalledWith(
        text,
        expect.objectContaining({
          replaceNames: true,
          replaceEmails: false,
          replacePhones: true,
        }),
      );
      expect(anonymize).toHaveBeenCalledTimes(1);
    });

    it('должен санитизировать результат анонимизации', () => {
      const text = 'Тестовый текст с персональными данными';
      const anonymizedText = 'Анонимизированный текст';

      (anonymize as jest.Mock).mockReturnValueOnce(anonymizedText);

      anonymizeService.anonymizeText(text);

      expect(sanitizeInput).toHaveBeenCalledWith(anonymizedText);
      expect(sanitizeInput).toHaveBeenCalledTimes(1);
    });

    it('должен возвращать санитизированный результат', () => {
      const text = 'Тестовый текст с персональными данными';
      const anonymizedText = 'Анонимизированный текст';
      const sanitizedText = 'Безопасный анонимизированный текст';

      (anonymize as jest.Mock).mockReturnValueOnce(anonymizedText);
      (sanitizeInput as jest.Mock).mockReturnValueOnce(sanitizedText);

      const result = anonymizeService.anonymizeText(text);

      expect(result).toBe(sanitizedText);
    });
  });

  describe('sanitizeInput', () => {
    it('должен вызывать sanitizeInput из core/sanitizer', () => {
      const inputText = '<script>alert("XSS")</script>';

      anonymizeService.sanitizeInput(inputText);

      expect(sanitizeInput).toHaveBeenCalledWith(inputText);
      expect(sanitizeInput).toHaveBeenCalledTimes(1);
    });

    it('должен возвращать результат sanitizeInput', () => {
      const inputText = '<script>alert("XSS")</script>';
      const sanitizedText = 'Безопасный текст';

      (sanitizeInput as jest.Mock).mockReturnValueOnce(sanitizedText);

      const result = anonymizeService.sanitizeInput(inputText);

      expect(result).toBe(sanitizedText);
    });
  });
});
