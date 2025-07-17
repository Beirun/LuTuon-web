<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import {SidebarProvider, SidebarTrigger} from '@/components/ui/sidebar'
import {useRoute} from 'vue-router'
const route = useRoute()

</script>

<template>
  <SidebarProvider>
    <div class="w-screen h-screen flex flex-col">
      <SidebarTrigger class="lg:hidden" :class="route.path === '/forgot-password' ? 'hidden' : ''"/>
      <RouterView />
    </div>
  </SidebarProvider>
</template>

