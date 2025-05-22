// ServerVirtualList.tsx (серверная обёртка)
// Этот файл не должен содержать 'use client'

'use client';

import React, { useRef, useState, useEffect } from 'react';

interface VirtualListProps<T> {
  items: T[];
  height: number;
  itemHeight: number;
  renderItem: (item: T, index: number) => React.ReactNode;
  className?: string;
  overscan?: number;
}

export type { VirtualListProps };

/**
 * Компонент для виртуализированного списка, который отображает только видимые элементы
 * Улучшает производительность при работе с большими списками данных
 */
function VirtualList<T>({
  items,
  height,
  itemHeight,
  renderItem,
  className = '',
  overscan = 3,
}: VirtualListProps<T>) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollTop, setScrollTop] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (containerRef.current) {
        setScrollTop(containerRef.current.scrollTop);
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => {
        container.removeEventListener('scroll', handleScroll);
      };
    }
  }, []);

  // Вычисляем индексы видимых элементов
  const totalHeight = items.length * itemHeight;
  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const endIndex = Math.min(
    items.length - 1,
    Math.floor((scrollTop + height) / itemHeight) + overscan,
  );

  // Подготавливаем видимые элементы
  const visibleItems = [];
  for (let i = startIndex; i <= endIndex; i++) {
    visibleItems.push(
      <div
        key={i}
        style={{
          height: itemHeight,
          position: 'absolute',
          top: i * itemHeight,
          left: 0,
          right: 0,
        }}
      >
        {renderItem(items[i], i)}
      </div>,
    );
  }

  return (
    <div
      ref={containerRef}
      className={`virtual-list ${className}`}
      style={{
        height,
        overflow: 'auto',
        position: 'relative',
      }}
      data-testid="virtual-list"
    >
      <div style={{ height: totalHeight, position: 'relative' }}>{visibleItems}</div>
    </div>
  );
}

export default VirtualList;

/**
 * Хук для определения видимости элемента в контейнере
 */
export function useIsVisible(
  ref: React.RefObject<HTMLElement>,
  options: IntersectionObserverInit = {},
) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!ref.current) return;

    const observer = new IntersectionObserver(([entry]) => {
      setIsVisible(entry.isIntersecting);
    }, options);

    observer.observe(ref.current);

    return () => {
      observer.disconnect();
    };
  }, [ref, options]);

  return isVisible;
}

/**
 * Хук для виртуализированного скроллинга, который можно использовать
 * в собственной реализации виртуализированного списка
 */
export function useVirtualizedItems<T>({
  items,
  height,
  itemHeight,
  overscan = 5,
  scrollTop = 0,
}: {
  items: T[];
  height: number;
  itemHeight: number;
  overscan?: number;
  scrollTop?: number;
}) {
  const totalHeight = items.length * itemHeight;
  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const endIndex = Math.min(
    items.length - 1,
    Math.floor((scrollTop + height) / itemHeight) + overscan,
  );

  const visibleItems = items.slice(startIndex, endIndex + 1);
  const offsetY = startIndex * itemHeight;

  return {
    visibleItems,
    startIndex,
    endIndex,
    offsetY,
    totalHeight,
  };
}
