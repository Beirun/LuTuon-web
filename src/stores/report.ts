// @/stores/report.ts
import { defineStore } from "pinia"
import { ref } from "vue"
import { useFetch } from "@/plugins/api"
import { type Report } from "@/models/report"
import { useSonnerStore } from "@/stores/sonner"

export const useReportStore = defineStore("report", () => {
  const reports = ref<Report[]>([])
  const report = ref<Report | null>(null)
  const loading = ref(false)
  const URL = import.meta.env.VITE_BASE_URL
  const sonner = useSonnerStore()

  async function fetchReports() {
    loading.value = true
    try {
      const res = await useFetch(`${URL}/game/attempts`, {
        method: "GET",
        credentials: "include",
      })
      if (!res.ok) throw new Error("Failed to fetch reports")
      const data = await res.json()
      reports.value = data
    } catch (e: any) {
      reports.value = []
      sonner.error(e.message || "Failed to fetch reports")
    } finally {
      loading.value = false
    }
  }

  async function fetchReport(id: string) {
    loading.value = true
    try {
      const res = await useFetch(`${URL}/game/attempts/${id}`, {
        method: "GET",
        credentials: "include",
      })
      if (!res.ok) throw new Error("Failed to fetch report")
      const data = await res.json()
      report.value = data
    } catch (e: any) {
      report.value = null
      sonner.error(e.message || "Failed to fetch report")
    } finally {
      loading.value = false
    }
  }

  return { reports, report, loading, fetchReports, fetchReport }
})
