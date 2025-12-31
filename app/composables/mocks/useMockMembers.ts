import type { Member } from '~/types/mocks'

export const useMockMembers = () => {
  const loading = ref(false)
  const error = ref<Error | null>(null)

  const fetchMembers = async (options?: {
    search?: string
    role?: 'member' | 'owner'
  }): Promise<Member[]> => {
    loading.value = true
    error.value = null

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 200))

      const response = await import('~/data/members.json')
      let members = response.default as Member[]

      // Client-side search by name or email
      if (options?.search) {
        const searchLower = options.search.toLowerCase()
        members = members.filter(m =>
          m.name.toLowerCase().includes(searchLower) ||
          m.email.toLowerCase().includes(searchLower)
        )
      }

      // Client-side role filter
      if (options?.role) {
        members = members.filter(m => m.role === options.role)
      }

      return members
    } catch (err) {
      error.value = err as Error
      return []
    } finally {
      loading.value = false
    }
  }

  return {
    loading: readonly(loading),
    error: readonly(error),
    fetchMembers
  }
}
