import { HomeIcon, ArrowRightIcon } from '@heroicons/react/24/outline';

import { Button } from '@/shared/ui/inputs/button/Button';

import type { Meta, StoryObj } from '@storybook/react';

/**
 * Компонент Button предоставляет стандартный набор кнопок различных стилей, размеров и состояний.
 * Используется для основных действий в интерфейсе приложения.
 */
const meta = {
  title: 'UI/Button',
  component: Button,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Универсальный компонент кнопки с различными вариантами стилей и состояний.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'secondary', 'outline', 'ghost', 'link', 'destructive'],
      description: 'Стиль кнопки',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'xl', 'icon'],
      description: 'Размер кнопки',
    },
    fullWidth: {
      control: 'boolean',
      description: 'Растягивать ли кнопку на всю ширину контейнера',
    },
    disabled: {
      control: 'boolean',
      description: 'Отключена ли кнопка',
    },
    isLoading: {
      control: 'boolean',
      description: 'Отображать ли состояние загрузки',
    },
    leftIcon: {
      control: { type: 'object' },
      description: 'Иконка слева от текста',
    },
    rightIcon: {
      control: { type: 'object' },
      description: 'Иконка справа от текста',
    },
    onClick: { action: 'clicked' },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Кнопка по умолчанию с основными настройками
 */
export const Default: Story = {
  args: {
    children: 'Кнопка',
  },
};

/**
 * Вторичная кнопка для менее важных действий
 */
export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: 'Вторичная',
  },
};

/**
 * Кнопка в стиле outline с прозрачным фоном и рамкой
 */
export const Outline: Story = {
  args: {
    variant: 'outline',
    children: 'Контурная',
  },
};

/**
 * Призрачная кнопка без фона и рамки
 */
export const Ghost: Story = {
  args: {
    variant: 'ghost',
    children: 'Призрачная',
  },
};

/**
 * Кнопка-ссылка для навигации
 */
export const Link: Story = {
  args: {
    variant: 'link',
    children: 'Ссылка',
  },
};

/**
 * Деструктивная кнопка для опасных действий
 */
export const Destructive: Story = {
  args: {
    variant: 'destructive',
    children: 'Удалить',
  },
};

/**
 * Кнопка с иконкой слева
 */
export const WithLeftIcon: Story = {
  args: {
    children: 'На главную',
    leftIcon: <HomeIcon className="h-4 w-4 mr-2" />,
  },
};

/**
 * Кнопка с иконкой справа
 */
export const WithRightIcon: Story = {
  args: {
    children: 'Далее',
    rightIcon: <ArrowRightIcon className="h-4 w-4" />,
  },
};

/**
 * Кнопка в состоянии загрузки
 */
export const Loading: Story = {
  args: {
    children: 'Загрузка...',
    isLoading: true,
  },
};

/**
 * Отключенная кнопка, с которой нельзя взаимодействовать
 */
export const Disabled: Story = {
  args: {
    children: 'Недоступно',
    disabled: true,
  },
};

/**
 * Кнопки разных размеров
 */
export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col items-start gap-4">
      <Button size="sm">Маленькая</Button>
      <Button size="md">Средняя</Button>
      <Button size="lg">Большая</Button>
      <Button size="xl">Очень большая</Button>
      <Button size="icon">
        <HomeIcon className="h-5 w-5" />
      </Button>
    </div>
  ),
};

/**
 * Кнопка на всю ширину контейнера
 */
export const FullWidth: Story = {
  args: {
    children: 'Кнопка на всю ширину',
    fullWidth: true,
  },
  parameters: {
    layout: 'padded',
  },
};
