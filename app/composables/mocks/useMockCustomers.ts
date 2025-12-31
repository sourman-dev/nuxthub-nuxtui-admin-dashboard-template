import type { User, UserStatus } from '~/types'

export const useMockCustomers = () => {
  const data = ref<User[]>([])
  const status = ref<'idle' | 'pending' | 'success' | 'error'>('pending')

  // Auto-fetch on mount
  onMounted(async () => {
    try {
      const response = await import('~/data/customers.json')
      data.value = response.default as User[]
      status.value = 'success'
    } catch (err) {
      console.error('Failed to load customers:', err)
      status.value = 'error'
    }
  })

  return {
    data,
    status
  }
}
