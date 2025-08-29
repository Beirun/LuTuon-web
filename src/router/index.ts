import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

import Landing from '../views/Landing.vue'
import ForgotPassword from '../views/ForgotPassword.vue'
import Dashboard from '../views/Dashboard.vue'
import Users from '@/views/Users.vue'
import Reports from '@/views/Reports.vue'
import Feedbacks from '@/views/Feedbacks.vue'
import Logs from '@/views/Logs.vue'
import Settings from '@/views/Settings.vue'
import UserDashboard from '@/views/User/Dashboard.vue'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Landing,
      meta: {
      requiresGuest: true // Only accessible when not authenticated
    }
    },
    {
      path: '/forgot-password',
      name: 'forgot-password',
      component: ForgotPassword,
      meta: {
      requiresGuest: true // Only accessible when not authenticated
    }
    },
    {
      path: '/admin',
      name: 'admindashboard',
      component: Dashboard,
      meta: {
      requiresAuth: true // Requires authentication
    }
    },
    {
      path: '/users',
      name: 'users',
      component: Users,
      meta: {
      requiresAuth: true // Requires authentication
    }
    },
    {
      path: '/reports',
      name: 'reports',
      component: Reports,
      meta: {
      requiresAuth: true // Requires authentication
    }
    },
    {
      path: '/feedbacks',
      name: 'feedbacks',
      component: Feedbacks,
      meta: {
      requiresAuth: true // Requires authentication
    }
    },
    {
      path: '/logs',
      name: 'logs',
      component: Logs,
      meta: {
      requiresAuth: true // Requires authentication
    }
    },
    {
      path: '/settings',
      name: 'settings',
      component: Settings,
      meta: {
      requiresAuth: true // Requires authentication
    }
    },
    {
      path: '/dashboard',
      name: 'user-dashboard',
      component: UserDashboard,
      meta: {
      requiresAuth: true // Requires authentication
    }
    }
  ],
})

router.beforeEach(async(to, from, next) => {
  const authStore = useAuthStore()
  if (to.meta.requiresAuth) {
    if (!authStore.isAuthenticated) {
      console.log('guard')
      sessionStorage.setItem('redirectAfterLogin', to.fullPath)
      next('/')
      return
    }
    try {
      await authStore.makeAuthenticatedRequest();
    } catch (err) {null}
    next()
  } 
  else if (to.meta.requiresGuest) {
    if (authStore.isAuthenticated) {
      next('/dashboard')
      return
    }
    next()
  } 
  else {
    next()
  }
})

export default router
