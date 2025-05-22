import Image from 'next/image';

import { Button } from '@/shared/ui/inputs/button';
import { Card } from '@/shared/ui/layout/card';

import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'UI/Cards/Card',
  component: Card,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    padding: {
      control: 'select',
      options: ['default', 'none'],
    },
    interactive: { control: 'boolean' },
    glassmorphism: { control: 'boolean' },
    accent: { control: 'boolean' },
  },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: (
      <div className="p-6">
        <h3 className="text-lg font-semibold mb-2">Карточка</h3>
        <p className="text-muted-foreground">Основной вид карточки с базовыми стилями</p>
      </div>
    ),
  },
};

export const WithHeader: Story = {
  args: {
    children: (
      <>
        <div className="p-6 border-b border-subtle/50 dark:border-muted/10">
          <h3 className="text-lg font-semibold">Заголовок карточки</h3>
          <p className="text-sm text-muted-foreground mt-1">Дополнительное описание</p>
        </div>
        <div className="p-6">
          <p>Содержимое карточки находится здесь.</p>
        </div>
      </>
    ),
  },
};

export const WithFooter: Story = {
  args: {
    children: (
      <>
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-2">Карточка с футером</h3>
          <p className="text-muted-foreground">Карточка с содержимым и нижней панелью действий</p>
        </div>
        <div className="p-4 bg-subtle/30 dark:bg-muted/5 border-t border-subtle/50 dark:border-muted/10 flex justify-end gap-2">
          <Button variant="ghost" size="sm">
            Отмена
          </Button>
          <Button variant="default" size="sm">
            Сохранить
          </Button>
        </div>
      </>
    ),
  },
};

export const Interactive: Story = {
  args: {
    interactive: true,
    children: (
      <div className="p-6">
        <h3 className="text-lg font-semibold mb-2">Интерактивная карточка</h3>
        <p className="text-muted-foreground">Наведите курсор, чтобы увидеть эффект</p>
      </div>
    ),
  },
};

export const Glassmorphism: Story = {
  args: {
    glassmorphism: true,
    children: (
      <div className="p-6">
        <h3 className="text-lg font-semibold mb-2">Стекломорфизм</h3>
        <p className="text-muted-foreground">Эффект размытия фона</p>
      </div>
    ),
  },
  parameters: {
    backgrounds: { default: 'gradient' },
  },
};

export const Accent: Story = {
  args: {
    accent: true,
    children: (
      <div className="p-6">
        <h3 className="text-lg font-semibold mb-2">Акцентная карточка</h3>
        <p className="text-muted-foreground">С выделенной рамкой</p>
      </div>
    ),
  },
};

export const WithoutPadding: Story = {
  args: {
    padding: 'none',
    children: (
      <Image
        src="https://images.unsplash.com/photo-1667653293085-20e1eefe4060?q=80&w=400"
        alt="Природа"
        className="rounded-lg w-full h-auto"
        width={400}
        height={300}
      />
    ),
  },
};

export const CombinedVariants: Story = {
  args: {
    interactive: true,
    accent: true,
    children: (
      <div className="p-6">
        <h3 className="text-lg font-semibold mb-2">Комбинированные варианты</h3>
        <p className="text-muted-foreground">Интерактивная акцентная карточка</p>
      </div>
    ),
  },
};
