import { Button } from '@/shared/ui/inputs/button';

import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof Button> = {
  title: 'UI/Button',
  component: Button,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Универсальный компонент кнопки с разными вариантами внешнего вида и размеров.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      description: 'Вариант отображения кнопки',
      control: 'select',
      options: ['default', 'secondary', 'outline', 'ghost'],
    },
    size: {
      description: 'Размер кнопки',
      control: 'select',
      options: ['sm', 'md', 'lg', 'xl', 'icon'],
    },
    fullWidth: {
      description: 'Растянуть кнопку по ширине контейнера',
      control: 'boolean',
    },
    isLoading: {
      description: 'Индикатор загрузки',
      control: 'boolean',
    },
    disabled: {
      description: 'Отключает кнопку',
      control: 'boolean',
    },
    leftIcon: {
      description: 'Иконка слева от текста',
      control: { disable: true },
    },
    rightIcon: {
      description: 'Иконка справа от текста',
      control: { disable: true },
    },
    className: {
      description: 'Дополнительные классы для кнопки',
      control: 'text',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

// Базовые варианты кнопок
export const Default: Story = {
  args: {
    children: 'Кнопка',
    variant: 'default',
  },
};

export const Secondary: Story = {
  args: {
    children: 'Вторичная',
    variant: 'secondary',
  },
};

export const Outline: Story = {
  args: {
    children: 'Контурная',
    variant: 'outline',
  },
};

export const Ghost: Story = {
  args: {
    children: 'Призрачная',
    variant: 'ghost',
  },
};

// Разные размеры кнопок
export const Small: Story = {
  args: {
    children: 'Маленькая',
    size: 'sm',
  },
};

export const Medium: Story = {
  args: {
    children: 'Средняя',
    size: 'md',
  },
};

export const Large: Story = {
  args: {
    children: 'Большая',
    size: 'lg',
  },
};

// Состояния кнопок
export const FullWidth: Story = {
  args: {
    children: 'На всю ширину',
    fullWidth: true,
  },
};

export const Loading: Story = {
  args: {
    children: 'Загрузка',
    isLoading: true,
  },
};

export const Disabled: Story = {
  args: {
    children: 'Отключена',
    disabled: true,
  },
};

// Кнопки с иконками
export const WithLeftIcon: Story = {
  args: {
    children: 'С иконкой слева',
    leftIcon: (
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M9 18L15 12L9 6"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
};

export const WithRightIcon: Story = {
  args: {
    children: 'С иконкой справа',
    rightIcon: (
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M9 18L15 12L9 6"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
};

// Доступность
export const AccessibleButton: Story = {
  args: {
    children: 'Доступная кнопка',
    'aria-label': 'Описание действия кнопки',
    'aria-describedby': 'extended-description',
  },
  parameters: {
    docs: {
      description: {
        story: 'Пример кнопки с расширенной семантикой для скринридеров',
      },
    },
  },
};
