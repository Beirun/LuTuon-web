// @/stores/log.ts
import { defineStore } from "pinia"
import { ref } from "vue"
import { useFetch } from "@/plugins/api"
import { useSonnerStore } from "@/stores/sonner"
import { type Log } from "@/models/log"

export const useLogStore = defineStore("log", () => {
  const logs = ref<Log[]>([])
  const log = ref<Log | null>(null)
  const loading = ref(false)
  const URL = import.meta.env.VITE_BASE_URL
  const sonner = useSonnerStore()

  async function fetchLogs() {
    loading.value = true
    try {
      const res = await useFetch(`${URL}/logs`, {
        method: "GET",
        credentials: "include",
      })
      if (!res.ok) throw new Error("Failed to fetch logs")
      const data = await res.json()
      logs.value = data
    } catch (e: any) {
      logs.value = []
      sonner.error(e.message || "Failed to fetch logs")
    } finally {
      loading.value = false
    }
  }

  async function fetchLog(id: string) {
    loading.value = true
    try {
      const res = await useFetch(`${URL}/logs/${id}`, {
        method: "GET",
        credentials: "include",
      })
      if (!res.ok) throw new Error("Failed to fetch log")
      const data = await res.json()
      log.value = data
      sonner.success("Log loaded")
    } catch (e: any) {
      log.value = null
      sonner.error(e.message || "Failed to fetch log")
    } finally {
      loading.value = false
    }
  }

  return { logs, log, loading, fetchLogs, fetchLog }
})
