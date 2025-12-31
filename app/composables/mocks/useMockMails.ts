import type { Mail } from '~/types'

export const useMockMails = () => {
  const data = ref<Mail[]>([])
  const status = ref<'idle' | 'pending' | 'success' | 'error'>('pending')

  // Auto-fetch on mount
  onMounted(async () => {
    try {
      const response = await import('~/data/mails.json')
      data.value = response.default as Mail[]
      status.value = 'success'
    }
    catch (err) {
      console.error('Failed to load mails:', err)
      status.value = 'error'
    }
  })

  return {
    data,
    status
  }
}
