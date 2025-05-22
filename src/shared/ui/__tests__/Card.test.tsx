import React from 'react';

import { render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';

import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  CardTitle,
  CardDescription,
} from '../layout/card';

expect.extend(toHaveNoViolations);

describe('Card', () => {
  it('рендерится с заголовком и содержимым', () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Тестовый заголовок</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Тестовое содержимое</p>
        </CardContent>
      </Card>,
    );

    expect(screen.getByText('Тестовый заголовок')).toBeInTheDocument();
    expect(screen.getByText('Тестовое содержимое')).toBeInTheDocument();
  });

  it('рендерится с footer', () => {
    render(
      <Card>
        <CardHeader>Заголовок</CardHeader>
        <CardContent>Содержимое</CardContent>
        <CardFooter>Футер</CardFooter>
      </Card>,
    );

    expect(screen.getByText('Футер')).toBeInTheDocument();
  });

  it('принимает дополнительные классы', () => {
    render(
      <Card className="test-class">
        <CardContent>Содержимое</CardContent>
      </Card>,
    );

    const card = screen.getByText('Содержимое').closest('.test-class');
    expect(card).toBeInTheDocument();
  });

  it('поддерживает различные варианты внешнего вида', () => {
    render(
      <Card interactive>
        <CardContent>Содержимое</CardContent>
      </Card>,
    );

    const card = screen.getByText('Содержимое').closest('.cursor-pointer');
    expect(card).not.toBeNull();
    expect(card).toHaveClass('hover:text-accent-foreground');
  });

  it('соответствует требованиям доступности WCAG', async () => {
    const { container } = render(
      <Card>
        <CardHeader>
          <CardTitle id="card-title">Доступный заголовок</CardTitle>
          <CardDescription>Описание карточки</CardDescription>
        </CardHeader>
        <CardContent aria-labelledby="card-title">
          <p>Текст карточки с правильной семантической структурой</p>
        </CardContent>
        <CardFooter>
          <button aria-label="Действие">Нажмите</button>
        </CardFooter>
      </Card>,
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
