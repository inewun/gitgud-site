import type { UseAnonymizeOptions } from '@/features/anonymize/hooks/useAnonymize';

import { anonymizeService } from '../api/anonymize.service';

import { copyToClipboard, downloadTextFile } from './text-utils';

/**
 * Модель для работы с анонимизацией данных
 */
export const anonymizeModel = {
  /**
   * Выполняет анонимизацию текста с заданными опциями
   */
  anonymizeText(text: string, options: Partial<UseAnonymizeOptions>): string {
    try {
      return anonymizeService.anonymizeText(text, options);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Ошибка при анонимизации:', error);
      throw error;
    }
  },

  /**
   * Копирует текст в буфер обмена
   */
  async copyToClipboard(text: string): Promise<void> {
    try {
      await copyToClipboard(text);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Ошибка при копировании:', error);
      throw error;
    }
  },

  /**
   * Скачивает текст как файл
   */
  downloadAsFile(text: string): void {
    downloadTextFile(text);
  },

  /**
   * Конфигурация опций анонимизации для UI
   */
  getOptionsConfig() {
    return [
      { key: 'anonymizeNames', label: 'Имена', id: 'option-names' },
      { key: 'anonymizeEmails', label: 'Email', id: 'option-emails' },
      { key: 'anonymizePhones', label: 'Телефоны', id: 'option-phones' },
      { key: 'anonymizeNumbers', label: 'Числовые данные', id: 'option-numbers' },
    ];
  },

  /**
   * Дефолтные опции анонимизации
   */
  getDefaultOptions(): UseAnonymizeOptions {
    return {
      anonymizeEmails: true,
      anonymizePhones: true,
      anonymizeNames: true,
      anonymizeNumbers: false,
      replacementPlaceholder: '[ДАННЫЕ УДАЛЕНЫ]',
    };
  },
};
