export default defineEventHandler(() => {
  // Mock notifications data
  return [
    {
      id: 1,
      title: 'Welcome to Dashboard',
      description: 'Your dashboard is ready to use',
      icon: 'i-lucide-bell',
      date: new Date().toISOString()
    }
  ]
})
