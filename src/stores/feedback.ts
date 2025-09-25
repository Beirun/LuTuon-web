// @/stores/feedback.ts
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useFetch } from '@/plugins/api'
import { type Feedback } from '@/models/feedback'
import { useSonnerStore } from '@/stores/sonner'

export const useFeedbackStore = defineStore('feedback', () => {
  const feedbacks = ref<Feedback[]>([])
  const feedback = ref<Feedback | null>(null)
  const loading = ref(false)
  const URL = import.meta.env.VITE_BASE_URL
  const sonner = useSonnerStore()

  async function fetchFeedbacks() {
    loading.value = true
    try {
      const res = await useFetch(`${URL}/feedbacks`, {
        method: 'GET',
        credentials: 'include',
      })
      if (!res.ok) throw new Error('Failed to fetch feedbacks')
      const data = await res.json()
      feedbacks.value = data
    } catch (e: unknown) {
      feedbacks.value = []
      if (e instanceof Error) sonner.error(e.message || 'Failed to fetch feedbacks')
    } finally {
      loading.value = false
    }
  }

  async function fetchFeedback() {
    loading.value = true
    try {
      const res = await useFetch(`${URL}/feedbacks/user`, {
        method: 'GET',
        credentials: 'include',
      })
      if (!res.ok) throw new Error('Failed to fetch feedback')
      const data = await res.json()
      feedback.value = data
    } catch (e: unknown) {
      feedback.value = null
      if (e instanceof Error) sonner.error(e.message || 'Failed to fetch feedback')
    } finally {
      loading.value = false
    }
  }

  return { feedbacks, feedback, loading, fetchFeedbacks, fetchFeedback }
})
