'use client';

import Link from 'next/link';
import { useState, useEffect, Fragment } from 'react';

import { AnimatePresence, motion } from 'framer-motion';
import {
  Copy,
  Check,
  Shield,
  ChevronRight,
  ExternalLink,
  BookOpen,
  Code,
  Terminal,
  Key,
  Search,
  Menu,
  X,
  FileText,
  CodeSquare,
  HelpCircle,
  PanelLeft,
  Github,
  Zap,
  Lock,
  LucideIcon,
} from 'lucide-react';

import { Button } from '@/shared/ui/inputs/button/Button';
import { Card, CardContent } from '@/shared/ui/layout/card';
import { TextInputField } from '@/shared/ui/inputs/text-field';

// Структура документации
const sections = [
  {
    id: 'getting-started',
    title: 'Начало работы',
    icon: BookOpen,
    color: 'from-blue-500 to-indigo-600',
    subSections: [
      { id: 'installation', title: 'Установка' },
      { id: 'quick-start', title: 'Быстрый старт' },
      { id: 'requirements', title: 'Требования' },
    ],
  },
  {
    id: 'features',
    title: 'Возможности',
    icon: Shield,
    color: 'from-green-500 to-emerald-600',
    subSections: [
      { id: 'anonymization-types', title: 'Типы анонимизации' },
      { id: 'data-security', title: 'Безопасность данных' },
    ],
  },
  {
    id: 'api',
    title: 'API',
    icon: Code,
    color: 'from-purple-500 to-violet-600',
    subSections: [
      { id: 'core-api', title: 'Основное API' },
      { id: 'configuration', title: 'Конфигурация' },
    ],
  },
  {
    id: 'usage',
    title: 'Использование',
    icon: Terminal,
    color: 'from-orange-500 to-amber-600',
    subSections: [
      { id: 'examples', title: 'Примеры' },
      { id: 'best-practices', title: 'Лучшие практики' },
    ],
  },
];

// Примеры кода
const codeExamples: Record<string, string> = {
  installation: `# Клонирование репозитория
git clone https://github.com/username/anonymize-tool.git
cd anonymize-tool

# Установка зависимостей
pnpm install

# Запуск в режиме разработки
pnpm dev`,

  'quick-start': `// Базовый пример использования
import { anonymize } from 'anonymize-tool';

const text = "Иван Иванов (mail@example.com) с телефоном +7 (123) 456-78-90";
const anonymizedText = anonymize(text, {
  names: true,
  emails: true,
  phones: true
});

console.log(anonymizedText);
// Вывод: "[ИМЯ] ([EMAIL]) с телефоном [ТЕЛЕФОН]"`,

  'anonymization-types': `// Доступные типы анонимизации
{
  names: boolean,     // ФИО и имена
  emails: boolean,    // Email адреса
  phones: boolean,    // Телефонные номера
  dates: boolean,     // Даты
  addresses: boolean, // Физические адреса
  ips: boolean,       // IP-адреса
  custom: RegExp[]    // Пользовательские паттерны
}`,

  'core-api': `/**
 * Анонимизирует текст согласно указанным параметрам
 * @param {string} text - Исходный текст
 * @param {AnonymizeOptions} options - Параметры анонимизации
 * @returns {string} Анонимизированный текст
 */
function anonymize(text, options) {
  let result = text;
  
  if (options.names) {
    result = result.replace(/[А-Я][а-я]+\\s[А-Я][а-я]+(\\s[А-Я][а-я]+)?/g, '[ИМЯ]');
  }
  
  if (options.emails) {
    result = result.replace(/\\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}\\b/g, '[EMAIL]');
  }
  
  return result;
}`,
};

// Определение типа для подраздела
interface SubSection {
  id: string;
  title: string;
  parentId?: string;
  parentTitle?: string;
}

// Все подразделы
const allSubSections = sections.flatMap(section =>
  section.subSections.map(
    sub =>
      ({
        ...sub,
        parentId: section.id,
        parentTitle: section.title,
      }) as SubSection,
  ),
);

