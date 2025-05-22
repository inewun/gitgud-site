'use client';

import React, { createContext, useContext, ReactNode, useMemo } from 'react';

// Типы гидратации компонентов
export enum HydrationState {
  Full = 'full', // Полная гидратация (клиентский рендеринг)
  Partial = 'partial', // Частичная гидратация (для оптимизации интерактивности)
  None = 'none', // Без гидратации (статический HTML)
}

// Контекст для управления гидратацией компонентов
type HydrationContextType = {
  /**
   * Текущее состояние гидратации
   */
  state: HydrationState;
  /**
   * Установить состояние гидратации для дочерних компонентов
   */
  setHydrationState: (state: HydrationState) => void;
};

// Создаем контекст с начальным значением (полная гидратация по умолчанию)
const HydrationContext = createContext<HydrationContextType>({
  state: HydrationState.Full,
  setHydrationState: () => {
    // Функция-заглушка для начального значения контекста
  },
});

// Интерфейс для провайдера гидратации
interface HydrationProviderProps {
  /**
   * Дочерние компоненты
   */
  children: ReactNode;
  /**
   * Начальное состояние гидратации
   * @default HydrationState.Full
   */
  initialState?: HydrationState;
}

/**
 * Провайдер для управления стратегией гидратации компонентов
 * Позволяет оптимизировать интерактивность UI с помощью частичной гидратации
 */
export function HydrationProvider({
  children,
  initialState = HydrationState.Full,
}: HydrationProviderProps) {
  // Создаем значение контекста с функцией для изменения состояния
  const value = useMemo(
    () => ({
      state: initialState,
      setHydrationState: (_state: HydrationState) => {
        // В реальном приложении тут можно использовать useState для изменения состояния
      },
    }),
    [initialState],
  );

  return <HydrationContext.Provider value={value}>{children}</HydrationContext.Provider>;
}

/**
 * Хук для доступа к контексту гидратации
 * @returns Состояние гидратации и функция для его изменения
 */
export function useHydration() {
  return useContext(HydrationContext);
}

// Интерфейс для компонента с условной гидратацией
interface ConditionalHydrationProps {
  /**
   * Дочерние компоненты
   */
  children: ReactNode;
  /**
   * Требуемое состояние гидратации для рендеринга
   */
  hydrationState: HydrationState;
}

/**
 * Компонент для условного рендеринга содержимого в зависимости от состояния гидратации
 * Позволяет создавать компоненты, которые рендерятся только при определенном состоянии гидратации
 */
export function ConditionalHydration({ children, hydrationState }: ConditionalHydrationProps) {
  const { state } = useHydration();

  // Рендерим содержимое только если текущее состояние гидратации соответствует требуемому
  // или если требуется частичная гидратация, а текущее состояние - полная гидратация
  const shouldRender =
    state === hydrationState ||
    (hydrationState === HydrationState.Partial && state === HydrationState.Full);

  return shouldRender ? <>{children}</> : null;
}

/**
 * Высокоуровневый компонент для создания компонентов с частичной гидратацией
 * @param Component - Компонент для оборачивания
 * @param hydrationState - Требуемое состояние гидратации
 */
export function withHydration<P extends object>(
  Component: React.ComponentType<P>,
  hydrationState: HydrationState = HydrationState.Partial,
) {
  const WithHydration = (props: P) => (
    <ConditionalHydration hydrationState={hydrationState}>
      <Component {...props} />
    </ConditionalHydration>
  );

  const displayName = Component.displayName || Component.name || 'Component';
  WithHydration.displayName = `withHydration(${displayName})`;

  return WithHydration;
}
