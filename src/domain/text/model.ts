/**
 * Модель для работы с текстом
 */

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
