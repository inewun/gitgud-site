'use client';

import React, { forwardRef, cloneElement } from 'react';

import { motion, AnimatePresence } from 'framer-motion';

import { useReducedMotion } from '@/shared/hooks/useReducedMotion';
import { cn } from '@/shared/lib/utils';
import { withMemo } from '@/shared/lib/utils/memo';
import { animations } from '@/styles/compositions';

import type {
  MotionProps as FramerMotionProps,
  Variants,
  Transition,
  MotionProps,
} from 'framer-motion';

type PresetAnimation = keyof typeof animations;

// Определяем более точные типы для пропсов анимации
type MotionInitialDefinition = MotionProps['initial'];
type MotionAnimateDefinition = MotionProps['animate'];
type MotionExitDefinition = MotionProps['exit'];

export interface MotionComponentProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, keyof FramerMotionProps>,
    Omit<FramerMotionProps, 'className'> {
  /**
   * Предустановленная анимация из styles/compositions
   */
  preset?: PresetAnimation;
  /**
   * Задержка анимации в секундах
   */
  delay?: number;
  /**
   * Длительность анимации в секундах
   */
  duration?: number;
  /**
   * Ключ для AnimatePresence
   */
  presenceKey?: string | number;
  /**
   * Показывать ли элемент
   */
  show?: boolean;
  /**
   * Добавить тег viewport для анимации при появлении в поле зрения
   */
  whenVisible?: boolean;
  /**
   * HTML тег контейнера
   */
  as?: React.ElementType;
  /**
   * Дочерние элементы
   */
  children: React.ReactNode;
  /**
   * Дополнительные классы
   */
  className?: string;
  /**
   * Используем новые типы в пропсах компонента, если они передаются напрямую
   */
  initial?: MotionInitialDefinition;
  animate?: MotionAnimateDefinition;
  exit?: MotionExitDefinition;
  transition?: Transition;
}

type AnimationSetupProps = Omit<MotionComponentProps, 'children' | 'as' | 'className'>;

// Функция для обработки reduced motion
function getReducedMotionProps(): {
  motionInitial: MotionInitialDefinition;
  motionAnimate: MotionAnimateDefinition;
  motionExit: MotionExitDefinition;
  motionTransition: Transition;
  processedVariants: undefined;
} {
  return {
    motionInitial: { opacity: 0 },
    motionAnimate: { opacity: 1 },
    motionExit: { opacity: 0 },
    motionTransition: { duration: 0.1 },
    processedVariants: undefined,
  };
}

// Функция для обработки вариантов анимации
function getVariantsProps(
  inputVariants: Variants | undefined,
  initial: MotionInitialDefinition,
  animate: MotionAnimateDefinition,
  exit: MotionExitDefinition,
): {
  motionInitial: MotionInitialDefinition;
  motionAnimate: MotionAnimateDefinition;
  motionExit: MotionExitDefinition;
} {
  if (inputVariants) {
    return {
      motionInitial: initial || 'initial',
      motionAnimate: animate || 'animate',
      motionExit: exit || 'exit',
    };
  }
  return { motionInitial: initial, motionAnimate: animate, motionExit: exit };
}

// Функция для обработки стандартной анимации
function getDefaultAnimationProps(
  animate: MotionAnimateDefinition,
  initial: MotionInitialDefinition,
): {
  motionInitial: MotionInitialDefinition;
  motionAnimate: MotionAnimateDefinition;
  motionExit: MotionExitDefinition;
} {
  if (!animate && !initial) {
    return {
      motionInitial: { opacity: 0 },
      motionAnimate: { opacity: 1 },
      motionExit: { opacity: 0 },
    };
  }
  return { motionInitial: initial, motionAnimate: animate, motionExit: { opacity: 0 } };
}

// Функция для настройки временных параметров анимации
function getTimingProps(
  delay: number | undefined,
  duration: number | undefined,
  baseTransition: Transition,
): Transition {
  if (delay === undefined && duration === undefined) {
    return baseTransition;
  }

  return {
    ...baseTransition,
    ...(delay !== undefined && { delay }),
    ...(duration !== undefined && { duration }),
  };
}

// Тип для viewport свойств
type ViewportProps = {
  viewport?: { once: boolean; amount: number };
  // Используем более общий тип для whileInView, достаточный для нашего случая
  whileInView?: string | { opacity: number };
};

// Тип для итоговых свойств анимации
type FinalAnimationProps = { animate?: MotionAnimateDefinition };

// Функция для настройки анимации при появлении в viewport
function getViewportProps(
  whenVisible: boolean | undefined,
  prefersReducedMotion: boolean,
  processedVariants: Variants | undefined,
  motionAnimate: MotionAnimateDefinition,
): {
  viewportProps: ViewportProps;
  finalAnimationProps: FinalAnimationProps;
} {
  const isWhenVisible = !!whenVisible;
  const viewportProps: ViewportProps =
    isWhenVisible && !prefersReducedMotion
      ? {
          viewport: { once: true, amount: 0.3 },
          // Для whileInView используем только строку или простой объект с opacity
          whileInView: processedVariants ? 'animate' : { opacity: 1 },
        }
      : {};

  const finalAnimationProps: FinalAnimationProps =
    isWhenVisible && !prefersReducedMotion
      ? { ...viewportProps, animate: undefined }
      : { animate: motionAnimate };

  return { viewportProps, finalAnimationProps };
}

