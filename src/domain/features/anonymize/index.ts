import { create } from 'zustand';

import { UseAnonymizeOptions } from '@/domain/anonymize/types';
import { anonymizeService } from '@/features/anonymize/api/anonymize.service';
import { copyToClipboard, downloadTextFile } from '@/features/anonymize/model/text-utils';

// Локальное определение типа для сервисных опций
interface ServiceAnonymizeOptions {
  anonymizeEmails?: boolean;
  anonymizePhones?: boolean;
  anonymizeNames?: boolean;
  anonymizeNumbers?: boolean;
  replacementPlaceholder?: string;
}

interface AnonymizeState {
  // Состояние
  inputText: string;
  anonymizedText: string;
  isProcessing: boolean;
  statusMessage: string;
  options: UseAnonymizeOptions;

  // Действия
  setInputText: (text: string) => void;
  setAnonymizedText: (text: string) => void;
  setIsProcessing: (isProcessing: boolean) => void;
  setStatusMessage: (message: string) => void;
  setOptions: (options: Partial<UseAnonymizeOptions>) => void;
  toggleOption: (key: keyof UseAnonymizeOptions) => void;

  // Бизнес-операции
  anonymize: () => Promise<void>;
  copyToClipboard: () => Promise<void>;
  downloadAsFile: () => void;
  reset: () => void;
}

// Создаем хранилище состояния с Zustand
export const useAnonymizeStore = create<AnonymizeState>((set, get) => ({
  // Начальное состояние
  inputText: '',
  anonymizedText: '',
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  isProcessing: false,
  statusMessage: '',
  options: {
    replaceNames: true,
    replaceEmails: true,
    replacePhones: true,
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    replaceDates: false,
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    replaceAddresses: false,
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    replaceIPs: false,
  },

  // Сеттеры для полей состояния
  setInputText: text => {
    set({ inputText: text });
  },
  setAnonymizedText: text => {
    set({ anonymizedText: text });
  },
  setIsProcessing: isProcessing => {
    set({ isProcessing });
  },
  setStatusMessage: message => {
    set({ statusMessage: message });
  },
  setOptions: newOptions => {
    set(state => ({
      options: { ...state.options, ...newOptions },
    }));
  },
  toggleOption: key => {
    set(state => ({
      options: {
        ...state.options,
        [key]: !state.options[key],
      },
    }));
  },

  // Бизнес-логика
  anonymize: async () => {
    const { inputText, options } = get();

    if (!inputText.trim()) {
      set({ statusMessage: 'Текст не может быть пустым' });
      return;
    }

    try {
      set({ isProcessing: true, statusMessage: 'Выполняется анонимизация...' });

      // Преобразуем опции из домена в формат, ожидаемый сервисом
      const serviceOptions: Partial<ServiceAnonymizeOptions> = {
        anonymizeEmails: options.replaceEmails,
        anonymizePhones: options.replacePhones,
        anonymizeNames: options.replaceNames,
        anonymizeNumbers: true, // По умолчанию
        replacementPlaceholder: '[СКРЫТО]', // По умолчанию
      };

      const result = anonymizeService.anonymizeText(inputText, serviceOptions);

      set({
        anonymizedText: result,
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        isProcessing: false,
        statusMessage: 'Анонимизация успешно завершена',
      });

      // Сохраняем результат в историю
      const metadata = {
        replacedNames: options.replaceNames
          ? (inputText.match(/[А-Я][а-я]+\s+[А-Я][а-я]+/g) || []).length
          : 0,
        replacedEmails: options.replaceEmails
          ? (inputText.match(/[\w.+-]+@[\w-]+\.[\w-]+/g) || []).length
          : 0,
        replacedPhones: options.replacePhones
          ? (inputText.match(/(\+\d{1,3})?\s?\(?\d{3,4}\)?\s?\d{3,4}[-\s]?\d{2,4}/g) || []).length
          : 0,
      };

      await anonymizeService.saveAnonymizeResult(inputText, result, metadata);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Ошибка при анонимизации:', error);
      set({
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        isProcessing: false,
        statusMessage: 'Произошла ошибка при анонимизации',
      });
    }
  },

  copyToClipboard: async () => {
    const { anonymizedText } = get();

    if (!anonymizedText) return;

    try {
      await copyToClipboard(anonymizedText);
      set({ statusMessage: 'Текст скопирован в буфер обмена' });
    } catch (error) {
      set({ statusMessage: 'Не удалось скопировать текст' });
    }
  },

  downloadAsFile: () => {
    const { anonymizedText } = get();

    if (!anonymizedText) return;

    downloadTextFile(anonymizedText);
    set({ statusMessage: 'Файл загружен' });
  },

  reset: () => {
    set({
      inputText: '',
      anonymizedText: '',
      statusMessage: '',
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      isProcessing: false,
    });
  },
}));
