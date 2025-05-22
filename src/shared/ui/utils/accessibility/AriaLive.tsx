'use client';

import React, { useRef, useEffect, useCallback, useReducer } from 'react';

import { cn } from '@/lib/utils';
import { withMemo } from '@/shared/lib/utils/memo';
import { accessibility } from '@/styles/compositions';

export interface AriaLiveProps {
  /**
   * Содержимое, которое будет объявлено скринридеру
   */
  message: string;
  /**
   * Приоритет объявления
   * - 'polite': скринридер дождется паузы в речи (по умолчанию)
   * - 'assertive': скринридер прервет текущее чтение для объявления
   */
  politeness?: 'polite' | 'assertive';
  /**
   * Должен ли регион обновляться при изменении сообщения
   */
  atomic?: boolean;
  /**
   * Должен ли скринридер объявлять только изменения в содержимом
   */
  relevant?: 'additions' | 'removals' | 'text' | 'all';
  /**
   * Нужно ли визуально скрыть элемент
   */
  hidden?: boolean;
  /**
   * Задержка в миллисекундах перед объявлением сообщения
   * Полезно при анимациях или необходимости синхронизировать объявления
   */
  delay?: number;
  /**
   * Надо ли очищать сообщение после объявления
   * Позволяет избежать повторений при фокусе
   */
  clearAfterAnnounce?: boolean;
  /**
   * Время в миллисекундах, после которого сообщение будет очищено
   * Работает только если clearAfterAnnounce=true
   */
  clearDelay?: number;
  /**
   * Дополнительные классы стилей
   */
  className?: string;
  /**
   * ID элемента (для связи с другими элементами интерфейса)
   */
  id?: string;
}

// Типы действий редюсера
type AriaLiveAction = { type: 'SET_MESSAGE'; payload: string } | { type: 'CLEAR_MESSAGE' };

// Тип состояния
interface AriaLiveState {
  currentMessage: string;
}

// Редюсер для управления сообщениями AriaLive
function ariaLiveReducer(state: AriaLiveState, action: AriaLiveAction): AriaLiveState {
  switch (action.type) {
    case 'SET_MESSAGE':
      return { ...state, currentMessage: action.payload };
    case 'CLEAR_MESSAGE':
      return { ...state, currentMessage: '' };
    default:
      return state;
  }
}

/**
 * Компонент AriaLive
 *
 * Обеспечивает динамические объявления для скринридеров,
 * сообщая о важных изменениях в интерфейсе.
 * Соответствует требованиям WCAG 2.1 4.1.3 (Уровень AA)
 *
 * @example
 * ```tsx
 * <AriaLive
 *   message="Форма успешно отправлена"
 *   politeness="polite"
 * />
 * ```
 */
const AriaLiveBase: React.FC<AriaLiveProps> = ({
  message,
  politeness = 'polite',
  atomic = true,
  relevant = 'all',
  hidden = true,
  delay = 0,
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  clearAfterAnnounce = false,
  clearDelay = 5000,
  className = '',
  id,
}) => {
  const prevMessageRef = useRef<string>('');
  const [state, dispatch] = useReducer(ariaLiveReducer, { currentMessage: '' });
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const clearTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Очистка сообщения
  const clearMessage = useCallback(() => {
    dispatch({ type: 'CLEAR_MESSAGE' });
    prevMessageRef.current = '';
  }, []);

  // Обработка изменения сообщения с учетом задержки
  useEffect(() => {
    // Отменяем предыдущий таймер, если он был
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Отменяем таймер очистки, если он был
    if (clearTimeoutRef.current) {
      clearTimeout(clearTimeoutRef.current);
    }

    // Если сообщение пустое, просто очищаем
    if (!message) {
      clearMessage();
      return;
    }

    // Если сообщение не изменилось, ничего не делаем
    if (prevMessageRef.current === message) {
      return;
    }

    // Устанавливаем таймер для объявления с задержкой
    timeoutRef.current = setTimeout(() => {
      prevMessageRef.current = message;
      dispatch({ type: 'SET_MESSAGE', payload: message });

      // Если включена автоочистка, устанавливаем таймер очистки
      if (clearAfterAnnounce) {
        clearTimeoutRef.current = setTimeout(clearMessage, clearDelay);
      }
    }, delay);

    // Очистка при размонтировании компонента
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (clearTimeoutRef.current) clearTimeout(clearTimeoutRef.current);
    };
  }, [message, delay, clearAfterAnnounce, clearDelay, clearMessage]);

  return (
    <div
      id={id}
      className={cn(hidden ? accessibility.ariaLive : '', className)}
      role={politeness === 'assertive' ? 'alert' : 'status'}
      aria-live={politeness}
      aria-atomic={atomic}
      aria-relevant={relevant}
    >
      {state.currentMessage}
    </div>
  );
};

AriaLiveBase.displayName = 'AriaLive';

export const AriaLive = withMemo(AriaLiveBase);
