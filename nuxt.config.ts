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
  // Auto-import composables from subdirectories
  imports: {
    dirs: ['composables/**']
  },
  devtools: {
    enabled: true
  },
  css: ['~/assets/main.css'],
  runtimeConfig: {
    passwordSalt: process.env.NUXT_PASSWORD_SALT,
    llm: {
      text: {
        provider: process.env.NUXT_LLM_TEXT_PROVIDER,
        baseUrl: process.env.NUXT_LLM_TEXT_BASE_URL,
        apiKey: process.env.NUXT_LLM_TEXT_API_KEY,
        model: process.env.NUXT_LLM_TEXT_MODEL
      },
      image: {
        provider: process.env.NUXT_LLM_IMAGE_PROVIDER,
        baseUrl: process.env.NUXT_LLM_IMAGE_BASE_URL,
        apiKey: process.env.NUXT_LLM_IMAGE_API_KEY,
        model: process.env.NUXT_LLM_IMAGE_MODEL
      }
    },
    public: {
      apiBase: '/api'
    }
  },
  future: { compatibilityVersion: 4 },
  compatibilityDate: '2025-08-07',
  nitro: {
    experimental: {
      tasks: true
    }
  },
  hub: {
    db: 'sqlite'
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