export default function DocsPage() {
  const [activeSection, setActiveSection] = useState('installation');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<
    Array<{ id: string; title: string; parentTitle: string }>
  >([]);

  // Поиск по документации
  useEffect(() => {
    if (searchTerm.trim().length > 1) {
      const results = allSubSections.filter(section =>
        section.title.toLowerCase().includes(searchTerm.toLowerCase()),
      );

      // Приведение типов для совместимости с состоянием searchResults
      const resultsWithRequiredFields = results.map(section => ({
        id: section.id,
        title: section.title,
        parentTitle: section.parentTitle || '',
      }));

      setSearchResults(resultsWithRequiredFields);
    } else {
      setSearchResults([]);
    }
  }, [searchTerm]);

  // Получаем группу для текущего активного раздела
  const getActiveGroup = () => {
    for (const section of sections) {
      for (const subSection of section.subSections) {
        if (subSection.id === activeSection) {
          return section.id;
        }
      }
    }
    return null;
  };

  // Копирование кода
  const copyToClipboard = (code: string, id: string) => {
    try {
      void navigator.clipboard.writeText(code);
      setCopiedCode(id);
      setTimeout(() => {
        setCopiedCode(null);
      }, 2000);
    } catch {
      // Ошибка при копировании в буфер обмена
    }
  };

  // Переключение активного раздела
  const handleSectionChange = (sectionId: string) => {
    setActiveSection(sectionId);
    setMobileNavOpen(false);
    setSearchTerm('');
    setSearchResults([]);
  };

  // Содержимое текущего раздела
  const renderContent = () => {
    const contents: { [key: string]: JSX.Element } = {
      installation: (
        <div className="bg-card border border-border rounded-2xl shadow-sm p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4">Установка</h2>
          <p className="mb-4 text-muted-foreground">
            Для начала работы с инструментом анонимизации, следуйте инструкциям ниже. Система работает на Node.js и использует пакетный менеджер pnpm.
          </p>
          <p className="mb-6">
            Убедитесь, что у вас установлен Node.js версии 18 или выше и пакетный менеджер pnpm.
          </p>
          <div className="relative bg-background border border-muted/30 rounded-xl p-4 shadow-sm overflow-x-auto">
            <button
              onClick={() => copyToClipboard(codeExamples['installation'], 'installation')}
              className="absolute top-3 right-3 p-2 rounded-md bg-card border border-border hover:bg-primary/10 transition-colors icon-animated"
              aria-label="Скопировать код"
            >
              {copiedCode === 'installation' ? (
                <Check className="w-5 h-5 icon-animated text-primary" />
              ) : (
                <Copy className="w-5 h-5 icon-animated" />
              )}
            </button>
            <pre className="text-sm font-mono text-foreground whitespace-pre-wrap leading-relaxed">{codeExamples['installation']}</pre>
          </div>
        </div>
      ),
      'quick-start': (
        <div>
          <h2 className="text-2xl font-bold mb-4">Быстрый старт</h2>
          <div className="bg-neutral-100 dark:bg-neutral-900 rounded-lg p-4 mb-6">
            <p className="text-muted dark:text-muted-foreground">
              Простой пример использования библиотеки анонимизации в вашем проекте.
            </p>
          </div>
          <p className="mb-4">
            После установки вы можете использовать библиотеку следующим образом:
          </p>
          <ol className="list-decimal pl-5 mb-6 space-y-2">
            <li>Импортируйте библиотеку в ваш проект</li>
            <li>Создайте объект с настройками анонимизации</li>
            <li>Вызовите функцию anonymize() с текстом и настройками</li>
          </ol>
        </div>
      ),
      requirements: (
        <div>
          <h2 className="text-2xl font-bold mb-4">Требования</h2>
          <div className="bg-neutral-100 dark:bg-neutral-900 rounded-lg p-4 mb-6">
            <p className="text-muted dark:text-muted-foreground">
              Минимальные требования для работы с инструментом анонимизации.
            </p>
          </div>
          <ul className="list-disc pl-5 mb-6 space-y-2">
            <li>Node.js 18.0 или выше</li>
            <li>pnpm 7.0 или выше</li>
            <li>Браузер с поддержкой ES6</li>
            <li>Минимум 2 ГБ оперативной памяти для обработки больших текстов</li>
          </ul>
        </div>
      ),
      'anonymization-types': (
        <div>
          <h2 className="text-2xl font-bold mb-4">Типы анонимизации</h2>
          <div className="bg-emerald-50 dark:bg-green-950 rounded-lg p-4 mb-6">
            <p className="text-muted dark:text-muted-foreground">
              Система поддерживает различные типы анонимизации данных, которые можно использовать по отдельности или комбинировать.
            </p>
          </div>
          <p className="mb-4">
            Библиотека позволяет анонимизировать следующие типы данных:
          </p>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <FeatureItem>ФИО и имена</FeatureItem>
            <FeatureItem>Email адреса</FeatureItem>
            <FeatureItem>Телефонные номера</FeatureItem>
            <FeatureItem>Адреса</FeatureItem>
            <FeatureItem>Даты</FeatureItem>
            <FeatureItem>IP-адреса</FeatureItem>
            <FeatureItem>Номера паспортов</FeatureItem>
            <FeatureItem>Пользовательские паттерны</FeatureItem>
          </ul>
        </div>
      ),
      'data-security': (
        <div>
          <h2 className="text-2xl font-bold mb-4">Безопасность данных</h2>
          <div className="bg-emerald-50 dark:bg-green-950 rounded-lg p-4 mb-6">
            <p className="text-muted dark:text-muted-foreground">
              Наш инструмент обеспечивает высокий уровень безопасности при обработке персональных данных.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
            <Card className="bg-background/60 backdrop-blur-sm border border-muted">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-md bg-primary/10 text-primary">
                    <Lock className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Все данные обрабатываются локально</h3>
                    <p className="text-sm text-muted-foreground">
                      Обработка происходит только на вашем устройстве, без отправки на сервер
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-background/60 backdrop-blur-sm border border-muted">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-md bg-primary/10 text-primary">
                    <Zap className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Оптимизированные алгоритмы</h3>
                    <p className="text-sm text-muted-foreground">
                      Быстрая и эффективная обработка даже больших объемов текста
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      ),
      'core-api': (
        <div>
          <h2 className="text-2xl font-bold mb-4">Основное API</h2>
          <div className="bg-violet-50 dark:bg-violet-950 rounded-lg p-4 mb-6">
            <p className="text-muted dark:text-muted-foreground">
              Документация по основным функциям API для интеграции в ваш проект.
            </p>
          </div>
          <p className="mb-6">
            Основная функция <code className="text-primary font-mono">anonymize()</code> принимает текст и объект с опциями анонимизации.
          </p>
        </div>
      ),
      'configuration': (
        <div>
          <h2 className="text-2xl font-bold mb-4">Конфигурация</h2>
          <div className="bg-violet-50 dark:bg-violet-950 rounded-lg p-4 mb-6">
            <p className="text-muted dark:text-muted-foreground">
              Настройки и параметры конфигурации для тонкой настройки процесса анонимизации.
            </p>
          </div>
          <p className="mb-4">
            В дополнение к базовым опциям, вы можете использовать расширенную конфигурацию:
          </p>
          <ul className="list-disc pl-5 mb-6 space-y-2">
            <li>
              <code className="text-primary font-mono">replacementMap</code> - Карта замены для конкретных типов данных
            </li>
            <li>
              <code className="text-primary font-mono">sensitivity</code> - Уровень чувствительности алгоритмов поиска (0-1)
            </li>
            <li>
              <code className="text-primary font-mono">language</code> - Основной язык текста для оптимизации распознавания
            </li>
          </ul>
        </div>
      ),
      'examples': (
        <div>
          <h2 className="text-2xl font-bold mb-4">Примеры</h2>
          <div className="bg-amber-50 dark:bg-orange-950 rounded-lg p-4 mb-6">
            <p className="text-muted dark:text-muted-foreground">
              Примеры использования библиотеки в различных сценариях.
            </p>
          </div>
          <p className="mb-4">
            Ниже приведены примеры для различных задач анонимизации:
          </p>

          <div className="space-y-4 mb-6">
            <Card className="bg-background/60 backdrop-blur-sm border border-muted overflow-hidden">
              <div className="p-3 bg-muted/30 flex justify-between items-center border-b border-muted">
                <h3 className="font-medium">Анонимизация имен и email адресов</h3>
              </div>
              <div className="p-4">
                <pre className="text-sm overflow-x-auto font-mono rounded-md">
                  {`const text = "Контакты: Петр Иванов, petya@example.com";
const result = anonymize(text, { 
  names: true, 
  emails: true 
});
// Результат: "Контакты: [ИМЯ], [EMAIL]"`}
                </pre>
              </div>
            </Card>

            <Card className="bg-background/60 backdrop-blur-sm border border-muted overflow-hidden">
              <div className="p-3 bg-muted/30 flex justify-between items-center border-b border-muted">
                <h3 className="font-medium">Использование пользовательских паттернов</h3>
              </div>
              <div className="p-4">
                <pre className="text-sm overflow-x-auto font-mono rounded-md">
                  {`const text = "ID пользователя: USER_1234, баланс: 5000 руб.";
const result = anonymize(text, { 
  custom: [/USER_\\d{4}/g] 
});
// Результат: "ID пользователя: [CUSTOM_1], баланс: 5000 руб."`}
                </pre>
              </div>
            </Card>
          </div>
        </div>
      ),
      'best-practices': (
        <div>
          <h2 className="text-2xl font-bold mb-4">Лучшие практики</h2>
          <div className="bg-amber-50 dark:bg-orange-950 rounded-lg p-4 mb-6">
            <p className="text-muted dark:text-muted-foreground">
              Рекомендации по эффективному использованию инструмента анонимизации.
            </p>
          </div>
          <div className="space-y-6 mb-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Оптимизация производительности</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>Включайте только необходимые типы анонимизации</li>
                <li>Используйте потоковую обработку для больших файлов</li>
                <li>Предварительно очищайте входные данные от лишнего форматирования</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Безопасность</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>Регулярно обновляйте библиотеку до последней версии</li>
                <li>Тестируйте результаты анонимизации на наличие упущенных данных</li>
                <li>Используйте дополнительную проверку для критичных данных</li>
              </ul>
            </div>
          </div>
        </div>
      ),
    };

    return contents[activeSection] || <div>Раздел не найден</div>;
  };

  // Хлебные крошки
  const renderBreadcrumbs = () => {
    let parentSectionId = '';
    let parentSectionTitle = '';

    // Находим родительский раздел
    for (const section of sections) {
      for (const subSection of section.subSections) {
        if (subSection.id === activeSection) {
          parentSectionId = section.id;
          parentSectionTitle = section.title;
          break;
        }
      }
    }

    // Находим текущий подраздел
    const currentSubSection = allSubSections.find(sub => sub.id === activeSection);

    return (
      <div className="flex items-center gap-2 mb-4 text-sm font-medium text-muted-foreground">
        <Link href="/docs" className="hover:text-foreground transition-colors">
          Документация
        </Link>
        <ChevronRight className="w-3 h-3" />
        <Link
          href={`#${parentSectionId}`}
          className="hover:text-foreground transition-colors"
          onClick={(e) => {
            e.preventDefault();
            const firstSubSectionId = sections.find(s => s.id === parentSectionId)?.subSections[0].id;
            if (firstSubSectionId) setActiveSection(firstSubSectionId);
          }}
        >
          {parentSectionTitle}
        </Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-foreground">{currentSubSection?.title}</span>
      </div>
    );
  };

  return (
    <div className="w-full min-h-screen bg-background text-foreground">
      <div className="container max-w-7xl mx-auto py-8 px-4">
        {/* Мобильный header */}
        <div className="flex md:hidden items-center justify-between mb-4 px-0">
          <h1 className="text-xl font-extrabold tracking-tight text-foreground">Документация</h1>
          <button
            className="p-2 rounded-xl bg-muted/70 hover:bg-muted transition-colors shadow-md"
            onClick={() => setMobileNavOpen(!mobileNavOpen)}
            aria-label={mobileNavOpen ? 'Закрыть меню' : 'Открыть меню'}
          >
            {mobileNavOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Sidebar */}
          <aside
            className={`md:col-span-3 xl:col-span-2 ${mobileNavOpen ? 'block fixed inset-0 z-50 bg-background/95 p-4 animate-fadeIn' : 'hidden md:block'} shadow-xl rounded-2xl border border-border/60 backdrop-blur-xl transition-all duration-300`}
            style={{ borderRadius: 'var(--radius-xl)' }}
          >
            {mobileNavOpen && (
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold">Меню</h2>
                <button
                  className="p-2 rounded-xl bg-muted/70 hover:bg-muted transition-colors shadow-md"
                  onClick={() => setMobileNavOpen(false)}
                  aria-label="Закрыть меню"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            )}
            <div className="md:sticky md:top-4">
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <TextInputField
                  placeholder="Поиск..."
                  className="w-full pl-10 bg-background border-muted/70 focus:border-primary rounded-xl shadow-none focus:shadow-md transition-all duration-200"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                />
              </div>
              {searchResults.length > 0 ? (
                <AnimatePresence>
                  <motion.div
                    className="space-y-2 mb-4"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    <h3 className="text-xs font-medium text-muted-foreground mb-2">Результаты поиска</h3>
                    {searchResults.map(result => (
                      <motion.button
                        key={result.id}
                        className="flex items-center w-full px-3 py-2 text-left rounded-xl hover:bg-primary/10 transition-all duration-200 text-sm font-medium shadow-sm"
                        onClick={() => handleSectionChange(result.id)}
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        <div>
                          <div className="text-sm font-semibold">{result.title}</div>
                          <div className="text-xs text-muted-foreground">{result.parentTitle}</div>
                        </div>
                      </motion.button>
                    ))}
                  </motion.div>
                </AnimatePresence>
              ) :
                <div className="space-y-4">
                  {sections.map(section => {
                    const isActiveGroup = getActiveGroup() === section.id;
                    const SectionIcon = section.icon;
                    return (
                      <div key={section.id} id={section.id} className="mb-4">
                        <div className={`flex items-center py-1 mb-2 font-bold text-base ${isActiveGroup ? 'text-primary' : 'text-foreground/80'}`}>
                          <SectionIcon className="w-4 h-4 mr-2" />
                          <span>{section.title}</span>
                        </div>
                        <div className="space-y-2 ml-4">
                          {section.subSections.map(subSection => (
                            <motion.button
                              key={subSection.id}
                              className={`flex items-center w-full text-left px-3 py-2 text-sm rounded-xl transition-all duration-200 shadow-sm ${activeSection === subSection.id
                                ? 'bg-primary/10 text-primary font-bold scale-[1.03]'
                                : 'hover:bg-muted/40 text-muted-foreground hover:text-foreground'}
                                focus-visible:ring-2 focus-visible:ring-primary outline-none`}
                              onClick={() => handleSectionChange(subSection.id)}
                              whileTap={{ scale: 0.98 }}
                              style={{ borderRadius: 'var(--radius-xl)' }}
                            >
                              {subSection.title}
                            </motion.button>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              }
              {/* Дополнительные ресурсы */}
              <div className="hidden md:block mt-4 pt-4 border-t border-muted/60">
                <h3 className="text-xs font-medium text-muted-foreground mb-2 flex items-center">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Дополнительно
                </h3>
                <div className="space-y-2">
                  <a href="https://github.com/fred-yagofarov1314/anonymize-tool" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-xs text-muted-foreground hover:text-primary transition-colors">
                    <Github className="w-4 h-4" />GitHub
                  </a>
                  <a href="/docs/changelog" className="flex items-center gap-2 text-xs text-muted-foreground hover:text-primary transition-colors">
                    <FileText className="w-4 h-4" />Changelog
                  </a>
                  <a href="/docs/faq" className="flex items-center gap-2 text-xs text-muted-foreground hover:text-primary transition-colors">
                    <HelpCircle className="w-4 h-4" />FAQ
                  </a>
                </div>
              </div>
            </div>
          </aside>
          {/* Основное содержимое */}
          <main className="md:col-span-9 xl:col-span-10">
            <div className="mb-4 animate-fade-in">
              {renderBreadcrumbs()}
            </div>
            <article className="bg-background/90 border border-muted/60 rounded-2xl p-6 shadow-xl mb-6 animate-fadeInUp" style={{ borderRadius: 'var(--radius-xl)' }}>
              {renderContent()}
              {/* Код с возможностью копирования */}
              {codeExamples[activeSection] && (
                <div className="mb-4 animate-fade-in delay-200"></div>
              )}
            </article>
          </main>
        </div>
      </div>
    </div>
  );
}

function ResourceCard({
  icon,
  title,
  description,
  link,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  link: string;
}) {
  return (
    <Link href={link}>
      <div className="flex items-center gap-3 p-2 rounded-md hover:bg-muted/50 transition-colors">
        <div className="text-muted-foreground">{icon}</div>
        <div>
          <div className="text-sm font-medium">{title}</div>
          <div className="text-xs text-muted-foreground">{description}</div>
        </div>
      </div>
    </Link>
  );
}

function FeatureItem({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2">
      <CheckItem />
      <span>{children}</span>
    </div>
  );
}

function CheckItem() {
  return (
    <svg
      className="w-5 h-5 text-green-500"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M5 13l4 4L19 7"
      />
    </svg>
  );
}

