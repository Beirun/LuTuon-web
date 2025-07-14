import { createRouter, createWebHistory } from 'vue-router'
import Landing from '../views/Landing.vue'
import ForgotPassword from '../views/ForgotPassword.vue'

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
    }
  ],
})

export default router
