'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';

import { cn } from '@/lib/utils';
import { animations } from '@/styles/compositions';

// Динамический импорт компонента AccessibilitySettings для уменьшения бандла
export const DynamicAccessibilitySettings = dynamic(
  () => import('@/shared/ui/utils/accessibility/AccessibilitySettings'),
  {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    ssr: false, // Этот компонент не нужно рендерить на сервере
    loading: () => (
      <div
        className={cn('a11y-settings-loading', animations.pulse, 'h-10 w-10 bg-muted rounded-full')}
      ></div>
    ),
  },
);

// Динамический импорт тяжелого компонента визуализации данных
export const DynamicDataVisualizer = dynamic(
  () => import('@/features/data-visualizer/ui/DataVisualizer'),
  {
    ssr: true, // Этот компонент лучше предварительно рендерить на сервере
    loading: () => (
      <div className={cn('data-visualizer-loading p-4 rounded-lg bg-subtle', animations.pulse)}>
        <div className={cn('h-40 w-full bg-muted rounded')}></div>
        <div className="mt-4 h-6 w-1/2 bg-muted rounded"></div>
      </div>
    ),
  },
);

// Динамический импорт с приоритетом
export const DynamicMap = dynamic(() => import('@/features/map/ui/MapComponent'), {
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  ssr: false,
  loading: () => (
    <div className={cn('map-loading h-[400px] bg-subtle rounded-lg', animations.pulse)}></div>
  ),
});

// Компонент-обертка для ленивой загрузки контента
export function LazyContentWrapper({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<div className={cn('p-8 bg-subtle rounded-lg', animations.pulse)}></div>}>
      {children}
    </Suspense>
  );
}

// Создаем объект со всеми компонентами и затем экспортируем его
const lazyComponents = {
  DynamicAccessibilitySettings,
  DynamicDataVisualizer,
  DynamicMap,
  LazyContentWrapper,
};

export default lazyComponents;
