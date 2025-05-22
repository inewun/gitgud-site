import React from 'react';

import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

import { cn } from '@/shared/lib/utils';

// Анимационные варианты для иконок
const iconVariants = {
  initial: { opacity: 0, rotate: -30, scale: 0.5 },
  animate: { opacity: 1, rotate: 0, scale: 1 },
  exit: { opacity: 0, rotate: 30, scale: 0.5 },
};

interface ThemeIconProps {
  icon: LucideIcon;
  theme: string;
}

export const ThemeIcon: React.FC<ThemeIconProps> = ({ icon: Icon, theme }) => {
  return (
    <motion.div
      key={theme}
      variants={iconVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ type: 'spring', stiffness: 300, damping: 15 }}
      className={cn(
        'theme-toggle-icon',
        'theme-toggle-icon-enter', // Начальное состояние (будет переопределено framer-motion)
      )}
    >
      <Icon className="h-5 w-5" />
    </motion.div>
  );
};
