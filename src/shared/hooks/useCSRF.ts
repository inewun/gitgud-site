'use client';

import { useState, useCallback, useEffect } from 'react';

const CSRF_HEADER_NAME = 'X-CSRF-Token';
const CSRF_COOKIE_INDICATOR = 'csrf_token_exists';
const CSRF_TOKEN_STORAGE_KEY = 'csrfToken';

/**
 * Хук для получения и использования CSRF токена в клиентских компонентах
 * Использует более безопасный подход без метатегов
 * @returns Объект с методами для работы с CSRF токеном
 */
export function useCSRF() {
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  const [csrfTokenReady, setCsrfTokenReady] = useState<boolean>(false);

  // Проверяем наличие CSRF токена по индикаторной куке
  const isCsrfTokenAvailable = useCallback((): boolean => {
    return document.cookie.includes(`${CSRF_COOKIE_INDICATOR}=1`);
  }, []);

  // Инициализируем состояние CSRF токена при загрузке компонента
  useEffect(() => {
    const hasToken = isCsrfTokenAvailable();
    setCsrfTokenReady(hasToken);

    // Если токена нет, делаем запрос к API для создания нового токена
    if (!hasToken && typeof window !== 'undefined') {
      fetch('/api/csrf', { method: 'GET' })
        .then(() => {
          setCsrfTokenReady(true);
        })
        .catch(err => {
          // eslint-disable-next-line no-console
          console.error('Ошибка при получении CSRF токена:', err);
        });
    }
  }, [isCsrfTokenAvailable]);

  // Получение CSRF токена с сервера
  const fetchCSRFToken = useCallback(async () => {
    try {
      const response = await fetch('/api/csrf', {
        method: 'GET',
        credentials: 'include',
      });

      const token = response.headers.get('x-csrf-token');
      if (token) {
        localStorage.setItem(CSRF_TOKEN_STORAGE_KEY, token);
        return token;
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Ошибка при получении CSRF токена:', error);
    }
  }, []);

  // Получение CSRF токена из localStorage
  const getCSRFToken = useCallback((): string | null => {
    return localStorage.getItem(CSRF_TOKEN_STORAGE_KEY);
  }, []);

  // Применение CSRF токена к опциям запроса
  const applyCSRFToken = useCallback(
    (options: RequestInit): RequestInit => {
      const token = getCSRFToken();

      if (options.headers instanceof Headers) {
        const newHeaders = new Headers(options.headers);
        if (token && !newHeaders.has(CSRF_HEADER_NAME)) {
          newHeaders.set(CSRF_HEADER_NAME, token);
        }
        return { ...options, headers: newHeaders };
      } else if (options.headers && typeof options.headers === 'object') {
        const newHeaders = { ...options.headers } as Record<string, string>;
        if (token && !newHeaders[CSRF_HEADER_NAME]) {
          newHeaders[CSRF_HEADER_NAME] = token;
        }
        return { ...options, headers: newHeaders };
      } else {
        const newHeaders: Record<string, string> = {};
        if (token) newHeaders[CSRF_HEADER_NAME] = token;
        return { ...options, headers: newHeaders };
      }
    },
    [getCSRFToken],
  );

  // Добавляем CSRF токен к fetch запросам
  const fetchWithCSRF = useCallback(
    async (url: string, options: RequestInit = {}) => {
      if (!csrfTokenReady) {
        throw new Error('CSRF токен не готов. Дождитесь инициализации.');
      }

      // Запрашиваем CSRF токен с сервера для текущей сессии
      const csrfResponse = await fetch('/api/csrf/token', {
        method: 'GET',
        credentials: 'include',
      });

      if (!csrfResponse.ok) {
        throw new Error('Не удалось получить CSRF токен');
      }

      interface CSRFResponse {
        token: string;
      }

      const responseData = (await csrfResponse.json()) as CSRFResponse;

      if (!responseData.token) {
        throw new Error('CSRF токен не найден');
      }

      const headers = new Headers(options.headers);
      headers.set(CSRF_HEADER_NAME, responseData.token);

      return fetch(url, {
        ...options,
        headers,
        credentials: 'include',
      });
    },
    [csrfTokenReady],
  );

  // Получаем объект заголовков с CSRF токеном асинхронно
  const getCSRFHeaders = useCallback(async (): Promise<Record<string, string>> => {
    if (!csrfTokenReady) {
      throw new Error('CSRF токен не готов. Дождитесь инициализации.');
    }

    // Запрашиваем CSRF токен с сервера для текущей сессии
    const csrfResponse = await fetch('/api/csrf/token', {
      method: 'GET',
      credentials: 'include',
    });

    if (!csrfResponse.ok) {
      // eslint-disable-next-line no-console
      console.warn('Не удалось получить CSRF токен');
      return {};
    }

    interface CSRFResponse {
      token: string;
    }

    const responseData = (await csrfResponse.json()) as CSRFResponse;

    if (!responseData.token) {
      // eslint-disable-next-line no-console
      console.warn('CSRF токен не найден');
      return {};
    }

    return {
      [CSRF_HEADER_NAME]: responseData.token,
    };
  }, [csrfTokenReady]);

  return {
    csrfTokenReady,
    fetchWithCSRF,
    getCSRFHeaders,
    fetchCSRFToken,
    getCSRFToken,
    applyCSRFToken,
  };
}
