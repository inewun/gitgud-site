import commonEn from '../../public/locales/en/common.json';
import commonRu from '../../public/locales/ru/common.json';

const translations = {
  ru: {
    common: commonRu,
  },
  en: {
    common: commonEn,
  },
};

type SupportedLocale = keyof typeof translations;

export const getTranslations = async (locale: string) => {
  const supportedLocale = (
    Object.keys(translations).includes(locale) ? locale : 'ru'
  ) as SupportedLocale;

  return await Promise.resolve(translations[supportedLocale]);
};
