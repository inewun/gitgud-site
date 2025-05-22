/**
 * Критический CSS для быстрой первоначальной отрисовки
 * Включает только минимально необходимые стили для верхней части страницы (above the fold)
 */
const criticalCSS = `
/* Базовые переменные */
:root {
  --primary: 79 70 229;
  --background: 255 255 255;
  --foreground: 17 24 39;
  --muted: 107 114 128;
  --subtle: 249 250 251;
}

.dark {
  --background: 15 23 42;
  --foreground: 248 250 252;
  --muted: 156 163 175;
  --subtle: 30 41 59;
  --primary: 99 102 241;
}

/* Базовая типографика и цвета */
body {
  background-color: rgb(var(--background));
  color: rgb(var(--foreground));
  font-family: var(--font-inter, sans-serif);
  margin: 0;
  transition: background-color 0.3s ease, color 0.3s ease;
}

/* Стили для шапки */
.header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 4rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1.5rem;
  background-color: rgba(var(--background), 0.8);
  backdrop-filter: blur(8px);
  z-index: 50;
  border-bottom: 1px solid rgba(var(--muted), 0.1);
}

/* Стили для скрытия контента (sr-only) */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

.sr-only:focus {
  position: static;
  width: auto;
  height: auto;
  padding: 1rem;
  margin: 0;
  overflow: visible;
  clip: auto;
  white-space: normal;
}

/* Базовая сетка */
.min-h-screen {
  min-height: 100vh;
}

.flex-1 {
  flex: 1 1 0%;
}

.relative {
  position: relative;
}

.pt-20 {
  padding-top: 5rem;
}

.z-10 {
  z-index: 10;
}

/* Основные элементы загрузки */
@keyframes pulse {
  0%, 100% {
    opacity: 0.5;
  }
  50% {
    opacity: 0.8;
  }
}

.skeleton {
  background: rgba(var(--muted), 0.1);
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  border-radius: 0.375rem;
}
`;

export default criticalCSS;
