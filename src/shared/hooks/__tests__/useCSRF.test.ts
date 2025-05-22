/* eslint-disable @typescript-eslint/unbound-method */
import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { renderHook, act } from '@testing-library/react';

import { useCSRF } from '../useCSRF';

// Мок для fetch
global.fetch = jest.fn() as jest.MockedFunction<typeof global.fetch>;

describe('useCSRF Hook', () => {
  beforeEach(() => {
    // Сбрасываем все моки перед каждым тестом
    jest.clearAllMocks();
    // Мокаем localStorage
    Storage.prototype.getItem = jest.fn() as jest.MockedFunction<typeof Storage.prototype.getItem>;
    Storage.prototype.setItem = jest.fn();

    // Мокаем cookie-заголовок
    Object.defineProperty(document, 'cookie', {
      writable: true,
      value: 'csrf_token_exists=1',
    });

    // Мокируем fetch для предотвращения реальных запросов
    (global.fetch as jest.MockedFunction<typeof global.fetch>).mockResolvedValue({
      ok: true,
      headers: {
        get: () => null,
      },
      json: () => Promise.resolve({ token: 'test-token' }),
    } as unknown as Response);
  });

  it('должен извлекать токен из заголовка X-CSRF-Token', async () => {
    // Мокаем fetch для возврата ответа с токеном в заголовке
    const csrfToken = 'test-csrf-token';
    (global.fetch as jest.MockedFunction<typeof global.fetch>).mockResolvedValueOnce({
      headers: {
        get: (header: string) => (header === 'x-csrf-token' ? csrfToken : null),
      },
    } as unknown as Response);

    const { result } = renderHook(() => useCSRF());

    // Вызываем функцию fetchCSRFToken
    await act(async () => {
      await result.current.fetchCSRFToken();
    });

    // Проверяем, что fetch был вызван с правильными параметрами
    expect(global.fetch).toHaveBeenCalledWith('/api/csrf', {
      method: 'GET',
      credentials: 'include',
    });

    // Проверяем, что токен был сохранен в localStorage
    expect(localStorage.setItem).toHaveBeenCalledWith('csrfToken', csrfToken);
  });

  it('должен использовать существующий токен из localStorage, если он есть', async () => {
    // Мокаем localStorage для возврата существующего токена
    const existingToken = 'existing-csrf-token';
    (Storage.prototype.getItem as jest.Mock).mockReturnValueOnce(existingToken);

    const { result } = renderHook(() => useCSRF());

    // Ждем завершения эффектов
    await act(async () => {
      await Promise.resolve();
    });

    // Используем стрелочную функцию для устранения проблемы с this
    const { getCSRFToken } = result.current;
    const getToken = () => getCSRFToken();

    // Проверяем, что функция вернула существующий токен
    expect(getToken()).toBe(existingToken);
  });

  it('должен применять токен к запросам', async () => {
    // Мокаем localStorage для возврата существующего токена
    const existingToken = 'existing-csrf-token';
    (Storage.prototype.getItem as jest.Mock).mockReturnValueOnce(existingToken);

    const { result } = renderHook(() => useCSRF());

    // Ждем завершения эффектов
    await act(async () => {
      await Promise.resolve();
    });

    // Создаем тестовый объект с опциями запроса
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ test: 'data' }),
    };

    // Используем стрелочную функцию для устранения проблемы с this
    const { applyCSRFToken } = result.current;
    const applyToken = (opts: RequestInit) => applyCSRFToken(opts);

    // Применяем CSRF токен к опциям
    const updatedOptions = applyToken(options);

    // Проверяем, что токен был добавлен в заголовки
    expect(
      updatedOptions.headers instanceof Headers || typeof updatedOptions.headers === 'object',
    ).toBeTruthy();

    // Получаем все заголовки из объекта Headers
    const headers = updatedOptions.headers;
    if (headers instanceof Headers) {
      expect(headers.get('Content-Type')).toBe('application/json');
      expect(headers.get('X-CSRF-Token')).toBe(existingToken);
    } else {
      expect((headers as Record<string, string>)['Content-Type']).toBe('application/json');
      expect((headers as Record<string, string>)['X-CSRF-Token']).toBe(existingToken);
    }
  });

  it('должен обрабатывать отсутствие токена при применении', async () => {
    // Мокаем localStorage для возврата null
    (Storage.prototype.getItem as jest.Mock).mockReturnValueOnce(null);

    const { result } = renderHook(() => useCSRF());

    // Ждем завершения эффектов
    await act(async () => {
      await Promise.resolve();
    });

    // Создаем тестовый объект с опциями запроса
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    // Используем стрелочную функцию для устранения проблемы с this
    const { applyCSRFToken } = result.current;
    const applyToken = (opts: RequestInit) => applyCSRFToken(opts);

    // Применяем CSRF токен к опциям (даже если его нет)
    const updatedOptions = applyToken(options);

    // Проверяем, что заголовки существуют
    expect(updatedOptions.headers).toBeDefined();

    // Получаем заголовки из опций
    const headers = updatedOptions.headers;
    if (headers instanceof Headers) {
      expect(headers.get('Content-Type')).toBe('application/json');
      expect(headers.get('X-CSRF-Token')).toBeNull();
    } else {
      expect((headers as Record<string, string>)['Content-Type']).toBe('application/json');
      expect((headers as Record<string, string>)['X-CSRF-Token']).toBeUndefined();
    }
  });

  it('должен обрабатывать ошибки при получении токена', async () => {
    // Мокаем fetch для генерации ошибки
    (global.fetch as jest.MockedFunction<typeof global.fetch>).mockRejectedValueOnce(
      new Error('Network error'),
    );

    const { result } = renderHook(() => useCSRF());

    // Используем стрелочную функцию для устранения проблемы с this
    const { fetchCSRFToken } = result.current;

    // Проверяем, что функция обрабатывает ошибку без падения
    await expect(fetchCSRFToken()).resolves.toBeUndefined();

    // Проверяем, что токен не был установлен
    expect(localStorage.setItem).not.toHaveBeenCalled();
  });

  it('не должен перезаписывать существующий X-CSRF-Token в headers-объекте', async () => {
    const existingToken = 'existing-csrf-token';
    (Storage.prototype.getItem as jest.Mock).mockReturnValueOnce('another-token');

    const { result } = renderHook(() => useCSRF());
    await act(async () => {
      await Promise.resolve();
    });

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': existingToken,
      },
    };
    const { applyCSRFToken } = result.current;
    const updatedOptions = applyCSRFToken(options);
    const headers = updatedOptions.headers;
    if (headers instanceof Headers) {
      expect(headers.get('X-CSRF-Token')).toBe(existingToken);
    } else {
      expect((headers as Record<string, string>)['X-CSRF-Token']).toBe(existingToken);
    }
  });
});
