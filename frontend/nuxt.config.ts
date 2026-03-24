// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    '@nuxt/ui',
    '@nuxt/image',
    '@nuxtjs/medusa'
  ],

  devtools: {
    enabled: true
  },

  runtimeConfig: {
    public: {
      medusa: {
        baseUrl: 'http://localhost:9000', // overridden by NUXT_PUBLIC_MEDUSA_BASE_URL
        publishableKey: '' // overridden by NUXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY
      }
    }
  },

  css: ['~/assets/css/main.css'],

  routeRules: {
    '/': { prerender: true }
  },

  compatibilityDate: '2025-01-15',

  vite: {
    optimizeDeps: {
      include: ['qs']
    }
  },

  eslint: {
    config: {
      stylistic: {
        commaDangle: 'never',
        braceStyle: '1tbs'
      }
    }
  }
})