<template>
  <div class="p-8 space-y-8">
    <div class="border p-4 rounded">
      <h2 class="text-xl font-bold mb-2">
        Notifications Test
      </h2>
      <div v-if="notifLoading">
        Loading...
      </div>
      <div v-else>
        Count: {{ notifications.length }}
      </div>
    </div>

    <div class="border p-4 rounded">
      <h2 class="text-xl font-bold mb-2">
        Members Test
      </h2>
      <div v-if="membersStatus === 'pending'">
        Loading...
      </div>
      <div v-else>
        Count: {{ members.length }}
      </div>
    </div>

    <div class="border p-4 rounded">
      <h2 class="text-xl font-bold mb-2">
        Mails Test
      </h2>
      <div v-if="mailsStatus === 'pending'">
        Loading...
      </div>
      <div v-else>
        Count: {{ mails.length }}, Unread: {{ unreadCount }}
      </div>
    </div>

    <div class="border p-4 rounded">
      <h2 class="text-xl font-bold mb-2">
        Customers Test
      </h2>
      <div v-if="customersStatus === 'pending'">
        Loading...
      </div>
      <div v-else>
        Count: {{ (customers as any).data?.length || 0 }}, Total: {{ (customers as any).total || 0 }}
      </div>
    </div>

    <div class="border p-4 rounded">
      <h2 class="text-xl font-bold mb-2">
        Sales Test
      </h2>
      <div v-if="salesLoading">
        Loading...
      </div>
      <div v-else>
        Count: {{ sales.length }}, Total: ${{ totalSales.toFixed(2) }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

const { loading: notifLoading, fetchNotifications } = useMockNotifications()
const { status: membersStatus, data: members } = useMockMembers()
const { status: mailsStatus, data: mails } = useMockMails()
const { status: customersStatus, data: customers } = useMockCustomers()
const { loading: salesLoading, fetchSales } = useMockSales()

const notifications = ref<any[]>([])
const sales = ref<any[]>([])

const unreadCount = computed(() => (mails.value as any[]).filter((m: any) => m.unread).length)
const totalSales = computed(() => (sales.value as any[]).reduce((sum: number, s: any) => sum + s.amount, 0))

onMounted(async () => {
  notifications.value = await fetchNotifications()
  sales.value = await fetchSales()
})
</script>
