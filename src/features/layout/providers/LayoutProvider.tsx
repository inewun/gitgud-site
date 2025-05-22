'use client';

import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';

import { withMemo } from '@/shared/lib/utils/memo';

// Типы для настроек макета
type LayoutContextType = {
  sidebarExpanded: boolean;
  setSidebarExpanded: (expanded: boolean) => void;
  toggleSidebar: () => void;
  sidebarDocked: boolean;
  setSidebarDocked: (docked: boolean) => void;
  toggleSidebarDock: () => void;
  reduceMotion: boolean;
  setReduceMotion: (reduce: boolean) => void;
};

// Создаем контекст с дефолтными значениями
const LayoutContext = createContext<LayoutContextType>({
  sidebarExpanded: true,
  setSidebarExpanded: () => {},
  toggleSidebar: () => {},
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  sidebarDocked: false,
  setSidebarDocked: () => {},
  toggleSidebarDock: () => {},
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  reduceMotion: false,
  setReduceMotion: () => {},
});

export interface LayoutProviderProps {
  /**
   * Дочерние компоненты
   */
  children: React.ReactNode;
  /**
   * Начальное состояние развернутости боковой панели
   */
  initialSidebarExpanded?: boolean;
  /**
   * Начальное состояние фиксации боковой панели
   */
  initialSidebarDocked?: boolean;
  /**
   * Начальное состояние уменьшения движения (для доступности)
   */
  initialReduceMotion?: boolean;
}

/**
 * Провайдер для управления настройками макета приложения
 */
const LayoutProviderBase: React.FC<LayoutProviderProps> = ({
  children,
  initialSidebarExpanded = true,
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  initialSidebarDocked = false,
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  initialReduceMotion = false,
}) => {
  const [sidebarExpanded, setSidebarExpanded] = useState(initialSidebarExpanded);
  const [sidebarDocked, setSidebarDocked] = useState(initialSidebarDocked);
  const [reduceMotion, setReduceMotion] = useState(initialReduceMotion);

  const toggleSidebar = useCallback(() => {
    setSidebarExpanded(prev => !prev);
  }, []);

  const toggleSidebarDock = useCallback(() => {
    setSidebarDocked(prev => !prev);
  }, []);

  // Меморизируем значение контекста для предотвращения ненужных перерисовок
  const contextValue = useMemo(
    () => ({
      sidebarExpanded,
      setSidebarExpanded,
      toggleSidebar,
      sidebarDocked,
      setSidebarDocked,
      toggleSidebarDock,
      reduceMotion,
      setReduceMotion,
    }),
    [sidebarExpanded, toggleSidebar, sidebarDocked, toggleSidebarDock, reduceMotion],
  );

  return <LayoutContext.Provider value={contextValue}>{children}</LayoutContext.Provider>;
};

// Hook для использования контекста макета
export const useLayout = () => useContext(LayoutContext);

LayoutProviderBase.displayName = 'LayoutProvider';

export const LayoutProvider = withMemo(LayoutProviderBase);
