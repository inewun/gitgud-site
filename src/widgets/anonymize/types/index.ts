/**
 * Типы для виджета анонимизации
 */

import { ReactNode } from 'react';

import { AnonymizeFeatureSettings } from '@/features/anonymize/types';

export interface AnonymizeWidgetProps {
  /** Заголовок виджета */
  title?: string;
  /** Описание виджета */
  description?: string;
  /** Дополнительный контент */
  children?: ReactNode;
  /** Начальные настройки */
  initialSettings?: Partial<AnonymizeFeatureSettings>;
  /** Обработчик завершения анонимизации */
  onAnonymizeComplete?: (result: string) => void;
  /** Классы для стилизации контейнера */
  className?: string;
}

export interface AnonymizeWidgetState {
  /** Активная вкладка */
  activeTab: 'input' | 'result' | 'settings';
}
