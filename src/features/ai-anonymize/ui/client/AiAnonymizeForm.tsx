'use client';

import React, { useState, useCallback, useEffect } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { aiAnonymizeText, EntityResult } from '@/services/aiAnonymization';
import { Button } from '@/shared/ui/inputs/button/Button';

// Определение схемы валидации формы
const aiAnonymizeFormSchema = z.object({
  inputText: z.string().min(1, 'Текст не может быть пустым'),
});

type AiAnonymizeFormData = z.infer<typeof aiAnonymizeFormSchema>;

// Словарь для маппинга типов сущностей на их отображаемые аналоги
const ENTITY_TYPE_MAPPING: Record<string, string> = {
  PERSON: '[ИМЯ]',
  STREET: '[УЛИЦА]',
  ADDRESS: '[АДРЕС]',
  PHONE: '[ТЕЛЕФОН]',
  MOBILE_PHONE: '[ТЕЛЕФОН]',
  EMAIL: '[EMAIL]',
  DATE: '[ДАТА]',
  ORGANIZATION: '[ОРГАНИЗАЦИЯ]',
  IP: '[IP-АДРЕС]',
  HOME: '[НОМЕР ДОМА]',
  APARTMENT: '[КВАРТИРА]',
  DOCUMENT: '[ДОКУМЕНТ]',
  FULL_NAME: '[ПОЛНОЕ_ИМЯ]',
  PATRONYMIC: '[ОТЧЕСТВО]',
  SURNAME: '[ФАМИЛИЯ]',
  NAME: '[ИМЯ]',
  CITY: '[ГОРОД]',
  REGION: '[РЕГИОН]',
  COUNTRY: '[СТРАНА]',
  ZIP_CODE: '[ИНДЕКС]',
  PASSPORT: '[ПАСПОРТ]',
  SNILS: '[СНИЛС]',
  INN: '[ИНН]',
  CAR_NUMBER: '[НОМЕР_АВТО]',
  BANK_CARD: '[БАНКОВСКАЯ_КАРТА]',
  // Можно добавить другие типы сущностей по мере необходимости
};

// Словарь для отображения типов сущностей в интерфейсе без скобок
const ENTITY_DISPLAY_NAMES: Record<string, string> = {
  PERSON: 'ИМЯ',
  STREET: 'УЛИЦА',
  ADDRESS: 'АДРЕС',
  PHONE: 'ТЕЛЕФОН',
  MOBILE_PHONE: 'МОБИЛЬНЫЙ ТЕЛЕФОН',
  EMAIL: 'EMAIL',
  DATE: 'ДАТА',
  ORGANIZATION: 'ОРГАНИЗАЦИЯ',
  IP: 'IP-АДРЕС',
  HOME: 'НОМЕР ДОМА',
  APARTMENT: 'КВАРТИРА',
  DOCUMENT: 'ДОКУМЕНТ',
  FULL_NAME: 'ПОЛНОЕ ИМЯ',
  PATRONYMIC: 'ОТЧЕСТВО',
  SURNAME: 'ФАМИЛИЯ',
  NAME: 'ИМЯ',
  CITY: 'ГОРОД',
  REGION: 'РЕГИОН',
  COUNTRY: 'СТРАНА',
  ZIP_CODE: 'ИНДЕКС',
  PASSPORT: 'ПАСПОРТ',
  SNILS: 'СНИЛС',
  INN: 'ИНН',
  CAR_NUMBER: 'НОМЕР АВТО',
  BANK_CARD: 'БАНКОВСКАЯ КАРТА',
  // Можно добавить другие типы сущностей по мере необходимости
};

