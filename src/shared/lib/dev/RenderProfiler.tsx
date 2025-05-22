import React, { Profiler, ProfilerOnRenderCallback, useState, useEffect } from 'react';

interface RenderProfilerProps {
  id: string;
  children: React.ReactNode;
  enabled?: boolean;
  loggingEnabled?: boolean;
}

// Хранилище для статистики рендеров
type RenderStats = {
  renders: number;
  totalRenderTime: number;
  lastRenderTime: number;
  averageRenderTime: number;
};

const statsStorage: Record<string, RenderStats> = {};

/**
 * Компонент для профилирования и отслеживания ререндеров
 * Используется в режиме разработки для отладки производительности
 *
 * @param id - Уникальный идентификатор профилируемого компонента
 * @param children - Профилируемый контент
 * @param enabled - Флаг, включающий профилирование (по умолчанию активен только в development)
 * @param loggingEnabled - Флаг, включающий вывод логов в консоль
 */
export function RenderProfiler({
  id,
  children,
  enabled = process.env.NODE_ENV === 'development',
  loggingEnabled = false,
}: RenderProfilerProps) {
  // Не профилируем в production если явно не включено
  if (!enabled) {
    return <>{children}</>;
  }

  const onRender: ProfilerOnRenderCallback = (
    profilerId,
    phase,
    actualDuration,
    baseDuration,
    _startTime,
    _commitTime,
  ) => {
    // Инициализируем статистику для компонента, если её еще нет
    if (!(profilerId in statsStorage)) {
      statsStorage[profilerId] = {
        renders: 0,
        totalRenderTime: 0,
        lastRenderTime: 0,
        averageRenderTime: 0,
      };
    }

    // Обновляем статистику
    const stats = statsStorage[profilerId];
    stats.renders += 1;
    stats.totalRenderTime += actualDuration;
    stats.lastRenderTime = actualDuration;
    stats.averageRenderTime = stats.totalRenderTime / stats.renders;

    // Логируем, если включено
    if (loggingEnabled) {
      // eslint-disable-next-line no-console
      console.group(`%c🔍 Render Profiler: ${profilerId}`, 'color: #00b3e6; font-weight: bold;');
      // eslint-disable-next-line no-console
      console.log(`Phase: ${phase}`);
      // eslint-disable-next-line no-console
      console.log(`Render #${stats.renders}`);
      // eslint-disable-next-line no-console
      console.log(`Actual time: ${actualDuration.toFixed(2)}ms`);
      // eslint-disable-next-line no-console
      console.log(`Base time: ${baseDuration.toFixed(2)}ms`);
      // eslint-disable-next-line no-console
      console.log(`Average time: ${stats.averageRenderTime.toFixed(2)}ms`);

      // Предупреждаем о частых ререндерах
      if (stats.renders > 5 && stats.renders % 5 === 0) {
        // eslint-disable-next-line no-console
        console.warn(`⚠️ Component ${profilerId} has rendered ${stats.renders} times!`);
      }

      // Предупреждаем о длительных рендерах
      if (actualDuration > 16) {
        // 16ms = ~60fps
        // eslint-disable-next-line no-console
        console.warn(`⚠️ Slow render detected in ${profilerId}: ${actualDuration.toFixed(2)}ms`);
      }

      // eslint-disable-next-line no-console
      console.groupEnd();
    }
  };

  return (
    <Profiler id={id} onRender={onRender}>
      {children}
    </Profiler>
  );
}

/**
 * Утилита для получения статистики рендеров компонента
 * @param id - Идентификатор компонента
 * @returns Статистика рендеров или undefined, если компонент не профилировался
 */
export function getRenderStats(id: string): RenderStats | undefined {
  return statsStorage[id];
}

/**
 * Очистка статистики рендеров
 * @param id - Идентификатор компонента (если не указан, очищается вся статистика)
 */
export function clearRenderStats(id?: string): void {
  if (id) {
    if (Object.prototype.hasOwnProperty.call(statsStorage, id)) {
      // Безопасно удаляем определенный компонент из статистики
      // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
      delete statsStorage[id];
    }
  } else {
    // Очищаем всю статистику
    Object.keys(statsStorage).forEach(key => {
      // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
      delete statsStorage[key];
    });
  }
}

/**
 * HOC для профилирования компонента
 * @param Component - Компонент для профилирования
 * @param id - Идентификатор профиля (по умолчанию - displayName компонента)
 * @param options - Дополнительные опции профилирования
 */
export function withProfiler<P extends object>(
  Component: React.ComponentType<P>,
  id?: string,
  options?: { enabled?: boolean; loggingEnabled?: boolean },
): React.FC<P> {
  const displayName = Component.displayName || Component.name || 'Component';
  const profilerId = id || `${displayName}Profiler`;

  const ProfiledComponent: React.FC<P> = props => {
    return (
      <RenderProfiler
        id={profilerId}
        enabled={options?.enabled}
        loggingEnabled={options?.loggingEnabled}
      >
        <Component {...props} />
      </RenderProfiler>
    );
  };

  ProfiledComponent.displayName = `WithProfiler(${displayName})`;

  return ProfiledComponent;
}

/**
 * Компонент для профилирования всего дерева компонентов
 */
export function DevProfilerPanel() {
  const [isVisible, setIsVisible] = useState(false);
  const [stats, setStats] = useState<Record<string, RenderStats>>({});

  // Обновляем статистику каждую секунду, если панель открыта
  useEffect(() => {
    if (!isVisible) return;

    const interval = setInterval(() => {
      setStats({ ...statsStorage });
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [isVisible]);

  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  const handleClearStats = () => {
    clearRenderStats();
    setStats({});
  };

  return (
    <>
      <button
        onClick={toggleVisibility}
        style={{
          position: 'fixed',
          bottom: '10px',
          left: '10px',
          zIndex: 9999,
          background: '#333',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          padding: '8px 12px',
          cursor: 'pointer',
        }}
      >
        {isVisible ? 'Hide Profiler' : 'Show Profiler'}
      </button>

      {isVisible && (
        <div
          style={{
            position: 'fixed',
            left: '10px',
            bottom: '50px',
            width: '300px',
            maxHeight: '400px',
            overflowY: 'auto',
            background: '#333',
            color: 'white',
            zIndex: 9999,
            padding: '16px',
            borderRadius: '4px',
            boxShadow: '0 0 10px rgba(0,0,0,0.5)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <h3 style={{ margin: 0, fontSize: '16px' }}>Render Statistics</h3>
            <button
              onClick={handleClearStats}
              style={{
                background: '#555',
                border: 'none',
                color: 'white',
                padding: '4px 8px',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              Clear
            </button>
          </div>

          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ textAlign: 'left', borderBottom: '1px solid #555' }}>
                <th style={{ padding: '4px' }}>Component</th>
                <th style={{ padding: '4px' }}>Renders</th>
                <th style={{ padding: '4px' }}>Avg Time</th>
                <th style={{ padding: '4px' }}>Last Time</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(stats).map(([id, stat]) => (
                <tr key={id} style={{ borderBottom: '1px solid #444' }}>
                  <td style={{ padding: '4px' }}>{id}</td>
                  <td style={{ padding: '4px' }}>{stat.renders}</td>
                  <td style={{ padding: '4px' }}>{stat.averageRenderTime.toFixed(1)}ms</td>
                  <td style={{ padding: '4px' }}>{stat.lastRenderTime.toFixed(1)}ms</td>
                </tr>
              ))}
              {Object.keys(stats).length === 0 && (
                <tr>
                  <td colSpan={4} style={{ textAlign: 'center', padding: '8px' }}>
                    No render data available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
