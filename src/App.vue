<script setup lang="ts">
import { RouterLink, RouterView, useRoute } from 'vue-router'
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import SideBar from './components/SideBar.vue'
import { ref, provide, computed } from 'vue'
import { Toaster } from '@/components/ui/sonner'
import 'vue-sonner/style.css'
import { useColorMode } from '@vueuse/core'

const mode = useColorMode({ disableTransition: false })

const route = useRoute()
const isSidebarOpen = ref(false)
provide('sidebarState', isSidebarOpen)

const paths = ['/forgot-password', '/', '/dashboard','/personal-information','/password']

const toasterTheme = computed(() =>
  mode.value === 'auto' ? 'light' : mode.value
)
</script>

<template>
  <Toaster richColors :theme="toasterTheme"  />
  <SidebarProvider>
    <div class="w-screen h-screen flex flex-col">
      <SidebarTrigger
        class="lg:hidden cursor-pointer"
        :class="route.path === '/forgot-password' || route.path === '/' || route.path === '/dashboard' ? 'hidden' : ''"
        @click="isSidebarOpen = true"
      />
      <SideBar v-if="!paths.includes(route.path)" />
      <RouterView />
    </div>
  </SidebarProvider>
</template>
