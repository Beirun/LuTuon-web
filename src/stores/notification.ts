// @/stores/notification.ts
import { defineStore } from "pinia"
import { ref } from "vue"
import { useFetch } from "@/plugins/api"
import { useSonnerStore } from "@/stores/sonner"
import type { Notification } from "@/models/notification"

export const useNotificationStore = defineStore("notification", () => {
  const notifications = ref<Notification[]>([])
  const loading = ref(false)
  const URL = import.meta.env.VITE_BASE_URL
  const sonner = useSonnerStore()

  async function fetchNotifications(userId: string) {
    loading.value = true
    try {
      const res = await useFetch(`${URL}/notifications/${userId}`, {
        method: "GET",
        credentials: "include",
      })
      if (!res.ok) throw new Error("Failed to fetch notifications")
      const data = await res.json()
      notifications.value = data

      console.log("notifications",notifications.value)
    } catch (e: any) {
      notifications.value = []
      sonner.error(e.message || "Failed to fetch notifications")
    } finally {
      loading.value = false
    }
  }

  async function createNotification(payload: Partial<Notification>) {
    loading.value = true
    try {
      const res = await useFetch(`${URL}/notifications`, {
        method: "POST",
        credentials: "include",
        body: JSON.stringify(payload),
        headers: { "Content-Type": "application/json" },
      })
      if (!res.ok) throw new Error("Failed to create notification")
      const data = await res.json()
      notifications.value.push(data)
      return data
    } catch (e: any) {
      sonner.error(e.message || "Failed to create notification")
      return null
    } finally {
      loading.value = false
    }
  }

  async function updateNotificationStatus(notificationId: string, status: string) {
    loading.value = true
    try {
      const res = await useFetch(`${URL}/notifications/${notificationId}`, {
        method: "PUT",
        credentials: "include",
        body: JSON.stringify({ status }),
        headers: { "Content-Type": "application/json" },
      })
      if (!res.ok) throw new Error("Failed to update notification")
      const data = await res.json()
      const i = notifications.value.findIndex(n => n.notificationId === notificationId)
      if (i !== -1) notifications.value[i] = data
      return data
    } catch (e: any) {
      sonner.error(e.message || "Failed to update notification")
      return null
    } finally {
      loading.value = false
    }
  }

  async function deleteNotification(notificationId: string) {
    loading.value = true
    try {
      const res = await useFetch(`${URL}/notifications/${notificationId}`, {
        method: "DELETE",
        credentials: "include",
      })
      if (!res.ok) throw new Error("Failed to delete notification")
      await res.json()
      notifications.value = notifications.value.filter(n => n.notificationId !== notificationId)
    } catch (e: any) {
      sonner.error(e.message || "Failed to delete notification")
    } finally {
      loading.value = false
    }
  }

  return {
    notifications,
    loading,
    fetchNotifications,
    createNotification,
    updateNotificationStatus,
    deleteNotification,
  }
})
