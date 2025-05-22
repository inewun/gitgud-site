'use server';

import { revalidatePath } from 'next/cache';

/**
 * Серверное действие для получения данных
 * Директива 'use server' используется в начале файла для определения всех функций как серверных
 */
export async function fetchData(id: string) {
  // Здесь может быть реальный код получения данных из базы данных
  // или вызов внешнего API, который должен выполняться только на сервере

  // Симулируем получение данных
  await new Promise(resolve => setTimeout(resolve, 500));

  return {
    id,
    title: `Data item ${id}`,
    timestamp: new Date().toISOString(),
  };
}

/**
 * Серверное действие для сохранения данных
 */
export async function saveData(formData: FormData) {
  const title = formData.get('title') as string;
  const content = formData.get('content') as string;

  if (!title || !content) {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    return { success: false, message: 'Missing required fields' };
  }

  try {
    // Здесь код сохранения данных в базу или внешний сервис
    await new Promise(resolve => setTimeout(resolve, 500));

    // Инвалидируем кэш для указанного пути
    revalidatePath('/data');

    return { success: true, message: 'Data saved successfully' };
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Failed to save data:', error);
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    return { success: false, message: 'Failed to save data' };
  }
}

/**
 * Серверное действие для удаления данных
 */
export async function deleteData(_id: string) {
  try {
    // Код удаления данных из базы или внешнего сервиса
    await new Promise(resolve => setTimeout(resolve, 300));

    // Инвалидируем кэш для указанного пути
    revalidatePath('/data');

    return { success: true, message: 'Data deleted successfully' };
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Failed to delete data:', error);
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    return { success: false, message: 'Failed to delete data' };
  }
}
