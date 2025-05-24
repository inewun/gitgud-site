import React from 'react';

import { CtaSection } from './CtaSection';
import { FeaturesSection } from './FeaturesSection';
import { HeroSection } from './HeroSection';
import { UseCasesSection } from './UseCasesSection';

/**
 * Виджет домашней страницы, объединяющий все секции
 */
export const HomeWidget: React.FC = () => {
  return (
    <React.Fragment>
      <HeroSection />
      <FeaturesSection />
      <UseCasesSection />
      <CtaSection />
    </React.Fragment>
  );
};
