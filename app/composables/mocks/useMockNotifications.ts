import type { Notification } from '~/types'

export const useMockNotifications = () => {
  const loading = ref(false)
  const error = ref<Error | null>(null)

  const fetchNotifications = async (): Promise<Notification[]> => {
    loading.value = true
    error.value = null

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 200))

      const response = await import('~/data/notifications.json')
      return response.default as Notification[]
    }
    catch (err) {
      error.value = err as Error
      return []
    }
    finally {
      loading.value = false
    }
  }

  return {
    loading: readonly(loading),
    error: readonly(error),
    fetchNotifications
  }
}
