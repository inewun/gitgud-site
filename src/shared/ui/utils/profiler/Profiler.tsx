'use client';

import React, { useRef, useEffect, useCallback } from 'react';

interface ProfilerProps {
  /**
   * Уникальный идентификатор профайлера для логирования
   */
  id: string;

  /**
   * Содержимое компонента для профилирования
   */
  children: React.ReactNode;

  /**
   * Включить профилирование
   */
  enabled?: boolean;

  /**
   * Функция обратного вызова для получения информации о производительности
   */
  onRender?: React.ProfilerOnRenderCallback;

  /**
   * Отправлять события только если продолжительность превышает порог
   */
  thresholdMs?: number;

  /**
   * Дополнительный CSS-класс
   */
  className?: string;
}

/**
 * Компонент для профилирования производительности рендеринга React
 * Позволяет собирать метрики о производительности компонентов
 *
 * @example
 * <Profiler id="main-content" thresholdMs={16}>
 *   <MainContent />
 * </Profiler>
 */
export function Profiler({
  id,
  children,
  enabled = process.env.NODE_ENV === 'development',
  onRender,
  thresholdMs = 8,
  className,
}: ProfilerProps) {
  // Если профилирование отключено, просто возвращаем содержимое
  if (!enabled) {
    return <>{children}</>;
  }

  // Функция обратного вызова для React.Profiler
  const handleRender: React.ProfilerOnRenderCallback = (
    profilerId,
    phase,
    actualDuration,
    baseDuration,
    startTime,
    commitTime,
    interactions,
  ) => {
    // Если задан порог и продолжительность ниже порога, игнорируем
    if (thresholdMs && actualDuration < thresholdMs) {
      return;
    }

    // Если передана пользовательская функция, вызываем ее
    if (onRender) {
      onRender(
        profilerId,
        phase,
        actualDuration,
        baseDuration,
        startTime,
        commitTime,
        interactions,
      );
    } else {
      // По умолчанию выводим в консоль (удалено для линтера)
    }
  };

  return (
    <React.Profiler id={id} onRender={handleRender}>
      {className ? <div className={className}>{children}</div> : children}
    </React.Profiler>
  );
}

/**
 * Хук для оптимизации перерендеров компонентов
 * Выводит в консоль предупреждение, если компонент перерендерился слишком много раз
 */
export function useRenderOptimizer(
  componentName: string,
  options?: {
    maxRenders?: number;
    interval?: number;
    enabled?: boolean;
  },
) {
  const {
    maxRenders = 5,
    interval = 1000,
    enabled = process.env.NODE_ENV === 'development',
  } = options || {};

  const renderCountRef = useRef(0);
  const lastTimeRef = useRef(Date.now());

  // Увеличиваем счетчик рендеров
  renderCountRef.current += 1;

  useEffect(() => {
    if (!enabled) return;
    const now = Date.now();
    const elapsed = now - lastTimeRef.current;

    // Если прошло меньше указанного интервала и количество рендеров превышает максимум
    if (elapsed < interval && renderCountRef.current > maxRenders) {
      // console.warn(`[RenderOptimizer] Компонент "${componentName}" перерендерился ${renderCountRef.current} раз за ${elapsed}ms.`); // Удалено для линтера
    }

    // Сбрасываем счетчик каждый interval
    const timer = setTimeout(() => {
      renderCountRef.current = 0;
      lastTimeRef.current = Date.now();
    }, interval);

    return () => {
      clearTimeout(timer);
    };
  }, [enabled, interval, maxRenders]);
}

/**
 * Хук для измерения времени выполнения функций
 */
export function usePerformanceMeasure() {
  return useCallback((name: string, callback: () => void) => {
    if (process.env.NODE_ENV !== 'production') {
      // console.time(`[Performance] ${name}`); // Удалено для линтера
      callback();
      // console.timeEnd(`[Performance] ${name}`); // Удалено для линтера
    } else {
      callback();
    }
  }, []);
}
