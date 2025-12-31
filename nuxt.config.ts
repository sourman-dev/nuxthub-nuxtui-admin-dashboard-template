export default defineNuxtConfig({
  modules: [
    '@nuxt/ui',
    '@nuxt/eslint',
    '@nuxthub/core',
    'nuxt-auth-utils',
    '@pinia/nuxt',
    '@pinia/colada-nuxt',
    '@vueuse/nuxt'
  ],
  devtools: {
    enabled: true
  },
  css: ['~/assets/main.css'],
  future: { compatibilityVersion: 4 },
  compatibilityDate: '2025-08-07',
  hub: {
    db: 'sqlite'
  },
  nitro: {
    experimental: {
      tasks: true
    }
  },
  // Auto-import composables from subdirectories
  imports: {
    dirs: ['composables/**']
  },
  // Development config
  eslint: {
    config: {
      stylistic: {
        quotes: 'single',
        commaDangle: 'never'
      }
    }
  }
})
