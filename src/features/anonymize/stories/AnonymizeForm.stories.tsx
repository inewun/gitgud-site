import React from 'react';

import { Meta, StoryObj } from '@storybook/react';

import { AnonymizeForm } from '@/features/anonymize/ui/client/AnonymizeForm';

const meta: Meta<typeof AnonymizeForm> = {
  title: 'Features/Anonymize/AnonymizeForm',
  component: AnonymizeForm,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
## Компонент формы анонимизации

Компонент \`AnonymizeForm\` предоставляет пользовательский интерфейс для анонимизации текста. 
Он позволяет пользователям вводить текст, выбирать опции для анонимизации и получать результат.

### Возможности:
- Ввод текста для анонимизации
- Выбор опций анонимизации (имена, email, телефоны и т.д.)
- Отображение результата анонимизации
- Копирование результата в буфер обмена
- Скачивание результата в виде файла

### Использование:

\`\`\`tsx
import { AnonymizeForm } from '@/features/anonymize/ui/client/AnonymizeForm';

function MyComponent() {
  return <AnonymizeForm />;
}
\`\`\`

### Архитектурные особенности:
- Компонент разделяет UI и бизнес-логику (логика вынесена в модель)
- Использует React Hook Form для управления формой
- Соблюдает принципы доступности (a11y)
        `,
      },
    },
  },
  argTypes: {
    className: {
      description: 'Дополнительные CSS классы',
      control: 'text',
    },
  },
};

export default meta;
type Story = StoryObj<typeof AnonymizeForm>;

export const Default: Story = {
  args: {
    className: '',
    locale: 'ru',
  },
  render: args => <AnonymizeForm {...args} />,
};

export const WithCustomClass: Story = {
  args: {
    className: 'custom-form-class',
  },
  parameters: {
    docs: {
      description: {
        story: 'Пример использования компонента с дополнительным CSS классом.',
      },
    },
  },
  render: args => <AnonymizeForm {...args} />,
};
