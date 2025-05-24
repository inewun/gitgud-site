import React from 'react';

import { Users, Fingerprint, Globe } from 'lucide-react';

// Функция для добавления неразрывных пробелов перед одиночными предлогами и союзами
const withNbsp = (text: string): string => {
  // Регулярное выражение для поиска предлогов и союзов, за которыми следует пробел
  return text.replace(/ ([а-яёa-z]{1,3}) /gi, ' $1\u00A0');
};

const useCases = [
  {
    icon: <Users className="h-8 w-8 text-primary" />,
    title: 'Медицинские учреждения',
    description: withNbsp(
      'Защита персональных данных пациентов при работе с историями болезни и медицинскими отчетами',
    ),
  },
  {
    icon: <Fingerprint className="h-8 w-8 text-primary" />,
    title: 'Финансовые организации',
    description: withNbsp(
      'Безопасная обработка финансовых документов с удалением чувствительной информации клиентов',
    ),
  },
  {
    icon: <Globe className="h-8 w-8 text-primary" />,
    title: 'Государственные службы',
    description: withNbsp(
      'Защита персональных данных граждан при обмене информацией между учреждениями',
    ),
  },
];

export const UseCasesSection: React.FC = () => (
  <section className="py-16 bg-transparent">
    <div className="max-w-7xl mx-auto px-6 md:px-10 lg:px-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold mb-3 text-foreground">
          Варианты использования
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto text-lg md:text-xl">
          {withNbsp(
            'Решение для различных отраслей, где критически важна защита персональных данных',
          )}
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {useCases.map(useCase => (
          <div
            key={useCase.title}
            className="flex flex-col items-center text-center gap-3 min-h-[160px] rounded-xl border border-border/40 dark:border-white/10 bg-white/90 dark:bg-[#181C23] shadow-sm p-8 transition-transform duration-150 hover:shadow-lg hover:-translate-y-1 focus-within:shadow-lg"
            tabIndex={0}
            aria-label={useCase.title}
          >
            {React.cloneElement(useCase.icon, { className: 'h-8 w-8 text-primary' })}
            <h3 className="text-lg md:text-xl font-semibold mb-1 text-foreground">
              {useCase.title}
            </h3>
            <p className="text-sm md:text-base text-muted-foreground">{useCase.description}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);
