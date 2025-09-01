// @/stores/user.ts
import { defineStore } from "pinia"
import { ref } from "vue"
import { useFetch } from "@/plugins/api"
import { type User } from "@/models/user"

export const useUserStore = defineStore("user", () => {
  const me = ref<User | null>(null)
  const users = ref<User[]>([])
  const user = ref<User | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const URL = import.meta.env.VITE_BASE_URL;
  async function fetchMe() {
    loading.value = true
    error.value = null
    try {
      const res = await useFetch(`${URL}/accounts/me`, {
        method: "GET",
        credentials: "include",
      })
      if (!res.ok) throw new Error("Failed to fetch me")
      const data = await res.json();
      me.value = data
    } catch (e: any) {
      error.value = e.message || "Failed to fetch me"
      me.value = null
    } finally {
      loading.value = false
    }
  }

  async function fetchUsers() {
    loading.value = true
    error.value = null
    try {
      const res = await useFetch(`${URL}/accounts/users`, {
        method: "GET",
        credentials: "include",
      })
      if (!res.ok) throw new Error("Failed to fetch users")
      const data = await res.json();
      users.value = data;
    } catch (e: any) {
      error.value = e.message || "Failed to fetch users"
      users.value = []
    } finally {
      loading.value = false
    }
  }

  async function fetchUser(id: string) {
    loading.value = true
    error.value = null
    try {
      const res = await useFetch(`${URL}/accounts/users/${id}`, {
        method: "GET",
        credentials: "include",
      })
      if (!res.ok) throw new Error("Failed to fetch user")
      const data = await res.json();
      user.value = data
    } catch (e: any) {
      error.value = e.message || "Failed to fetch user"
      user.value = null
    } finally {
      loading.value = false
    }
  }

  return { me, users, user, loading, error, fetchMe, fetchUsers, fetchUser }
})
