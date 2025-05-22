'use client';

import React from 'react';
import { AiAnonymizeForm } from '@/features/ai-anonymize';
import { Shield, Zap, Lock } from 'lucide-react';

/**
 * Виджет анонимизации для страницы с современным дизайном 2025
 * Объединяет необходимые компоненты и функциональность
 */
export function AnonymizeWidget() {
  return (
    <section className="w-full min-h-[calc(50vh)] sm:min-h-[calc(60vh)] flex flex-col items-center justify-center py-4 sm:py-8 md:py-12 bg-transparent">
      <div className="w-full max-w-7xl mx-auto flex flex-col items-center justify-center px-3 sm:px-4 md:px-6">
        <div className="w-full">
          <AiAnonymizeForm />
        </div>

        {/* Шаги-инструкция */}
        <div className="w-full mt-6 sm:mt-8 md:mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
          <div className="flex flex-col items-center bg-card/80 border border-border/60 rounded-xl sm:rounded-2xl shadow-sm sm:shadow-lg p-4 sm:p-6 transition-all duration-300">
            <Shield className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-primary mb-2 sm:mb-3 mx-auto" />
            <h3 className="font-bold text-base sm:text-lg mb-1 sm:mb-2 text-center">1. Вставьте текст</h3>
            <p className="text-muted-foreground text-xs sm:text-sm text-center">Скопируйте или введите любой текст, который нужно обезличить.</p>
          </div>
          <div className="flex flex-col items-center bg-card/80 border border-border/60 rounded-xl sm:rounded-2xl shadow-sm sm:shadow-lg p-4 sm:p-6 transition-all duration-300">
            <Zap className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-primary mb-2 sm:mb-3 mx-auto" />
            <h3 className="font-bold text-base sm:text-lg mb-1 sm:mb-2 text-center">2. Нажмите «Анонимизировать»</h3>
            <p className="text-muted-foreground text-xs sm:text-sm text-center">Система мгновенно обработает данные и скроет все персональные сведения.</p>
          </div>
          <div className="flex flex-col items-center bg-card/80 border border-border/60 rounded-xl sm:rounded-2xl shadow-sm sm:shadow-lg p-4 sm:p-6 transition-all duration-300">
            <Lock className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-primary mb-2 sm:mb-3 mx-auto" />
            <h3 className="font-bold text-base sm:text-lg mb-1 sm:mb-2 text-center">3. Скопируйте результат</h3>
            <p className="text-muted-foreground text-xs sm:text-sm text-center">Получите анонимизированный текст — без риска утечки данных.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
