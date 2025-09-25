// @/stores/user.ts
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useFetch } from '@/plugins/api'
import { type User } from '@/models/user'
import { useSonnerStore } from './sonner'

export const useUserStore = defineStore('user', () => {
  const sonner = useSonnerStore()
  const users = ref<User[]>([])
  const loading = ref(false)
  const URL = import.meta.env.VITE_BASE_URL

  async function fetchUsers() {
    loading.value = true
    try {
      const res = await useFetch(`${URL}/accounts/users`, {
        method: 'GET',
        credentials: 'include',
      })
      if (!res.ok) throw new Error('Failed to fetch users')
      const data = await res.json()
      users.value = data
    } catch (e: unknown) {
      if (e instanceof Error) sonner.error(e.message || 'Failed to fetch users')
      users.value = []
    } finally {
      loading.value = false
    }
  }

  return { users, loading, fetchUsers }
})
