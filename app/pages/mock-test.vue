<template>
  <div class="p-8 space-y-8">
    <div class="border p-4 rounded">
      <h2 class="text-xl font-bold mb-2">Notifications Test</h2>
      <div v-if="notifLoading">Loading...</div>
      <div v-else>Count: {{ notifications.length }}</div>
    </div>

    <div class="border p-4 rounded">
      <h2 class="text-xl font-bold mb-2">Members Test</h2>
      <div v-if="membersLoading">Loading...</div>
      <div v-else>Count: {{ members.length }}</div>
    </div>

    <div class="border p-4 rounded">
      <h2 class="text-xl font-bold mb-2">Mails Test</h2>
      <div v-if="mailsLoading">Loading...</div>
      <div v-else>Count: {{ mails.length }}, Unread: {{ unreadCount }}</div>
    </div>

    <div class="border p-4 rounded">
      <h2 class="text-xl font-bold mb-2">Customers Test</h2>
      <div v-if="customersLoading">Loading...</div>
      <div v-else>Count: {{ customers.data.length }}, Total: {{ customers.total }}</div>
    </div>

    <div class="border p-4 rounded">
      <h2 class="text-xl font-bold mb-2">Sales Test</h2>
      <div v-if="salesLoading">Loading...</div>
      <div v-else>Count: {{ sales.length }}, Total: ${{ totalSales.toFixed(2) }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import type { Notification, Member, Mail, User, Sale } from '~/types/mocks'

const { loading: notifLoading, fetchNotifications } = useMockNotifications()
const { loading: membersLoading, fetchMembers } = useMockMembers()
const { loading: mailsLoading, fetchMails } = useMockMails()
const { loading: customersLoading, fetchCustomers } = useMockCustomers()
const { loading: salesLoading, fetchSales } = useMockSales()

const notifications = ref<Notification[]>([])
const members = ref<Member[]>([])
const mails = ref<Mail[]>([])
const customers = ref<{ data: User[], total: number }>({ data: [], total: 0 })
const sales = ref<Sale[]>([])

const unreadCount = computed(() => mails.value.filter(m => m.unread).length)
const totalSales = computed(() => sales.value.reduce((sum, s) => sum + s.amount, 0))

onMounted(async () => {
  notifications.value = await fetchNotifications()
  members.value = await fetchMembers()
  mails.value = await fetchMails()
  customers.value = await fetchCustomers({ limit: 10 })
  sales.value = await fetchSales()
})
</script>
