/**
 * Копирует текст в буфер обмена
 */
export async function copyToClipboard(text: string): Promise<void> {
  try {
    await navigator.clipboard.writeText(text);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Ошибка при копировании в буфер обмена:', error);
    throw error;
  }
}

/**
 * Скачивает текст как файл
 */
export function downloadTextFile(text: string, filename = 'anonymized-text.txt'): void {
  const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
