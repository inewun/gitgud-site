import React from 'react';

import { Fingerprint, Globe, ArrowRight } from 'lucide-react';

const features = [
  {
    icon: <Fingerprint className="h-9 w-9 text-primary mb-3" />,
    title: 'GDPR ФЗ 152 & безопасность',
    description: 'Полное соответствие стандартам защиты данных',
  },
  {
    icon: <Globe className="h-9 w-9 text-primary mb-3" />,
    title: 'Мгновенный результат',
    description: 'Обработка текстов за секунды',
  },
  {
    icon: <ArrowRight className="h-9 w-9 text-primary mb-3" />,
    title: 'Простота использования',
    description: 'Интерфейс интуитивно понятен для всех пользователей',
  },
];

export const FeaturesSection: React.FC = () => (
  <section className="py-10 sm:py-16 md:py-20 bg-transparent">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10 lg:px-16">
      <div className="text-center mb-8 sm:mb-10 md:mb-14">
        <h2 className="text-3xl md:text-4xl font-bold mb-3 text-foreground">
          Современные технологии анонимизации
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto text-lg md:text-xl">
          Передовые алгоритмы и максимальная защита конфиденциальных данных — всё
          для вашего спокойствия.
        </p>
      </div>
      <div className="flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-border/40 dark:divide-white/10 bg-white/80 dark:bg-[#181C23] rounded-2xl shadow-sm overflow-hidden">
        {features.map((feature, idx) => (
          <div
            key={feature.title}
            className="flex-1 flex flex-col items-center justify-start text-center px-4 sm:px-6 py-8 sm:py-10 md:py-8"
          >
            <div className="h-8 sm:h-9 mb-3 flex items-center justify-center">{feature.icon}</div>
            <h3 className="text-md sm:text-lg md:text-xl font-semibold mb-2 text-foreground h-auto md:h-14 flex items-center justify-center">
              {feature.title}
            </h3>
            <p className="text-xs sm:text-sm md:text-base text-muted-foreground max-w-xs mx-auto">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  </section>
);
