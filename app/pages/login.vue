<script setup lang="ts">
const { loggedIn } = useUserSession()

// Redirect if already logged in
watchEffect(() => {
  if (loggedIn.value) {
    navigateTo('/')
  }
})

const form = ref({
  email: '',
  password: ''
})

const loading = ref(false)
const error = ref('')

async function handleLogin() {
  error.value = ''
  loading.value = true

  try {
    await $fetch('/api/auth/login', {
      method: 'POST',
      body: form.value
    })

    // Refresh the page to fetch new session from server
    // This ensures useUserSession() gets the updated session before navigation
    await reloadNuxtApp({
      path: '/',
      persistState: false
    })
  } catch (err: any) {
    error.value = err.data?.message || 'Invalid credentials'
  } finally {
    loading.value = false
  }
}

useSeoMeta({
  title: 'Login - Admin Dashboard',
  description: 'Sign in to access your dashboard'
})
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-neutral-50 dark:bg-neutral-950 p-4">
    <UCard class="w-full max-w-md">
      <template #header>
        <div class="text-center">
          <h1 class="text-2xl font-bold">Welcome to Dashboard</h1>
          <p class="text-neutral-500 dark:text-neutral-400 mt-2">
            Sign in to access your dashboard
          </p>
        </div>
      </template>

      <form @submit.prevent="handleLogin" class="space-y-4">
        <UAlert
          v-if="error"
          color="error"
          :title="error"
          variant="soft"
        />

        <div>
          <label class="block text-sm font-medium mb-2">Email</label>
          <UInput
            v-model="form.email"
            type="email"
            placeholder="admin@local.dev"
            required
            :disabled="loading"
          />
        </div>

        <div>
          <label class="block text-sm font-medium mb-2">Password</label>
          <UInput
            v-model="form.password"
            type="password"
            placeholder="Enter your password"
            required
            :disabled="loading"
          />
        </div>

        <UButton
          type="submit"
          block
          size="lg"
          :loading="loading"
        >
          Sign in
        </UButton>
      </form>

      <template #footer>
        <p class="text-xs text-center text-neutral-500 dark:text-neutral-400">
          Default account: admin@local.dev / !password!
        </p>
      </template>
    </UCard>
  </div>
</template>
