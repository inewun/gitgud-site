import { TextareaField } from '@/shared/ui/inputs';

import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'UI/Inputs/TextareaField',
  component: TextareaField,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    onChange: { action: 'changed' },
    disabled: { control: 'boolean' },
  },
} satisfies Meta<typeof TextareaField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: 'Комментарий',
    placeholder: 'Введите ваш комментарий...',
  },
};

export const WithValue: Story = {
  args: {
    label: 'Комментарий',
    value: 'Пример текста в текстовой области',
    onChange: () => {},
  },
};

export const WithError: Story = {
  args: {
    label: 'Комментарий',
    placeholder: 'Введите ваш комментарий...',
    error: 'Поле не может быть пустым',
  },
};

export const Disabled: Story = {
  args: {
    label: 'Комментарий',
    placeholder: 'Введите ваш комментарий...',
    disabled: true,
  },
};

export const WithRows: Story = {
  args: {
    label: 'Большой комментарий',
    placeholder: 'Введите ваш подробный комментарий...',
    rows: 8,
  },
};
