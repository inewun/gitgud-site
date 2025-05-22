# Документация API компонентов

В этом документе представлена подробная документация API для всех переиспользуемых компонентов приложения, включая схемы пропсов и примеры использования.

## Общие UI компоненты

### Button

```tsx
import { Button } from '@/shared/ui/inputs/button/Button';

<Button variant="primary" size="md" onClick={() => console.log('Нажата кнопка')}>
  Нажми меня
</Button>;
```

#### Props

| Имя         | Тип                                                                      | По умолчанию | Описание                                  |
| ----------- | ------------------------------------------------------------------------ | ------------ | ----------------------------------------- |
| `variant`   | `'primary' \| 'secondary' \| 'outline' \| 'ghost' \| 'link' \| 'danger'` | `'primary'`  | Стилевой вариант кнопки                   |
| `size`      | `'sm' \| 'md' \| 'lg'`                                                   | `'md'`       | Размер кнопки                             |
| `fullWidth` | `boolean`                                                                | `false`      | Растянуть кнопку на всю ширину контейнера |
| `disabled`  | `boolean`                                                                | `false`      | Отключает взаимодействие с кнопкой        |
| `loading`   | `boolean`                                                                | `false`      | Показывает состояние загрузки             |
| `leftIcon`  | `ReactNode`                                                              | -            | Иконка слева от текста                    |
| `rightIcon` | `ReactNode`                                                              | -            | Иконка справа от текста                   |
| `onClick`   | `(e: MouseEvent) => void`                                                | -            | Обработчик клика                          |
| `type`      | `'button' \| 'submit' \| 'reset'`                                        | `'button'`   | HTML-атрибут type                         |
| `className` | `string`                                                                 | -            | Дополнительные CSS-классы                 |

### Card

```tsx
import { Card } from '@/shared/ui/layout/card/Card';

<Card variant="elevated" padding="md" interactive>
  <h3>Заголовок карточки</h3>
  <p>Содержимое карточки...</p>
</Card>;
```

#### Props

| Имя           | Тип                                               | По умолчанию | Описание                                 |
| ------------- | ------------------------------------------------- | ------------ | ---------------------------------------- |
| `variant`     | `'elevated' \| 'outlined' \| 'filled' \| 'ghost'` | `'elevated'` | Стилевой вариант карточки                |
| `padding`     | `'none' \| 'sm' \| 'md' \| 'lg'`                  | `'md'`       | Внутренний отступ                        |
| `radius`      | `'none' \| 'sm' \| 'md' \| 'lg' \| 'full'`        | `'md'`       | Скругление углов                         |
| `interactive` | `boolean`                                         | `false`      | Добавляет эффекты при наведении и фокусе |
| `className`   | `string`                                          | -            | Дополнительные CSS-классы                |

### TextInput

```tsx
import { TextInput } from '@/shared/ui/inputs/TextInput';

<TextInput
  label="Email"
  type="email"
  placeholder="john@example.com"
  required
  error="Введите корректный email"
  helperText="Мы никогда не передадим ваш email третьим лицам"
  onChange={e => setEmail(e.target.value)}
/>;
```

#### Props

| Имя            | Тип                                                             | По умолчанию | Описание                          |
| -------------- | --------------------------------------------------------------- | ------------ | --------------------------------- |
| `label`        | `string`                                                        | -            | Текстовая метка поля              |
| `type`         | `'text' \| 'email' \| 'password' \| 'number' \| 'tel' \| 'url'` | `'text'`     | HTML-атрибут type                 |
| `placeholder`  | `string`                                                        | -            | Подсказка в пустом поле           |
| `required`     | `boolean`                                                       | `false`      | Делает поле обязательным          |
| `disabled`     | `boolean`                                                       | `false`      | Отключает поле ввода              |
| `readOnly`     | `boolean`                                                       | `false`      | Делает поле только для чтения     |
| `error`        | `string`                                                        | -            | Текст ошибки                      |
| `helperText`   | `string`                                                        | -            | Вспомогательный текст             |
| `value`        | `string`                                                        | -            | Значение поля                     |
| `defaultValue` | `string`                                                        | -            | Начальное значение поля           |
| `onChange`     | `(e: ChangeEvent<HTMLInputElement>) => void`                    | -            | Обработчик изменения              |
| `onBlur`       | `(e: FocusEvent<HTMLInputElement>) => void`                     | -            | Обработчик потери фокуса          |
| `onFocus`      | `(e: FocusEvent<HTMLInputElement>) => void`                     | -            | Обработчик получения фокуса       |
| `className`    | `string`                                                        | -            | Дополнительные CSS-классы         |
| `inputProps`   | `React.InputHTMLAttributes<HTMLInputElement>`                   | -            | Дополнительные атрибуты для input |

