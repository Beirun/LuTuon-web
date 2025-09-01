// stores/auth.ts
import { defineStore } from "pinia"
import { ref, computed } from "vue"
import router from "@/router"
import { useSonnerStore } from "./sonner"
import { useFetch } from "@/plugins/api" // <-- your custom fetch wrapper

export const useAuthStore = defineStore("auth", () => {
  const sonner = useSonnerStore()
  const URL = import.meta.env.VITE_BASE_URL

  const token = ref(localStorage.getItem("token"))
  const user = ref(JSON.parse(localStorage.getItem("user") || "null"))
  const isLoading = ref(false)

  const isAuthenticated = computed(() => !!token.value)
  const isAdmin = computed(() => user.value.isAdmin)
  const userInfo = computed(() => user.value)

  const register = async (credentials: { email: string; password: string; confirmPassword: string }) => {
    const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

    if (!credentials.email || !credentials.password || !credentials.confirmPassword) {
      sonner.error("Input all fields")
      return
    }
    if (!validateEmail(credentials.email)) {
      sonner.error("Enter a valid email")
      return
    }
    if (credentials.password !== credentials.confirmPassword) {
      sonner.error("Passwords do not match")
      return
    }
    if (credentials.password.length < 8) {
      sonner.error("Password must be at least 8 characters long")
      return
    }

    isLoading.value = true
    try {
      const res = await useFetch(URL + "/accounts/register", {
        method: "POST",
        body: JSON.stringify(credentials),
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      })
      const data = await res.json()
      if (!res.ok) return sonner.error(data.message)
      sonner.success(data.message)
      return true
    } catch (err: any) {
      sonner.error(err.message)
    } finally {
      isLoading.value = false
    }
  }

  const login = async (credentials: { email: string; password: string }) => {
    if (!credentials.email || !credentials.password) {
      sonner.error("Input all fields")
      return
    }
    isLoading.value = true
    try {
      const res = await useFetch(URL + "/accounts/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),    
        credentials: "include",
      })
      const data = await res.json()
      if (!res.ok) return sonner.error(data.message)
      
      sonner.success(data.message)
      token.value = data.token  
      user.value = data.user

      localStorage.setItem("token", data.token)
      localStorage.setItem("user", JSON.stringify(data.user))

      const redirectPath = sessionStorage.getItem("redirectAfterLogin")
      sessionStorage.removeItem("redirectAfterLogin")

      // check if admin
      if (redirectPath) {
        router.push(redirectPath)
      } else if (user.value?.isAdmin) {
        router.push("/admin")
      } else {
        router.push("/dashboard")
      }
    } catch (err: any) {
      sonner.error(err.message)
    } finally {
      isLoading.value = false
    }
  }


  const logout = async () => {
    try {
      const res = await useFetch(URL + "/accounts/logout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      })
      const data = await res.json()
      if (!res.ok) return sonner.error(data.message)

      sonner.success(data.message)
      token.value = null
      user.value = null
      localStorage.removeItem("token")
      localStorage.removeItem("user")
      router.push("/")
    } catch (err: any) {
      sonner.error(err.message)
    } finally {
      isLoading.value = false
    }
  }

  const handleTokenExpiry = () => {
    token.value = null
    user.value = null
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    if (router.currentRoute.value.path !== "/") {
      sessionStorage.setItem("redirectAfterLogin", router.currentRoute.value.fullPath)
    }
    router.push("/")
  }

const makeAuthenticatedRequest = async () => { 
  if (!token.value) { 
    sonner.error("No authentication token") 
    return 
  } 
  const res = await useFetch(URL + "/accounts/token/verify", 
    { 
      method: "GET", 
      headers: 
      { 
        "Content-Type": "application/json", 
      }, 
      credentials: "include", 
    }) 
    if(res.status === 401 || res.status === 403) throw Error
    return res 
    
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
    makeAuthenticatedRequest
  }
})
