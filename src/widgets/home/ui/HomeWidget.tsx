import React from "react";
import { HeroSection } from './HeroSection';
import { FeaturesSection } from './FeaturesSection';
import { UseCasesSection } from './UseCasesSection';
import { CtaSection } from './CtaSection';

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