export function AiAnonymizeForm() {
  // Состояние для хранения результатов анонимизации
  const [anonymizedText, setAnonymizedText] = useState<string | null>(null);
  const [originalText, setOriginalText] = useState<string | null>(null);
  const [entities, setEntities] = useState<EntityResult[]>([]);
  const [formattedText, setFormattedText] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Инициализация формы с валидацией
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<AiAnonymizeFormData>({
    resolver: zodResolver(aiAnonymizeFormSchema),
    mode: 'onChange',
  });

  // Функция для форматирования текста с заменой сущностей на метки
  const formatTextWithEntityLabels = useCallback(
    (text: string, entities: EntityResult[]): string => {
      if (!text || !entities.length) return text;

      let formattedText = text;

      // Сортируем сущности по длине (от самых длинных к коротким),
      // чтобы избежать проблем с заменой подстрок
      const sortedEntities = [...entities].sort((a, b) => b.text.length - a.text.length);

      // Функция для определения количества дней в месяце
      const getDaysInMonth = (month: number, year: number = new Date().getFullYear()): number => {
        // Месяцы в JavaScript идут от 0 до 11
        return new Date(year, month, 0).getDate();
      };

      // Карта соответствия названий месяцев их номерам
      const monthNameToNumber: Record<string, number> = {
        январь: 1,
        января: 1,
        янв: 1,
        january: 1,
        jan: 1,
        февраль: 2,
        февраля: 2,
        фев: 2,
        february: 2,
        feb: 2,
        март: 3,
        марта: 3,
        мар: 3,
        march: 3,
        mar: 3,
        апрель: 4,
        апреля: 4,
        апр: 4,
        april: 4,
        apr: 4,
        май: 5,
        мая: 5,
        may: 5,
        июнь: 6,
        июня: 6,
        июн: 6,
        june: 6,
        jun: 6,
        июль: 7,
        июля: 7,
        июл: 7,
        july: 7,
        jul: 7,
        август: 8,
        августа: 8,
        авг: 8,
        august: 8,
        aug: 8,
        сентябрь: 9,
        сентября: 9,
        сен: 9,
        september: 9,
        sep: 9,
        октябрь: 10,
        октября: 10,
        окт: 10,
        october: 10,
        oct: 10,
        ноябрь: 11,
        ноября: 11,
        ноя: 11,
        november: 11,
        nov: 11,
        декабрь: 12,
        декабря: 12,
        дек: 12,
        december: 12,
        dec: 12,
      };

      // Ищем упоминания месяцев в тексте
      let detectedMonth: number | null = null;
      for (const entity of sortedEntities) {
        if (entity.type === 'DATE') {
          const monthText = entity.text.toLowerCase();
          for (const [monthName, monthNumber] of Object.entries(monthNameToNumber)) {
            if (monthText.includes(monthName.toLowerCase())) {
              detectedMonth = monthNumber;
              break;
            }
          }
          // Проверяем числовой формат месяца (например, 4.1844)
          const monthRegex = /\b(0?[1-9]|1[0-2])\b/;
          const monthMatch = monthText.match(monthRegex);
          if (monthMatch) {
            detectedMonth = parseInt(monthMatch[1], 10);
          }
          if (detectedMonth) break;
        }
      }

      // Определяем максимальное количество дней для выбранного месяца
      const maxDay = detectedMonth ? getDaysInMonth(detectedMonth) : 31;

      // Заменяем каждую сущность на соответствующую метку
      for (const entity of sortedEntities) {
        const label = ENTITY_TYPE_MAPPING[entity.type] || `[${entity.type}]`;

        // Обработка текста для поиска
        let searchText = entity.text;

        // Удаляем плюс, если за ним следуют минимум 5 цифр
        if (searchText.startsWith('+') && /^\+\d{5,}/.test(searchText)) {
          searchText = searchText.substring(1);
        }

        // Глобальная замена всех вхождений
        const regex = new RegExp(searchText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');

        // Если это DATE_DAY, заменяем на случайное число в пределах месяца
        if (entity.type === 'DATE_DAY') {
          const randomDay = Math.floor(Math.random() * maxDay) + 1;
          formattedText = formattedText.replace(regex, randomDay.toString());
        } else {
          formattedText = formattedText.replace(regex, label);
        }

        // Если был плюс в начале и за ним шли цифры, проверяем оригинальный вариант
        if (entity.text.startsWith('+') && /^\+\d{5,}/.test(entity.text)) {
          const originalRegex = new RegExp(
            '\\+' + searchText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'),
            'g',
          );
          formattedText = formattedText.replace(originalRegex, label);
        }
      }

      // Форматирование дат: убираем лишние пробелы вокруг точек в датах
      // и добавляем ведущие нули для однозначных дней и месяцев
      formattedText = formattedText.replace(
        /(\d+)\s*\.\s*(\d+)\s*\.\s*(\d+)/g,
        (match, day, month, year) => {
          const formattedDay = day.length === 1 ? '0' + day : day;
          const formattedMonth = month.length === 1 ? '0' + month : month;
          return `${formattedDay}.${formattedMonth}.${year}`;
        },
      );

      return formattedText;
    },
    [],
  );

  // Эффект для форматирования текста при изменении результатов анонимизации
  useEffect(() => {
    if (anonymizedText && entities.length) {
      const formatted = formatTextWithEntityLabels(anonymizedText, entities);
      setFormattedText(formatted);
    } else {
      setFormattedText(anonymizedText);
    }
  }, [anonymizedText, entities, formatTextWithEntityLabels]);

  // Обработчик отправки формы
  const onSubmit = useCallback(async (data: AiAnonymizeFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await aiAnonymizeText(data.inputText);

      setOriginalText(result.originalText);
      setAnonymizedText(result.anonymizedText);

      // Предобработка сущностей для объединения "+" и номера телефона
      const processedEntities: EntityResult[] = [];
      let skipNextEntity = false;

      for (let i = 0; i < result.entities.length; i++) {
        if (skipNextEntity) {
          skipNextEntity = false;
          continue;
        }

        const current = result.entities[i];
        const next = i < result.entities.length - 1 ? result.entities[i + 1] : null;

        // Проверяем, является ли текущая сущность одиночным "+" и следует ли за ней цифры
        if (
          current.text === '+' &&
          next &&
          /^\d{5,}/.test(next.text) &&
          (current.type === 'MOBILE_PHONE' || next.type === 'MOBILE_PHONE')
        ) {
          // Объединяем сущности
          processedEntities.push({
            type: 'MOBILE_PHONE',
            text: '+' + next.text,
          });

          skipNextEntity = true;
        } else {
          processedEntities.push(current);
        }
      }

      setEntities(processedEntities);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Произошла неизвестная ошибка');
      console.error('Ошибка при анонимизации:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Копирование результата в буфер обмена
  const copyToClipboard = useCallback(() => {
    if (formattedText) {
      navigator.clipboard
        .writeText(formattedText)
        .then(() => {
          alert('Текст скопирован в буфер обмена');
        })
        .catch(error => {
          console.error('Ошибка при копировании:', error);
        });
    }
  }, [formattedText]);

  // Скачивание результата в виде файла
  const downloadAsFile = useCallback(() => {
    if (formattedText) {
      const blob = new Blob([formattedText], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'анонимизированный_текст.txt';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  }, [formattedText]);

  // Очистка формы и результатов
  const handleReset = useCallback(() => {
    reset();
    setOriginalText(null);
    setAnonymizedText(null);
    setFormattedText(null);
    setEntities([]);
    setError(null);
  }, [reset]);

  return (
    <div className="flex flex-col gap-6 sm:gap-8 md:gap-10 w-full">
      {/* Верхняя карточка: ввод */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col w-full h-full bg-card/80 border border-border/60 rounded-xl sm:rounded-2xl md:rounded-3xl shadow-lg sm:shadow-xl md:shadow-2xl p-4 sm:p-6 md:p-8 lg:p-12 gap-2 sm:gap-3 md:gap-4 transition-all duration-300 min-h-[300px] sm:min-h-[350px] max-w-full"
      >
        <h2 className="text-2xl font-bold text-center mb-4">Анонимизация</h2>
        <textarea
          {...register('inputText')}
          placeholder="Введите или вставьте текст для анонимизации..."
          className="min-h-[200px] md:min-h-[260px] max-h-[400px] text-lg w-full rounded-2xl border border-muted/30 bg-background/80 px-6 py-4 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all resize-none shadow-md placeholder:text-muted-foreground/70 font-mono font-medium"
          aria-required="true"
          autoFocus
        />
        {errors.inputText && (
          <span className="text-destructive text-sm mb-1 flex items-center gap-1 animate-shake">
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" stroke="#ef4444" strokeWidth="2" />
              <path d="M12 8v4m0 4h.01" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" />
            </svg>
            {errors.inputText.message}
          </span>
        )}
        <div className="flex flex-wrap gap-4 items-center justify-center mt-2">
          <Button
            type="submit"
            disabled={isLoading}
            className="rounded-xl py-6 px-8 text-lg font-medium w-full md:w-auto min-w-[200px] bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg"
          >
            {isLoading ? 'Обработка...' : 'Анонимизировать'}
          </Button>
          <Button
            type="button"
            onClick={handleReset}
            variant="outline"
            className="rounded-xl py-6 px-8 text-lg font-medium w-full md:w-auto"
          >
            Очистить
          </Button>
        </div>
      </form>

      {/* Нижняя карточка: результат */}
      <div className="flex flex-col w-full bg-card/80 border border-border/60 rounded-3xl shadow-2xl p-8 md:p-12 gap-4 transition-all duration-300 min-h-[400px] max-w-full">
        <h2 className="text-2xl font-bold text-center mb-4">Результат</h2>

        {error && (
          <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-xl mb-4">
            <p className="text-destructive font-medium">{error}</p>
          </div>
        )}

        <div className="flex-1 overflow-auto bg-background/80 rounded-2xl px-6 py-4 mb-4 border border-muted/30 shadow-md min-h-[260px]">
          {/* Полностью новый блок с фиксированными стилями для текста */}
          <div
            style={{
              width: '100%',
              textAlign: 'left',
              display: 'block',
            }}
          >
            {formattedText ? (
              <div
                style={{
                  whiteSpace: 'pre-wrap',
                  fontFamily: 'monospace',
                  fontSize: '1.125rem' /* text-lg */,
                  fontWeight: '500' /* font-medium */,
                  color: 'var(--foreground)',
                  textAlign: 'left',
                  width: '100%',
                  display: 'block',
                }}
              >
                {formattedText}
              </div>
            ) : (
              <div
                style={{
                  color: 'var(--muted-foreground)',
                  textAlign: 'left',
                }}
              >
                Здесь появится анонимизированный текст
              </div>
            )}
          </div>
        </div>

        {formattedText && (
          <div className="flex flex-wrap gap-4 items-center justify-center">
            <Button
              onClick={copyToClipboard}
              variant="secondary"
              className="rounded-xl py-2 px-4 w-full md:w-auto"
            >
              Копировать
            </Button>
            <Button
              onClick={downloadAsFile}
              variant="secondary"
              className="rounded-xl py-2 px-4 w-full md:w-auto"
            >
              Скачать
            </Button>
          </div>
        )}
      </div>

      {/* Отдельный блок с найденными сущностями */}
      {entities.length > 0 && (
        <div className="w-full bg-card/80 border border-border/60 rounded-xl sm:rounded-2xl md:rounded-3xl shadow-lg sm:shadow-xl p-4 sm:p-6 md:p-8 transition-all duration-300">
          <h2 className="text-xl font-bold mb-4 text-center">Найденные сущности</h2>
          <div className="bg-background/80 rounded-xl p-4 border border-muted/30 shadow-sm">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {entities.map((entity, index) => {
                const label = ENTITY_TYPE_MAPPING[entity.type] || `[${entity.type}]`;
                const displayName = ENTITY_DISPLAY_NAMES[entity.type] || entity.type;
                return (
                  <div
                    key={index}
                    className="flex flex-col p-3 rounded-lg bg-card/60 border border-border/40 text-sm transition-all hover:shadow-md"
                  >
                    <span className="font-bold text-primary mb-1">{displayName}</span>
                    <span className="font-mono text-sm break-all">{entity.text}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
