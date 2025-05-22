import { renderHook, act } from '@testing-library/react';

import { useAnonymizeStore } from '../useAnonymizeStore';

describe('useAnonymizeStore', () => {
  beforeEach(() => {
    // Сбрасываем состояние перед каждым тестом
    const { result } = renderHook(() => useAnonymizeStore());
    act(() => {
      // Сброс в исходное состояние
      result.current.setInputText('');
      result.current.setOutputText('');
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      result.current.setIsProcessing(false);
      result.current.setOptions({
        replaceNames: true,
        replaceEmails: true,
        replacePhones: true,
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        replaceDates: false,
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        replaceAddresses: false,
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        replaceIPs: false,
      });
    });
  });

  test('Начальное состояние хранилища', () => {
    const { result } = renderHook(() => useAnonymizeStore());

    expect(result.current.inputText).toBe('');
    expect(result.current.outputText).toBe('');
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    expect(result.current.isProcessing).toBe(false);
    expect(result.current.options).toEqual({
      replaceNames: true,
      replaceEmails: true,
      replacePhones: true,
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      replaceDates: false,
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      replaceAddresses: false,
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      replaceIPs: false,
    });
  });

  test('setInputText устанавливает текст ввода', () => {
    const { result } = renderHook(() => useAnonymizeStore());

    act(() => {
      result.current.setInputText('Тестовый текст');
    });

    expect(result.current.inputText).toBe('Тестовый текст');
  });

  test('setOutputText устанавливает анонимизированный текст', () => {
    const { result } = renderHook(() => useAnonymizeStore());

    act(() => {
      result.current.setOutputText('Анонимизированный текст');
    });

    expect(result.current.outputText).toBe('Анонимизированный текст');
  });

  test('setOptions обновляет настройки анонимизации', () => {
    const { result } = renderHook(() => useAnonymizeStore());

    act(() => {
      result.current.setOptions({
        replaceNames: false,
        replaceEmails: false,
        replacePhones: true,
      });
    });

    expect(result.current.options.replaceNames).toBe(false);
    expect(result.current.options.replaceEmails).toBe(false);
    expect(result.current.options.replacePhones).toBe(true); // Не изменилось
  });

  test('setIsProcessing обновляет состояние обработки', () => {
    const { result } = renderHook(() => useAnonymizeStore());

    act(() => {
      result.current.setIsProcessing(true);
    });

    expect(result.current.isProcessing).toBe(true);

    act(() => {
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      result.current.setIsProcessing(false);
    });

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    expect(result.current.isProcessing).toBe(false);
  });

  test('anonymize обрабатывает текст', async () => {
    const { result } = renderHook(() => useAnonymizeStore());

    act(() => {
      result.current.setInputText('Тестовый текст');
    });

    await act(async () => {
      await result.current.anonymize();
    });

    // Проверяем, что outputText не пустой после анонимизации
    expect(result.current.outputText).not.toBe('');
  });
});
