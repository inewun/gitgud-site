# Оптимизация производительности

## Разделение кода и ленивая загрузка

Для оптимизации метрик Core Web Vitals и улучшения производительности приложения применяйте следующие техники:

### 1. Lazy-loading для компонентов

```tsx
// Вместо прямого импорта
// import { HeavyComponent } from '@/components/HeavyComponent';

// Используйте динамический импорт
import dynamic from 'next/dynamic';

const HeavyComponent = dynamic(() => import('@/components/HeavyComponent'), {
  loading: () => <div>Loading...</div>,
  ssr: false, // Отключите SSR для клиентских компонентов, если нужно
});
```

### 2. Разделение кода по маршрутам

Next.js автоматически разделяет код по маршрутам, но вы можете дополнительно оптимизировать компоненты, которые не нужны для первоначального рендеринга:

```tsx
// app/dashboard/page.tsx
import { Suspense } from 'react';
import dynamic from 'next/dynamic';
import { DashboardSkeleton } from '@/widgets/dashboard/skeleton';

// Ленивая загрузка тяжелых компонентов дашборда
const DashboardAnalytics = dynamic(() => import('@/widgets/dashboard/analytics'), {
  loading: () => <DashboardSkeleton type="analytics" />,
});

const DashboardCharts = dynamic(() => import('@/widgets/dashboard/charts'), {
  loading: () => <DashboardSkeleton type="charts" />,
});

export default function DashboardPage() {
  return (
    <div>
      <h1>Дашборд</h1>

      {/* Используйте Suspense для оптимизации потока рендеринга */}
      <Suspense fallback={<DashboardSkeleton type="analytics" />}>
        <DashboardAnalytics />
      </Suspense>

      <Suspense fallback={<DashboardSkeleton type="charts" />}>
        <DashboardCharts />
      </Suspense>
    </div>
  );
}
```

### 3. Оптимизация изображений

Всегда используйте компонент `Image` от Next.js для автоматической оптимизации:

```tsx
import Image from 'next/image';

export function OptimizedImage() {
  return (
    <Image
      src="/images/hero.jpg"
      alt="Описание изображения"
      width={800}
      height={600}
      placeholder="blur" // Показывать размытую версию во время загрузки
      blurDataURL="data:image/jpeg;base64,..." // Base64 версия превью
      loading="lazy" // Загружать только когда оно появится в видимой области
      sizes="(max-width: 768px) 100vw, 800px" // Респонсивные размеры
    />
  );
}
```

### 4. Мемоизация компонентов и хуков

Оптимизируйте перерендеры компонентов с помощью `React.memo` и кастомного HOC:

```tsx
// src/shared/lib/utils/memo.ts
import { memo, type ComponentType } from 'react';

export function withMemo<T extends object>(
  Component: ComponentType<T>,
  propsAreEqual?: (prevProps: Readonly<T>, nextProps: Readonly<T>) => boolean,
) {
  return memo(Component, propsAreEqual);
}

// Использование:
// src/shared/ui/button/Button.tsx
import { withMemo } from '@/shared/lib/utils/memo';

function Button({ children, ...props }) {
  return <button {...props}>{children}</button>;
}

export default withMemo(Button);
```

### 5. Оптимизация списков с виртуализацией

Для длинных списков используйте виртуализацию, которая рендерит только видимые элементы:

```tsx
import { useVirtualizer } from '@tanstack/react-virtual';

export function VirtualizedList({ items }) {
  const parentRef = useRef(null);

  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 50, // Примерная высота каждого элемента
  });

  return (
    <div ref={parentRef} style={{ height: '400px', overflow: 'auto' }}>
      <div
        style={{
          height: `${virtualizer.getTotalSize()}px`,
          position: 'relative',
        }}
      >
        {virtualizer.getVirtualItems().map(virtualItem => (
          <div
            key={virtualItem.key}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: `${virtualItem.size}px`,
              transform: `translateY(${virtualItem.start}px)`,
            }}
          >
            {items[virtualItem.index].content}
          </div>
        ))}
      </div>
    </div>
  );
}
```

### 6. Откладывание ненужной работы

Используйте хуки для отложенных вычислений:

```tsx
import { useDeferredValue, useTransition } from 'react';

export function SearchInput() {
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query); // Отложенное значение
  const [isPending, startTransition] = useTransition(); // Переход с низким приоритетом

  const handleChange = e => {
    setQuery(e.target.value);

    // Обновление результатов поиска с низким приоритетом
    startTransition(() => {
      searchResults(e.target.value);
    });
  };

  return (
    <div>
      <input value={query} onChange={handleChange} />
      {isPending && <span>Загрузка...</span>}
      <SearchResults query={deferredQuery} />
    </div>
  );
}
```

### 7. Предварительная загрузка критических данных

```tsx
// app/product/[id]/page.tsx
import { Suspense } from 'react';
import { getProduct, getRelatedProducts } from '@/services/products';

// Генерация статических параметров для популярных продуктов
export async function generateStaticParams() {
  const popularProductIds = await getPopularProductIds();
  return popularProductIds.map(id => ({ id }));
}

export default async function ProductPage({ params }) {
  // Параллельный запрос данных
  const productPromise = getProduct(params.id);
  const relatedPromise = getRelatedProducts(params.id);

  // Дожидаемся только основных данных для быстрого рендера
  const product = await productPromise;

  return (
    <div>
      <ProductDetails product={product} />

      <Suspense fallback={<RelatedProductsSkeleton />}>
        <RelatedProductsSection promise={relatedPromise} />
      </Suspense>
    </div>
  );
}
```

## Рекомендации по применению

- Используйте инструменты анализа производительности: Lighthouse, Core Web Vitals, React DevTools Profiler
- Добавьте мониторинг производительности в CI/CD с помощью GitHub Actions
- Регулярно выполняйте профилирование в dev и prod окружениях
- Минимизируйте зависимости и отдавайте предпочтение меньшим библиотекам
- Используйте Server Components и SSR где возможно для улучшения метрик FCP и LCP
