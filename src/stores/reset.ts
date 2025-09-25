// stores/reset.ts
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useFetch } from '@/plugins/api'
import { useSonnerStore } from './sonner'
import router from '@/router'
export const useResetStore = defineStore('reset', () => {
  const loading = ref(false)
  const code = ref<string | null>(null)
  const expiresAt = ref<string | null>(null)
  const URL = import.meta.env.VITE_BASE_URL

  const sonner = useSonnerStore()

  async function requestReset(email: string) {
    loading.value = true
    try {
      const res = await useFetch(URL + `/reset/request`, {
        method: 'POST',
        body: JSON.stringify({ email: email }),
        headers: { 'Content-Type': 'application/json' },
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Failed to request reset')

      code.value = data.code
      expiresAt.value = data.expiresAt

      sonner.success(data.message)
      return true
    } catch (e: unknown) {
      if (e instanceof Error) sonner.error(e.message || 'An error occurred')
      return false
    } finally {
      loading.value = false
    }
  }

  async function verifyCode(email: string, enteredCode: string) {
    loading.value = true
    try {
      const res = await useFetch(URL + `/reset/verify`, {
        method: 'POST',
        body: JSON.stringify({ email, code: enteredCode }),
        headers: { 'Content-Type': 'application/json' },
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Invalid or expired code')

      sonner.success(data.message)
      return data.resetId
    } catch (e: unknown) {
      if (e instanceof Error) sonner.error(e.message || 'An error occurred')
      return null
    } finally {
      loading.value = false
    }
  }

  async function resetPassword(
    email: string,
    enteredCode: string,
    newPassword: string,
    confirmPassword: string,
  ) {
    loading.value = true
    try {
      const res = await useFetch(URL + `/reset/password`, {
        method: 'POST',
        body: JSON.stringify({ email, code: enteredCode, newPassword, confirmPassword }),
        headers: { 'Content-Type': 'application/json' },
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Failed to reset password')

      sonner.success(data.message)
      code.value = null
      expiresAt.value = null
      router.push('/')
    } catch (e: unknown) {
      if (e instanceof Error) sonner.error(e.message || 'An error occurred')
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    code,
    expiresAt,
    requestReset,
    verifyCode,
    resetPassword,
  }
})
