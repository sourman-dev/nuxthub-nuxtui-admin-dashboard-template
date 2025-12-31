import type { Sale } from '~/types'

export const useMockSales = () => {
  const loading = ref(false)
  const error = ref<Error | null>(null)

  const fetchSales = async (options?: {
    startDate?: Date
    endDate?: Date
  }): Promise<Sale[]> => {
    loading.value = true
    error.value = null

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 200))

      const response = await import('~/data/sales.json')
      let sales = response.default as Sale[]

      // Client-side date range filtering
      if (options?.startDate || options?.endDate) {
        sales = sales.filter(s => {
          const saleDate = new Date(s.date)
          if (options.startDate && saleDate < options.startDate) return false
          if (options.endDate && saleDate > options.endDate) return false
          return true
        })
      }

      return sales
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
    fetchSales
  }
}
