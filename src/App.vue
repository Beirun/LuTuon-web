<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import {SidebarProvider, SidebarTrigger} from '@/components/ui/sidebar'
import {useRoute} from 'vue-router'
import SideBar from './components/SideBar.vue'
import {ref, provide} from 'vue'

const route = useRoute()
const isSidebarOpen = ref(false)
provide('sidebarState', isSidebarOpen) 


</script>

<template>
  <SidebarProvider>
    <div class="w-screen h-screen flex flex-col">
      <SidebarTrigger class="lg:hidden cursor-pointer" :class="route.path === '/forgot-password' || route.path === '/' ? 'hidden' : ''" @click="isSidebarOpen = true"/>
      <SideBar />
      <RouterView />
    </div>
  </SidebarProvider>
</template>

