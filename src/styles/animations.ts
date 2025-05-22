import { Variants } from 'framer-motion';

interface AnimationTransition {
  delay?: number;
  duration?: number;
  [key: string]: unknown;
}

// Базовые анимационные варианты для элементов
export const fadeInVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.5 },
  },
};

export const fadeInUpVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

export const fadeInScaleVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.6 },
  },
};

export const staggerChildrenVariants = {
  // eslint-disable-next-line @typescript-eslint/ban-types
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export const featureItemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 15,
    },
  },
};

// Функция для добавления задержки к анимации
export const withDelay = (variants: Variants, delay: number): Variants => {
  // Создаем базовые варианты
  const result: Variants = { ...variants };

  // Клонируем свойство visible, если оно существует
  if ('visible' in variants) {
    const visibleVariant =
      typeof variants.visible === 'function' ? variants.visible : { ...variants.visible };

    // Добавляем задержку только если visible не является функцией
    if (typeof visibleVariant !== 'function') {
      // Создаем или обновляем transition
      const existingTransition = visibleVariant.transition as AnimationTransition | undefined;
      visibleVariant.transition = {
        ...(existingTransition ?? {}),
        delay,
      };

      // Обновляем visible в результате
      result.visible = visibleVariant;
    }
  }

  return result;
};

// Готовые комбинации для частых случаев
export const heroElementsVariants = {
  badge: withDelay(fadeInUpVariants, 0.1),
  title: withDelay(fadeInUpVariants, 0.2),
  description: withDelay(fadeInUpVariants, 0.3),
  buttons: withDelay(fadeInUpVariants, 0.4),
  image: withDelay(fadeInScaleVariants, 0.3),
};

export const callToActionVariants = {
  container: fadeInUpVariants,
  title: withDelay(fadeInUpVariants, 0.1),
  text: withDelay(fadeInUpVariants, 0.2),
  button: withDelay(fadeInUpVariants, 0.3),
  footer: withDelay(fadeInVariants, 0.4),
};
