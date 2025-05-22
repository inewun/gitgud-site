import { render } from '@testing-library/react';

import { ThemeToggle } from '@/shared/ui/feedback/theme-toggle';

describe('ThemeToggle', () => {
  it('рендерится без ошибок', () => {
    render(<ThemeToggle />);
  });
});
