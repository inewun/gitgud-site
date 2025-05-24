import Link from 'next/link';
import React from 'react';

import { Shield, Zap, Circle, ArrowRight } from 'lucide-react';

// Функция для добавления неразрывных пробелов перед одиночными предлогами и союзами
const withNbsp = (text: string): string => {
  // Регулярное выражение для поиска предлогов и союзов, за которыми следует пробел
  return text.replace(/ ([а-яёa-z]{1,3}) /gi, ' $1\u00A0');
};

export const HeroSection: React.FC = () => (
  <section className="w-full flex flex-col items-center justify-center text-center pt-10 pb-6">
    <div className="max-w-7xl mx-auto flex flex-col items-center gap-6 px-4 sm:px-6 md:px-10 lg:px-16">
      {/* Pills-блок */}
      <div className="flex flex-wrap justify-center items-center gap-2 sm:gap-4 bg-primary/10 dark:bg-[#23283a] rounded-xl px-4 sm:px-6 py-2 mb-4">
        <span className="flex items-center gap-1 sm:gap-2 text-primary font-semibold text-xs sm:text-sm md:text-base">
          <Shield className="w-4 h-4 sm:w-5 sm:h-5" />
          Безопасность
        </span>
        <span className="hidden sm:inline-block mx-1 sm:mx-2 text-primary/30">•</span>
        <span className="flex items-center gap-1 sm:gap-2 text-primary font-semibold text-xs sm:text-sm md:text-base">
          <Zap className="w-4 h-4 sm:w-5 sm:h-5" />
          Скорость
        </span>
        <span className="hidden sm:inline-block mx-1 sm:mx-2 text-primary/30">•</span>
        <span className="flex items-center gap-1 sm:gap-2 text-primary font-semibold text-xs sm:text-sm md:text-base">
          <Circle className="w-4 h-4 sm:w-5 sm:h-5" />
          Надёжность
        </span>
      </div>
      <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground mb-2 max-w-3xl leading-[1.15] sm:leading-tight md:leading-tight mx-auto px-2 break-words hyphens-auto">
        Анонимизация данных нового поколения
      </h1>
      <p className="text-base sm:text-lg md:text-xl text-muted-foreground mb-2 max-w-2xl mx-auto">
        {withNbsp(
          'Безопасная и мгновенная анонимизация персональных данных без компромиссов по безопасности.',
        )}
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center mb-4">
        <Link
          href="/anonymize"
          className="button-primary text-base px-8 py-3 rounded-xl inline-flex items-center gap-2 focus-visible:ring-2 focus-visible:ring-primary transition-all duration-150 min-w-[170px] justify-center"
          tabIndex={0}
          aria-label="Попробовать бесплатно"
        >
          Попробовать <ArrowRight className="h-5 w-5" />
        </Link>
      </div>
      {/* Новый премиальный mockup-блок */}
      <div className="w-full max-w-3xl mx-auto rounded-2xl border border-border/60 dark:border-white/10 bg-white/70 dark:bg-[#181C23] shadow-lg backdrop-blur-lg transition-all duration-300">
        {/* Верхняя панель */}
        <div className="flex items-center h-12 px-5 bg-neutral-100 dark:bg-neutral-900 border-b border-border/40 dark:border-white/10 rounded-t-2xl backdrop-blur-md">
          <span className="w-3 h-3 rounded-full bg-red-400 shadow mr-2" />
          <span className="w-3 h-3 rounded-full bg-yellow-400 shadow mr-2" />
          <span className="w-3 h-3 rounded-full bg-green-400 shadow" />
          <span className="ml-5 text-muted-foreground text-sm font-medium select-none">
            datashield-demo.txt
          </span>
        </div>
        {/* Контент */}
        <div className="flex flex-col md:flex-row items-stretch justify-between gap-5 sm:gap-8 px-4 sm:px-8 py-6 sm:py-10 bg-transparent">
          {/* Исходный текст */}
          <div className="flex-1 flex flex-col gap-3 bg-white/90 dark:bg-[#23283a] rounded-xl border border-border/50 dark:border-white/10 shadow-sm p-3 sm:p-6 min-w-0 sm:min-w-[220px] max-w-lg transition-all duration-200">
            <div className="text-sm text-muted-foreground font-semibold mb-1 text-center">
              Исходный текст
            </div>
            <pre className="font-mono text-xs sm:text-sm md:text-base text-foreground leading-relaxed whitespace-pre-wrap bg-transparent border-none p-0 m-0 text-center">
              Иванов Иван Иванович,{'\n'}12.03.1990 г. Москва,{'\n'}ул. Ленина, д. 10{'\n'}Тел: +7
              (999) 123-45-67
            </pre>
          </div>
          {/* Анонимизированный текст */}
          <div className="flex-1 flex flex-col gap-3 bg-primary/5 dark:bg-[#1a1d29] rounded-xl border border-primary/30 dark:border-primary/40 shadow-sm p-3 sm:p-6 min-w-0 sm:min-w-[220px] max-w-lg transition-all duration-200">
            <div className="flex items-center gap-2 text-primary font-semibold text-sm mb-1 justify-center">
              <Shield className="w-5 h-5" strokeWidth={2.1} />
              Анонимизировано
            </div>
            <pre className="font-mono text-xs sm:text-sm md:text-base text-primary leading-relaxed whitespace-pre-wrap bg-transparent border-none p-0 m-0 text-center">
              Петров Петр Петрович,{'\n'}15.06.1985 г. Красноярск,{'\n'}ул. Сталина, д. 15{'\n'}Тел:
              +7 (925) 347-82-91
            </pre>
          </div>
        </div>
      </div>
    </div>
  </section>
);
