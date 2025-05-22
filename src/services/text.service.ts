/**
 * Сервис для работы с текстом и вспомогательные функции
 */

/**
 * Обрабатывает текст для анонимизации дат
 * @param text Входной текст
 * @returns Обработанный текст с замененными датами
 */
export const processDates = (text: string): string => {
  return text.replace(/\d{2}[./-]\d{2}[./-]\d{4}/g, '[ДАТА]');
};

/**
 * Обрабатывает текст для анонимизации адресов
 * @param text Входной текст
 * @returns Обработанный текст с замененными адресами
 */
export const processAddresses = (text: string): string => {
  return text.replace(/[гул]\.\s?[А-Я][а-я]+,\s?[А-Я][а-я]+\s?[а-я]+\.\s?\d+/g, '[АДРЕС]');
};

/**
 * Обрабатывает текст для анонимизации IP-адресов
 * @param text Входной текст
 * @returns Обработанный текст с замененными IP-адресами
 */
export const processIPs = (text: string): string => {
  return text.replace(/\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/g, '[IP-АДРЕС]');
};

/**
 * Копирует текст в буфер обмена
 * @param text Текст для копирования
 * @returns Promise, который разрешается после копирования
 */
export const copyToClipboard = async (text: string): Promise<void> => {
  if (text) {
    try {
      await navigator.clipboard.writeText(text);
      return Promise.resolve();
    } catch (error) {
      // eslint-disable-next-line no-console
      console.warn('Не удалось скопировать текст в буфер обмена:', error);
      return Promise.reject(new Error('Не удалось скопировать текст в буфер обмена'));
    }
  }
  return Promise.resolve();
};

/**
 * Создает и загружает текстовый файл
 * @param text Содержимое файла
 * @param filename Имя файла для загрузки
 */
export const downloadTextFile = (
  text: string,
  filename: string = 'анонимизированный_текст.txt',
): void => {
  if (text) {
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
};

/**
 * Класс для работы с текстом
 */
class TextService {
  /**
   * Применяет дополнительную обработку текста согласно настройкам
   * @param text Входной текст
   * @param settings Настройки обработки
   * @returns Обработанный текст
   */
  processTextWithSettings(
    text: string,
    settings: {
      dates?: boolean;
      addresses?: boolean;
      ips?: boolean;
    } = {},
  ): string {
    let result = text;

    if (settings.dates) {
      result = processDates(result);
    }

    if (settings.addresses) {
      result = processAddresses(result);
    }

    if (settings.ips) {
      result = processIPs(result);
    }

    return result;
  }

  /**
   * Копирует текст в буфер обмена
   */
  copyToClipboard = copyToClipboard;

  /**
   * Загружает текст как файл
   */
  downloadTextFile = downloadTextFile;
}

export const textService = new TextService();
export default textService;
