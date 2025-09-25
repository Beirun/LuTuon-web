// @/stores/auth.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import router from '@/router'
import { useSonnerStore } from './sonner'
import { useFetch } from '@/plugins/api'
import type { CallbackTypes } from 'vue3-google-login'
import { useNotificationStore } from './notification'
import { jwtDecode } from 'jwt-decode'

export const useAuthStore = defineStore('auth', () => {
  const sonner = useSonnerStore()
  const notification = useNotificationStore()
  const URL = import.meta.env.VITE_BASE_URL

  const token = ref(localStorage.getItem('token'))
  const user = ref(JSON.parse(localStorage.getItem('user') || 'null'))
  const isLoading = ref(false)
  const isAuthenticated = computed(() => !!token.value)
  const isAdmin = computed(() =>
    token.value
      ? Object.values(jwtDecode(token.value))[1] === import.meta.env.VITE_ADMIN_ROLE
      : false,
  )
  const userInfo = computed(() => user.value)

  const register = async (credentials: {
    email: string
    password: string
    confirmPassword: string
  }) => {
    isLoading.value = true
    try {
      const res = await useFetch(`${URL}/accounts/register`, {
        method: 'POST',
        body: JSON.stringify(credentials),
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      })
      const data = await res.json()
      if (!res.ok) return sonner.error(data.message)
      sonner.success(data.message)
      return true
    } catch (err: unknown) {
      if (err instanceof Error) sonner.error(err.message)
    } finally {
      isLoading.value = false
    }
  }

  const continueWithGoogle = async (object: CallbackTypes.TokenPopupResponse) => {
    isLoading.value = true
    try {
      const result = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: { Authorization: `Bearer ${object.access_token}` },
      })
      const fetchedUser = await result.json()

      const credentials = { email: fetchedUser.email, username: fetchedUser.name }
      const res = await useFetch(`${URL}/accounts/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
        credentials: 'include',
      })
      const data = await res.json()
      if (!res.ok) return sonner.error(data.message)

      token.value = data.token
      user.value = data.user
      await notification.fetchNotifications()
      sonner.success(data.message)

      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))

      const redirectPath = sessionStorage.getItem('redirectAfterLogin')
      sessionStorage.removeItem('redirectAfterLogin')

      if (redirectPath) router.push(redirectPath)
      else if (isAdmin.value) router.push('/admin')
      else router.push('/dashboard')
    } catch (err: unknown) {
      if (err instanceof Error) sonner.error(err.message)
    } finally {
      isLoading.value = false
    }
  }

  const login = async (credentials: { email: string; password: string }) => {
    isLoading.value = true
    try {
      const res = await useFetch(`${URL}/accounts/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
        credentials: 'include',
      })
      const data = await res.json()
      if (!res.ok) return sonner.error(data.message)
      sonner.success(data.message)

      token.value = data.token
      user.value = data.user
      await notification.fetchNotifications()
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))

      const redirectPath = sessionStorage.getItem('redirectAfterLogin')
      sessionStorage.removeItem('redirectAfterLogin')

      if (redirectPath) router.push(redirectPath)
      else if (isAdmin.value) router.push('/admin')
      else router.push('/dashboard')
    } catch (err: unknown) {
      if (err instanceof Error) sonner.error(err.message)
    } finally {
      isLoading.value = false
    }
  }

  const logout = async () => {
    isLoading.value = true
    try {
      const res = await useFetch(`${URL}/accounts/logout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      })
      const data = await res.json()
      if (!res.ok) return sonner.error(data.message)
      sonner.success(data.message)

      token.value = null
      user.value = null
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      router.push('/')
    } catch (err: unknown) {
      if (err instanceof Error) sonner.error(err.message)
    } finally {
      isLoading.value = false
    }
  }

  const update = async (updates: {
    userName?: string
    userEmail?: string
    userDob?: string
    oldPassword?: string
    newPassword?: string
    confirmPassword?: string
  }) => {
    isLoading.value = true
    try {
      const res = await useFetch(`${URL}/accounts`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
        credentials: 'include',
      })
      const data = await res.json()
      if (!res.ok) return sonner.error(data.message)

      console.log('data', data)

      if (res.status === 200) sonner.message('Profile Info', data.message)
      if (data.user) {
        console.log('user', { ...user.value, ...data.user })
        user.value = { ...user.value, ...data.user }

        localStorage.setItem('user', JSON.stringify(user.value))
      }
      console.log('new User', user.value)
      return true
    } catch (err: unknown) {
      if (err instanceof Error) sonner.error(err.message)
      return false
    } finally {
      isLoading.value = false
    }
  }

  const _delete = async () => {
    isLoading.value = true
    try {
      const res = await useFetch(`${URL}/accounts`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      })
      const data = await res.json()
      if (!res.ok) return sonner.error(data.message)

      token.value = null
      user.value = null
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      router.push('/')
    } catch (err: unknown) {
      if (err instanceof Error) sonner.error(err.message)
    } finally {
      isLoading.value = false
    }
  }

  const handleTokenExpiry = () => {
    token.value = null
    user.value = null
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    if (router.currentRoute.value.path !== '/') {
      sessionStorage.setItem('redirectAfterLogin', router.currentRoute.value.fullPath)
    }
    router.push('/')
  }

  const makeAuthenticatedRequest = async () => {
    if (!token.value) {
      sonner.error('No authentication token')
      return
    }

    const res = await useFetch(`${URL}/accounts/token/verify`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    })
    if (res.status === 401 || res.status === 403) throw new Error('Unauthorized')
    return res
  }

  const setToken = (newToken: string) => {
    token.value = newToken
  }

  return {
    token,
    user,
    isLoading,
    isAuthenticated,
    isAdmin,
    userInfo,
    register,
    login,
    logout,
    handleTokenExpiry,
    makeAuthenticatedRequest,
    continueWithGoogle,
    setToken,
    update,
  }
})
