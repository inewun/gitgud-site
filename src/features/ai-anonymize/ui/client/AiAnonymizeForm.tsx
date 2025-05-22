'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/shared/ui/inputs/button/Button';
import { PreformattedText } from '@/shared/ui/typography/PreformattedText';
import { aiAnonymizeText, EntityResult } from '@/services/aiAnonymization';

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
  const formatTextWithEntityLabels = useCallback((text: string, entities: EntityResult[]): string => {
    if (!text || !entities.length) return text;
    
    let formattedText = text;
    
    // Сортируем сущности по длине (от самых длинных к коротким),
    // чтобы избежать проблем с заменой подстрок
    const sortedEntities = [...entities].sort((a, b) => b.text.length - a.text.length);
    
    // Заменяем каждую сущность на соответствующую метку
    for (const entity of sortedEntities) {
      const label = ENTITY_TYPE_MAPPING[entity.type] || `[${entity.type}]`;
      
      // Глобальная замена всех вхождений
      const regex = new RegExp(entity.text, 'g');
      formattedText = formattedText.replace(regex, label);
    }
    
    return formattedText;
  }, []);

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
      setEntities(result.entities);
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
      navigator.clipboard.writeText(formattedText)
        .then(() => {
          alert('Текст скопирован в буфер обмена');
        })
        .catch((error) => {
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 md:gap-10 w-full">      {/* Левая карточка: ввод */}      <form        onSubmit={handleSubmit(onSubmit)}        className="flex flex-col h-full bg-card/80 border border-border/60 rounded-xl sm:rounded-2xl md:rounded-3xl shadow-lg sm:shadow-xl md:shadow-2xl p-4 sm:p-6 md:p-8 lg:p-12 gap-2 sm:gap-3 md:gap-4 transition-all duration-300 min-h-[300px] sm:min-h-[350px] md:min-h-[500px] max-w-full"      >
        <h2 className="text-2xl font-bold text-center mb-4">Анонимизация</h2>
        <p className="text-muted-foreground text-center mb-4">
          Интеллектуальная анонимизация с использованием нейросетей
        </p>
        <textarea
          {...register('inputText')}
          placeholder="Введите или вставьте текст для анонимизации..."
          className="min-h-[200px] md:min-h-[260px] max-h-[400px] text-lg w-full rounded-2xl border border-muted/30 bg-background/80 px-6 py-4 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all resize-none shadow-md placeholder:text-muted-foreground/70 font-mono font-medium"
          aria-required="true"
          autoFocus
        />
        {errors.inputText && (
          <span className="text-destructive text-sm mb-1 flex items-center gap-1 animate-shake">
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="#ef4444" strokeWidth="2" /><path d="M12 8v4m0 4h.01" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" /></svg>
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

      {/* Правая карточка: результат */}
      <div className="flex flex-col h-full bg-card/80 border border-border/60 rounded-3xl shadow-2xl p-8 md:p-12 gap-4 transition-all duration-300 min-h-[400px] md:min-h-[500px] max-w-full">
        <h2 className="text-2xl font-bold text-center mb-4">Результат</h2>
        
        {error && (
          <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-xl mb-4">
            <p className="text-destructive font-medium">{error}</p>
          </div>
        )}

        <div className="flex-1 overflow-auto bg-background/80 rounded-2xl p-6 mb-4 border border-muted/30 shadow-md min-h-[260px]">
          {formattedText ? (
            <PreformattedText content={formattedText} />
          ) : (
            <p className="text-muted-foreground dark:text-muted-foreground">
              Здесь появится анонимизированный текст
            </p>
          )}
        </div>

        {entities.length > 0 && (
          <div className="mb-4">
            <h3 className="font-bold mb-2">Найденные сущности:</h3>
            <div className="bg-background/80 rounded-xl p-4 border border-muted/30 shadow-md">
              <ul className="list-disc list-inside space-y-1">
                {entities.map((entity, index) => {
                  const label = ENTITY_TYPE_MAPPING[entity.type] || `[${entity.type}]`;
                  return (
                    <li key={index} className="text-sm">
                      <span className="font-medium">{label}:</span> {entity.text}
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        )}

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
    </div>
  );
} 