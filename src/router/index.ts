import { createRouter, createWebHistory } from 'vue-router'
import Landing from '../views/Landing.vue'
import ForgotPassword from '../views/ForgotPassword.vue'
import Dashboard from '../views/Dashboard.vue'
import Users from '@/views/Users.vue'
import Reports from '@/views/Reports.vue'
import Feedbacks from '@/views/Feedbacks.vue'
import Logs from '@/views/Logs.vue'
import Settings from '@/views/Settings.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Landing,
    },
    {
      path: '/forgot-password',
      name: 'forgot-password',
      component: ForgotPassword,
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: Dashboard,
    },
    {
      path: '/users',
      name: 'users',
      component: Users,
    },
    {
      path: '/reports',
      name: 'reports',
      component: Reports
    },
    {
      path: '/feedbacks',
      name: 'feedbacks',
      component: Feedbacks
    },
    {
      path: '/logs',
      name: 'logs',
      component: Logs
    },
    {
      path: '/settings',
      name: 'settings',
      component: Settings
    }
  ],
})

export default router
