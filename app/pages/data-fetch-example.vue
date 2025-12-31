<script setup lang="ts">
interface Todo {
  id: number
  title: string
  completed: boolean
}

const { data: todos, pending, error, refresh } = useAsyncData<Todo[]>('todos', () =>
  $fetch('https://jsonplaceholder.typicode.com/todos?_limit=5')
)

function clearErrorAndRefresh() {
  error.value = undefined
  refresh()
}
</script>

<template>
  <UContainer>
    <UCard class="mt-10">
      <template #header>
        <h2 class="text-xl font-bold">
          Data Fetching Example
        </h2>
      </template>

      <div v-if="pending" class="flex items-center gap-2">
        <UProgress animation="carousel" class="w-full" />
        <span>Loading todos...</span>
      </div>
      <div v-else-if="error">
        <UAlert
          icon="i-heroicons-exclamation-triangle"
          color="error"
          variant="soft"
          title="Error loading todos!"
          description="Failed to fetch data from the API."
          class="mb-4"
        />
        <UButton @click="clearErrorAndRefresh">
          Try Again
        </UButton>
      </div>
      <div v-else>
        <h3 class="text-lg font-semibold mb-2">
          Fetched Todos:
        </h3>
        <UList>
          <UListItem v-for="todo in todos" :key="todo.id">
            {{ todo.title }} - {{ todo.completed ? 'Completed' : 'Pending' }}
          </UListItem>
        </UList>
        <UButton class="mt-4" @click="() => refresh()">
          Refresh Data
        </UButton>
      </div>
    </UCard>
  </UContainer>
</template>
