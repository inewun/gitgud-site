import { create } from 'zustand';

import type { UseAnonymizeOptions } from '@/domain/anonymize';
import { anonymizeService } from '@/services/anonymize.service';

interface AnonymizeState {
  inputText: string;
  outputText: string;
  isProcessing: boolean;
  options: Partial<UseAnonymizeOptions>;
  setInputText: (text: string) => void;
  setOutputText: (text: string) => void;
  setIsProcessing: (isProcessing: boolean) => void;
  setOptions: (options: Partial<UseAnonymizeOptions>) => void;
  anonymize: () => Promise<void>;
}

export const useAnonymizeStore = create<AnonymizeState>((set, get) => ({
  inputText: '',
  outputText: '',
  isProcessing: false,
  options: {
    replaceNames: true,
    replaceEmails: true,
    replacePhones: true,
    replaceDates: false,
    replaceAddresses: false,
    replaceIPs: false,
  },

  setInputText: text => {
    set({ inputText: text });
  },
  setOutputText: text => {
    set({ outputText: text });
  },
  setIsProcessing: isProcessing => {
    set({ isProcessing });
  },
  setOptions: options => {
    set({ options });
  },

  anonymize: async () => {
    const { inputText, options } = get();

    // Ничего не делаем, если нет входного текста
    if (!inputText.trim()) {
      return;
    }

    set({ isProcessing: true });

    try {
      // Используем сервис анонимизации
      await new Promise(resolve => setTimeout(resolve, 300)); // Имитация задержки API
      const anonymized = anonymizeService.anonymizeText(inputText, options);

      set({ outputText: anonymized, isProcessing: false });
    } catch (error) {
      console.error('Ошибка при анонимизации:', error);
      set({ isProcessing: false });
    }
  },
}));
