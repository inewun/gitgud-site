import { Metadata } from 'next';
import { HeroSection } from '@/widgets/home/ui/HeroSection';
import { FeaturesSection } from '@/widgets/home/ui/FeaturesSection';
import { UseCasesSection } from '@/widgets/home/ui/UseCasesSection';
import { CtaSection } from '@/widgets/home/ui/CtaSection';

export const metadata: Metadata = {
  title: 'Главная | Datashield',
  description: 'Инструмент для быстрой и безопасной анонимизации персональных данных',
};

// Настройки ISR (инкрементальной статической регенерации)
export const revalidate = 86400; // Повторная валидация через 24 часа

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background flex flex-col">
      <HeroSection />
      <FeaturesSection />
      <UseCasesSection />
      <CtaSection />
    </main>
  );
}