// Разделяем логику настройки анимации и рендеринга компонента
function useAnimationProps({
  preset,
  delay,
  duration,
  whenVisible,
  variants: inputVariants,
  initial,
  animate,
  exit,
  transition,
}: Omit<AnimationSetupProps, 'show' | 'presenceKey'> & {
  initial?: MotionInitialDefinition;
  animate?: MotionAnimateDefinition;
  exit?: MotionExitDefinition;
}) {
  const prefersReducedMotion = useReducedMotion();
  const animationClass = preset ? animations[preset] : '';

  // Инициализация переменных анимации с новыми типами
  let motionInitial: MotionInitialDefinition = initial;
  let motionAnimate: MotionAnimateDefinition = animate;
  let motionExit: MotionExitDefinition = exit;
  let motionTransition: Transition = transition || {};
  let processedVariants: Variants | undefined = inputVariants;

  // Обработка различных сценариев анимации
  if (prefersReducedMotion) {
    const reducedProps = getReducedMotionProps();
    motionInitial = reducedProps.motionInitial;
    motionAnimate = reducedProps.motionAnimate;
    motionExit = reducedProps.motionExit;
    motionTransition = { ...motionTransition, ...reducedProps.motionTransition };
    processedVariants = reducedProps.processedVariants;
  } else if (inputVariants) {
    const variantsProps = getVariantsProps(inputVariants, motionInitial, motionAnimate, motionExit);
    motionInitial = variantsProps.motionInitial;
    motionAnimate = variantsProps.motionAnimate;
    motionExit = variantsProps.motionExit;
  } else if (preset) {
    if (initial === undefined) {
      motionInitial = undefined;
    }
  } else {
    const defaultProps = getDefaultAnimationProps(animate, initial);
    motionInitial = defaultProps.motionInitial;
    motionAnimate = defaultProps.motionAnimate;
    motionExit =
      typeof defaultProps.motionExit === 'boolean' ? { opacity: 0 } : defaultProps.motionExit;
  }

  // Применяем настройки времени
  motionTransition = getTimingProps(delay, duration, motionTransition);

  // Настройки для viewport анимации
  const { finalAnimationProps } = getViewportProps(
    whenVisible === undefined ? false : whenVisible,
    prefersReducedMotion,
    processedVariants,
    motionAnimate,
  );

  // Окончательная проверка и приведение типов для избежания ошибок
  const safeMotionInitial = typeof motionInitial === 'boolean' ? undefined : motionInitial;
  const safeMotionExit = typeof motionExit === 'boolean' ? { opacity: 0 } : motionExit;

  return {
    animationClass,
    motionInitial: safeMotionInitial,
    motionExit: safeMotionExit,
    motionTransition,
    processedVariants,
    finalAnimationProps,
  };
}

/**
 * Стандартный компонент для анимаций
 *
 * Объединяет Framer Motion и стили Tailwind для единообразия анимаций
 */
const MotionBase = forwardRef<HTMLDivElement, MotionComponentProps>(
  (
    {
      as: Component = 'div',
      preset,
      delay,
      duration,
      presenceKey,
      show = true,
      whenVisible = false,
      variants,
      initial,
      animate,
      exit,
      transition,
      className,
      children,
      ...rest
    },
    ref,
  ) => {
    const {
      animationClass,
      motionInitial,
      motionExit,
      motionTransition,
      processedVariants,
      finalAnimationProps,
    } = useAnimationProps({
      preset,
      delay,
      duration,
      whenVisible,
      variants,
      initial,
      animate,
      exit,
      transition,
    });

    // Рендерим компонент с анимацией
    const motionComponent = (
      <motion.div
        ref={ref}
        className={cn(animationClass, className)}
        initial={motionInitial}
        exit={motionExit}
        transition={motionTransition}
        variants={processedVariants}
        {...finalAnimationProps}
        {...rest}
      >
        {typeof Component === 'string' ? (
          Component === 'div' ? (
            children
          ) : (
            <Component>{children}</Component>
          )
        ) : (
          <Component>{children}</Component>
        )}
      </motion.div>
    );

    // Оборачиваем в AnimatePresence для управления монтированием/размонтированием
    if (presenceKey !== undefined) {
      return (
        <AnimatePresence mode="wait">
          {show && cloneElement(motionComponent, { key: presenceKey })}
        </AnimatePresence>
      );
    }

    // Просто отображаем или скрываем без анимации
    return show ? motionComponent : null;
  },
);

MotionBase.displayName = 'Motion';

export const Motion = withMemo(MotionBase);
