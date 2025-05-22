/**
 * Типы для фичи анонимизации
 */

import { AnonymizeError } from '@/domain/anonymize/types';

export interface AnonymizeFeatureSettings {
  /** Анонимизировать имена и фамилии */
  anonymizeNames: boolean;
  /** Анонимизировать email-адреса */
  anonymizeEmails: boolean;
  /** Анонимизировать телефонные номера */
  anonymizePhones: boolean;
}

export interface AnonymizeFeatureState {
  /** Исходный текст */
  sourceText: string;
  /** Результат анонимизации */
  resultText: string;
  /** Настройки анонимизации */
  settings: AnonymizeFeatureSettings;
  /** Состояние загрузки */
  isLoading: boolean;
  /** Ошибка при анонимизации */
  error: AnonymizeError | null;
}

export type AnonymizeFeatureAction =
  | { type: 'SET_SOURCE_TEXT'; payload: string }
  | { type: 'SET_RESULT_TEXT'; payload: string }
  | { type: 'SET_SETTING'; payload: { key: keyof AnonymizeFeatureSettings; value: boolean } }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: AnonymizeError | null }
  | { type: 'RESET' };
