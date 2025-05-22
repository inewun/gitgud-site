import { Checkbox } from '@/shared/ui/inputs/checkbox';

import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'UI/Inputs/Checkbox',
  component: Checkbox,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    checked: { control: 'boolean' },
    disabled: { control: 'boolean' },
    onChange: { action: 'changed' },
  },
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: 'Согласен с условиями',
  },
};

export const WithDescription: Story = {
  args: {
    label: 'Подписаться на рассылку',
    description: 'Получайте новости и обновления о нашем продукте',
  },
};

export const Checked: Story = {
  args: {
    label: 'Выбранный чекбокс',
    checked: true,
  },
};

export const Disabled: Story = {
  args: {
    label: 'Недоступный чекбокс',
    disabled: true,
  },
};

export const DisabledChecked: Story = {
  args: {
    label: 'Недоступный выбранный чекбокс',
    disabled: true,
    checked: true,
  },
};

export const WithError: Story = {
  args: {
    label: 'Чекбокс с ошибкой',
    error: 'Это поле обязательно для заполнения',
  },
};

export const Group: Story = {
  args: {
    label: 'Группа опций',
  },
  render: () => (
    <div className="space-y-2">
      <Checkbox label="Опция 1" checked={true} onChange={() => {}} />
      {/* eslint-disable-next-line @typescript-eslint/no-unnecessary-condition */}
      <Checkbox label="Опция 2" checked={false} onChange={() => {}} />
      {/* eslint-disable-next-line @typescript-eslint/no-unnecessary-condition */}
      <Checkbox label="Опция 3" checked={false} onChange={() => {}} />
    </div>
  ),
};
