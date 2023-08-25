// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxtjs/i18n'
  ],
  runtimeConfig: {
    // Private config that is only available on the server
    FIREBASE_API_KEY: process.env.FIREBASE_API_KEY,
    // Config within public will be also exposed to the client
    public: {
      FIREBASE_API_KEY: process.env.FIREBASE_API_KEY
    }
  },
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
  },
  ssr: true,
  nitro: {
    preset: 'firebase'
  }
})
