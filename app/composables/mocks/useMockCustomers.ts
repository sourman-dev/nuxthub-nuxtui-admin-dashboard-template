import type { User, UserStatus } from '~/types/mocks'

export const useMockCustomers = () => {
  const loading = ref(false)
  const error = ref<Error | null>(null)

  const fetchCustomers = async (options?: {
    search?: string
    status?: UserStatus
    limit?: number
    offset?: number
  }): Promise<{ data: User[], total: number }> => {
    loading.value = true
    error.value = null

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 200))

      const response = await import('~/data/customers.json')
      let customers = response.default as User[]

      // Client-side search by name or email
      if (options?.search) {
        const searchLower = options.search.toLowerCase()
        customers = customers.filter(c =>
          c.name.toLowerCase().includes(searchLower) ||
          c.email.toLowerCase().includes(searchLower)
        )
      }

      // Client-side status filter
      if (options?.status) {
        customers = customers.filter(c => c.status === options.status)
      }

      const total = customers.length

      // Client-side pagination
      if (options?.limit !== undefined) {
        const offset = options.offset || 0
        customers = customers.slice(offset, offset + options.limit)
      }

      return { data: customers, total }
    } catch (err) {
      error.value = err as Error
      return { data: [], total: 0 }
    } finally {
      loading.value = false
    }
  }

  return {
    loading: readonly(loading),
    error: readonly(error),
    fetchCustomers
  }
}
