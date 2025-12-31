import type { Mail } from '~/types/mocks'

export const useMockMails = () => {
  const loading = ref(false)
  const error = ref<Error | null>(null)

  const fetchMails = async (options?: {
    search?: string
    unread?: boolean
  }): Promise<Mail[]> => {
    loading.value = true
    error.value = null

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 200))

      const response = await import('~/data/mails.json')
      let mails = response.default as Mail[]

      // Client-side search by subject or sender
      if (options?.search) {
        const searchLower = options.search.toLowerCase()
        mails = mails.filter(m =>
          m.subject.toLowerCase().includes(searchLower) ||
          m.from.name.toLowerCase().includes(searchLower) ||
          m.from.email.toLowerCase().includes(searchLower)
        )
      }

      // Client-side unread filter
      if (options?.unread !== undefined) {
        mails = mails.filter(m => m.unread === options.unread)
      }

      return mails
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
    fetchMails
  }
}