## Модули анонимизации

### AnonymizeForm

```tsx
import { AnonymizeForm } from '@/features/anonymize/ui/client/AnonymizeForm';

<AnonymizeForm
  onSubmit={async (text, options) => {
    const result = await anonymizeService.process(text, options);
    return result;
  }}
  initialOptions={{
    preserveNames: true,
    preserveDates: false,
  }}
/>;
```

#### Props

| Имя              | Тип                                                               | По умолчанию     | Описание                         |
| ---------------- | ----------------------------------------------------------------- | ---------------- | -------------------------------- |
| `onSubmit`       | `(text: string, options: UseAnonymizeOptions) => Promise<string>` | -                | Обработчик отправки формы        |
| `initialOptions` | `UseAnonymizeOptions`                                             | `defaultOptions` | Начальные настройки анонимизации |
| `maxLength`      | `number`                                                          | `10000`          | Максимальная длина текста        |
| `className`      | `string`                                                          | -                | Дополнительные CSS-классы        |

#### UseAnonymizeOptions

```tsx
interface UseAnonymizeOptions {
  preserveNames: boolean; // Сохранять имена собственные
  preserveDates: boolean; // Сохранять даты
  preserveAddresses: boolean; // Сохранять адреса
  preserveNumbers: boolean; // Сохранять числовые данные
  sensitivity: 'low' | 'medium' | 'high'; // Уровень строгости алгоритма
}
```

### ResultContainer

```tsx
import { ResultContainer } from '@/shared/ui/layout/card/ResultContainer';

<ResultContainer
  result="Анонимизированный текст..."
  onCopy={() => navigator.clipboard.writeText(result)}
  onDownload={() => downloadFile(result, 'anonymized.txt')}
/>;
```

#### Props

| Имя          | Тип          | По умолчанию | Описание                          |
| ------------ | ------------ | ------------ | --------------------------------- |
| `result`     | `string`     | -            | Результат обработки текста        |
| `onCopy`     | `() => void` | -            | Обработчик копирования результата |
| `onDownload` | `() => void` | -            | Обработчик скачивания результата  |
| `className`  | `string`     | -            | Дополнительные CSS-классы         |

## Темы и адаптивность

### ThemeToggle

```tsx
import { ThemeToggle } from '@/shared/ui/feedback/theme-toggle';

<ThemeToggle />;
```

#### Props

| Имя         | Тип                    | По умолчанию | Описание                  |
| ----------- | ---------------------- | ------------ | ------------------------- |
| `size`      | `'sm' \| 'md' \| 'lg'` | `'md'`       | Размер переключателя      |
| `className` | `string`               | -            | Дополнительные CSS-классы |

### ThemeProvider

```tsx
import { ThemeProvider } from '@/shared/ui/theme/providers';

<ThemeProvider defaultTheme="system">
  <App />
</ThemeProvider>;
```

#### Props

| Имя            | Тип                             | По умолчанию | Описание                                     |
| -------------- | ------------------------------- | ------------ | -------------------------------------------- |
| `defaultTheme` | `'light' \| 'dark' \| 'system'` | `'system'`   | Тема по умолчанию                            |
| `storageKey`   | `string`                        | `'theme'`    | Ключ для хранения выбора темы в localStorage |
| `children`     | `ReactNode`                     | -            | Дочерние компоненты                          |

## Компоненты доступности

### AccessibleFocus

```tsx
import { AccessibleFocus } from '@/shared/ui/utils/accessible-focus';

<AccessibleFocus>
  <button>Кнопка с улучшенным фокусом</button>
</AccessibleFocus>;
```

#### Props

| Имя         | Тип         | По умолчанию | Описание                                |
| ----------- | ----------- | ------------ | --------------------------------------- |
| `children`  | `ReactNode` | -            | Дочерний компонент для улучшения фокуса |
| `className` | `string`    | -            | Дополнительные CSS-классы               |

### SkipLink

```tsx
import { SkipLink } from '@/shared/ui/navigation/skip-link';

<SkipLink href="#main-content">Перейти к основному содержимому</SkipLink>;
```

#### Props

| Имя         | Тип         | По умолчанию      | Описание                  |
| ----------- | ----------- | ----------------- | ------------------------- |
| `href`      | `string`    | `'#main-content'` | ID элемента для перехода  |
| `children`  | `ReactNode` | -                 | Текст ссылки              |
| `className` | `string`    | -                 | Дополнительные CSS-классы |
