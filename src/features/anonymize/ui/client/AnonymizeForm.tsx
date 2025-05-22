'use client';

import React, { useCallback, useMemo, memo } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, FormProvider } from 'react-hook-form';

import type { UseAnonymizeOptions } from '@/domain/anonymize';
import { useAnonymizeStore } from '@/domain/features/anonymize';
import { getIntl, formatMessage } from '@/lib/i18n/index';
// Импортируем UI компоненты напрямую из их модулей
import { withMemo } from '@/shared/lib/utils/memo';
import { Button } from '@/shared/ui/inputs/button/Button';
import { TextareaField } from '@/shared/ui/inputs/textarea/TextareaField';
import { Checkbox } from '@/shared/ui/inputs/checkbox/Checkbox';
import { PreformattedText } from '@/shared/ui/typography/PreformattedText';
import { AriaLive } from '@/shared/ui/utils/accessibility/AriaLive';
// Импортируем стили из compositions
import { forms } from '@/styles/compositions';

import { anonymizeModel } from '../../model/anonymize.model';
import { anonymizeFormSchema } from '../../model/schemas';

import type { AnonymizeFormData } from '../../model/schemas';

export interface AnonymizeFormProps {
  className?: string;
  locale?: string;
}

// Мемоизированный чекбокс для лучшей производительности
const MemoizedCheckbox = memo(
  ({
    option,
    checked,
    onChange,
    locale = 'ru',
  }: {
    option: { id: string; key: string; label: string };
    checked: boolean;
    onChange: () => void;
    locale?: string;
  }) => {
    const intl = useMemo(() => getIntl(locale), [locale]);
    const translatedLabel = formatMessage(intl, `anonymize.options.${option.key}`, {
      defaultMessage: option.label,
    });

    return (
      <Checkbox
        key={option.id}
        checked={checked}
        onChange={onChange}
        label={translatedLabel}
        id={option.id}
        aria-describedby={`option-desc-${option.id}`}
      />
    );
  },
);

MemoizedCheckbox.displayName = 'MemoizedCheckbox';

// Мемоизированная группа чекбоксов
const OptionsCheckboxGroup = memo(
  ({
    options,
    toggleOption,
    locale = 'ru',
  }: {
    options: UseAnonymizeOptions;
    toggleOption: (key: keyof UseAnonymizeOptions) => void;
    locale?: string;
  }) => {
    const optionsConfig = useMemo(() => anonymizeModel.getOptionsConfig(), []);

    return (
      <div className={forms.checkboxGroup}>
        {optionsConfig.map(option => (
          <MemoizedCheckbox
            key={option.id}
            option={option}
            checked={options[option.key as keyof UseAnonymizeOptions] || false}
            onChange={() => {
              toggleOption(option.key as keyof UseAnonymizeOptions);
            }}
            locale={locale}
          />
        ))}
      </div>
    );
  },
);

OptionsCheckboxGroup.displayName = 'OptionsCheckboxGroup';

// Мемоизированное отображение кнопок действий
const ResultActions = memo(
  ({
    anonymizedText,
    onCopy,
    onDownload,
    locale = 'ru',
  }: {
    anonymizedText: string | null;
    onCopy: () => void;
    onDownload: () => void;
    locale?: string;
  }) => {
    const intl = useMemo(() => getIntl(locale), [locale]);

    if (!anonymizedText) return null;

    return (
      <>
        <Button onClick={onCopy} variant="secondary" size="sm">
          {formatMessage(intl, 'anonymize.form.copyButton')}
        </Button>
        <Button onClick={onDownload} variant="secondary" size="sm">
          {formatMessage(intl, 'anonymize.form.downloadButton')}
        </Button>
      </>
    );
  },
);

ResultActions.displayName = 'ResultActions';

// Мемоизированное отображение результата
const ResultOutput = memo(
  ({ anonymizedText, locale = 'ru' }: { anonymizedText: string | null; locale?: string }) => {
    const intl = useMemo(() => getIntl(locale), [locale]);

    return (
      <div aria-live="polite" aria-atomic="true">
        {anonymizedText ? (
          <PreformattedText content={anonymizedText} />
        ) : (
          <p className="text-muted-foreground dark:text-muted-foreground">
            {formatMessage(intl, 'anonymize.form.resultPlaceholder')}
          </p>
        )}
      </div>
    );
  },
);

ResultOutput.displayName = 'ResultOutput';

