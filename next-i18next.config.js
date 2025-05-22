/**
 * @type {import('next-i18next').UserConfig}
 */
module.exports = {
  i18n: {
    defaultLocale: 'ru',
    locales: ['ru', 'en'],
  },
  localePath: './src/locales',
  reloadOnPrerender: process.env.NODE_ENV === 'development',
};
