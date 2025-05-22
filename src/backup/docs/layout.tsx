// Используем ISR (инкрементальную статическую регенерацию)
// Обновляем документы каждый 1 час

import React from 'react';

import { cn } from '@/lib/utils';

export const revalidate = 3600;

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={cn('docs-layout relative min-h-screen bg-background')}>
      {/* Современный фон с паттерном и градиентом */}
      <div className="absolute inset-0 -z-20 bg-dot-pattern-light dark:bg-dot-pattern-dark opacity-20 pointer-events-none animate-fadeIn" />
      <div className="absolute inset-0 -z-10 bg-background/80 opacity-60 pointer-events-none animate-fadeIn delay-100" />
      {/* Стеклянный эффект */}
      <div className="absolute inset-0 -z-5 backdrop-blur-xl" />
      {/* Основной контент */}
      <div className="container relative z-10 py-10 md:py-16 animate-fadeInUp">
        {children}
      </div>
    </div>
  );
}
