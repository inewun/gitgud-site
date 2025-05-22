import React from 'react';

import { render, screen } from '@testing-library/react';

import { TestComponent } from '../TestComponent';

describe('TestComponent', () => {
  it('должен отображать тестовый компонент', () => {
    render(<TestComponent />);
    expect(screen.getByText('Тестовый компонент')).toBeInTheDocument();
    expect(screen.getByText('Этот компонент используется для тестирования.')).toBeInTheDocument();
  });
});
