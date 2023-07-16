// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxtjs/i18n'
  ],
  i18n: {
    lazy: true,
    langDir: 'locales',
    strategy: 'prefix_except_default',
    locales: [
      {
        code: 'en-NZ',
        iso: 'en-NZ',
        name: 'English(NZ)',
        file: 'en-NZ.json'
      },
      {
        code: 'vi-VN',
        iso: 'vi-VN',
        name: 'Tiếng Việt',
        file: 'vi-VN.json'
      }
    ],
    defaultLocale: 'vi-VN',
  }
})
