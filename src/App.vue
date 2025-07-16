<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import {SidebarProvider, SidebarTrigger} from '@/components/ui/sidebar'

</script>

<template>
  <SidebarProvider>
    <div class="w-screen h-screen flex flex-col">
      <SidebarTrigger class="lg:hidden"/>
      <RouterView />
    </div>
  </SidebarProvider>
</template>