const AnonymizeFormBase: React.FC<AnonymizeFormProps> = ({ locale = 'ru' }) => {
  const intl = useMemo(() => getIntl(locale), [locale]);

  // Используем состояние из модели
  const {
    anonymizedText,
    statusMessage,
    options,
    toggleOption,
    anonymize,
    copyToClipboard,
    downloadAsFile,
  } = useAnonymizeStore();

  const methods = useForm<AnonymizeFormData>({
    resolver: zodResolver(anonymizeFormSchema),
    mode: 'onChange',
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = methods;

  const onSubmit = useCallback(
    async (data: AnonymizeFormData) => {
      try {
        // Обновляем текст в модели перед анонимизацией
        useAnonymizeStore.setState({ inputText: data.inputText });
        // Запускаем процесс анонимизации через модель
        await anonymize();
      } catch (error) {
        console.error('Ошибка при анонимизации текста:', error);
        // Ошибки будут обрабатываться на уровне сервиса и отображаться через статус
      }
    },
    [anonymize],
  );

  const handleCopy = useCallback(() => {
    void copyToClipboard();
  }, [copyToClipboard]);

  const handleDownload = useCallback(() => {
    downloadAsFile();
  }, [downloadAsFile]);

  const handleReset = useCallback(() => {
    reset();
    useAnonymizeStore.setState({
      inputText: '',
      anonymizedText: '',
    });
  }, [reset]);

  // Обертка для handleSubmit, чтобы правильно обрабатывать асинхронную onSubmit
  const handleSubmitWrapper = (data: AnonymizeFormData) => {
    void onSubmit(data).catch(() => {
      // В продакшн-версии здесь мог бы быть вызов logger.error вместо console.log

      // Обновляем статус для пользователя
      useAnonymizeStore.setState({
        statusMessage: 'Произошла непредвиденная ошибка при обработке данных',
      });
    });
  };

  return (
    <div className="w-full max-w-7xl mx-auto flex flex-col gap-0">
      <FormProvider {...methods}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 w-full">
          {/* Левая карточка: ввод */}
          <form
            onSubmit={handleSubmit(handleSubmitWrapper)}
            className="flex flex-col h-full bg-card/80 border border-border/60 rounded-3xl shadow-2xl p-8 md:p-12 gap-4 transition-all duration-300 min-h-[400px] md:min-h-[500px] max-w-full"
          >
            <textarea
              {...register('inputText', { required: true })}
              placeholder="Введите или вставьте текст для анонимизации..."
              className="min-h-[200px] md:min-h-[260px] max-h-[400px] text-lg w-full rounded-2xl border border-muted/30 bg-background/80 px-6 py-4 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all resize-none shadow-md placeholder:text-muted-foreground/70 font-mono font-medium"
              aria-required="true"
              autoFocus
            />
            {errors.inputText && (
              <span className="text-destructive text-sm mb-1 flex items-center gap-1 animate-shake">
                <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="#ef4444" strokeWidth="2" /><path d="M12 8v4m0 4h.01" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" /></svg>
                Введите текст для анонимизации
              </span>
            )}
            <div className="flex flex-wrap gap-4 items-center justify-start mt-2">
              <Checkbox
                checked={options.replaceNames}
                onChange={() => toggleOption('replaceNames')}
                label="Имена"
                id="anonymize-names"
                className="text-base scale-110 rounded-xl border border-border focus:ring-primary/40 transition-all duration-200"
              />
              <Checkbox
                checked={options.replaceEmails}
                onChange={() => toggleOption('replaceEmails')}
                label="Email"
                id="anonymize-emails"
                className="text-base scale-110 rounded-xl border border-border focus:ring-primary/40 transition-all duration-200"
              />
              <Checkbox
                checked={options.replacePhones}
                onChange={() => toggleOption('replacePhones')}
                label="Телефоны"
                id="anonymize-phones"
                className="text-base scale-110 rounded-xl border border-border focus:ring-primary/40 transition-all duration-200"
              />
            </div>
            <div className="flex flex-row gap-4 mt-4 w-full">
              <Button
                type="submit"
                disabled={isSubmitting}
                aria-disabled={isSubmitting}
                className="button-primary text-lg px-8 py-4 rounded-2xl min-w-[160px] font-semibold shadow-lg transition-all duration-200 hover:scale-[1.05] active:scale-95"
              >
                {isSubmitting ? 'Обработка...' : 'Анонимизировать'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleReset}
                className="bg-card/90 border border-border/60 text-lg px-8 py-4 rounded-xl min-w-[160px] font-semibold shadow-none transition-all duration-200 hover:bg-primary/5 hover:text-primary text-foreground/80 ml-4"
              >
                Сбросить
              </Button>
            </div>
            {statusMessage && (
              <div
                className={`mt-3 p-4 rounded-xl text-base font-medium flex items-center gap-2 transition-all duration-200 ${statusMessage.includes('ошибка') || statusMessage.includes('Ошибка')
                  ? 'bg-destructive/10 text-destructive border border-destructive/20'
                  : 'bg-success/10 text-success border border-success/20'
                  }`}
                role="alert"
              >
                {statusMessage.includes('ошибка') || statusMessage.includes('Ошибка') ? (
                  <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="#ef4444" strokeWidth="2" /><path d="M12 8v4m0 4h.01" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" /></svg>
                ) : (
                  <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="#22c55e" strokeWidth="2" /><path d="M9 12l2 2 4-4" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" /></svg>
                )}
                {statusMessage}
              </div>
            )}
            <AriaLive message={statusMessage || ''} politeness="polite" className="sr-only" />
          </form>
          {/* Правая карточка: результат */}
          <div className="relative bg-card/80 border border-border/60 rounded-3xl shadow-2xl w-full h-full p-8 md:p-12 flex flex-col transition-all duration-300 min-h-[400px] md:min-h-[500px] max-w-full">
            <div className="flex gap-3 mb-3 self-end">
              {anonymizedText && (
                <>
                  <Button onClick={handleCopy} variant="secondary" size="lg" className="min-w-[120px] rounded-xl shadow-lg transition-all duration-200 hover:scale-105">Скопировать</Button>
                  <Button onClick={handleDownload} variant="secondary" size="lg" className="min-w-[120px] rounded-xl shadow-lg transition-all duration-200 hover:scale-105">Скачать</Button>
                </>
              )}
            </div>
            <div className="bg-transparent p-6 md:p-7 rounded-xl overflow-auto min-h-[200px] md:min-h-[260px] max-h-[400px] border border-muted/30 text-lg transition-all duration-200 flex-1 font-mono shadow-md">
              {anonymizedText ? (
                <PreformattedText content={anonymizedText} />
              ) : (
                <span className="text-muted-foreground">Здесь появится анонимизированный текст</span>
              )}
            </div>
          </div>
        </div>
      </FormProvider>
    </div>
  );
};

AnonymizeFormBase.displayName = 'AnonymizeForm';

export const AnonymizeForm = withMemo(AnonymizeFormBase);

export default AnonymizeForm;
