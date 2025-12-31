import type { Member } from '~/types'

export const useMockMembers = () => {
  const data = ref<Member[]>([])
  const status = ref<'idle' | 'pending' | 'success' | 'error'>('pending')

  // Auto-fetch on mount
  onMounted(async () => {
    try {
      const response = await import('~/data/members.json')
      data.value = response.default as Member[]
      status.value = 'success'
    }
    catch (err) {
      console.error('Failed to load members:', err)
      status.value = 'error'
    }
  })

  return {
    data,
    status
  }
}
