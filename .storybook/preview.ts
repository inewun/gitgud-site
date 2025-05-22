import type { Preview } from '@/storybook/react';
import '../src/styles/globals.css';

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    docs: {
      toc: true,
    },
    backgrounds: {
      default: 'light',
      values: [
        {
          name: 'light',
          value: '#F3F4F6',
        },
        {
          name: 'dark',
          value: '#1F2937',
        },
      ],
    },
    themes: {
      default: 'light',
      list: [
        { name: 'light', class: '', color: '#F3F4F6' },
        { name: 'dark', class: '[data-theme=dark]', color: '#1F2937' },
      ],
    },
  },
};

export default preview;
