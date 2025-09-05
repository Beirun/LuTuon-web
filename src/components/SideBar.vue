<script setup lang="ts">
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { ref, inject } from "vue";
import {useRoute } from "vue-router"
import { House, UsersRound, Files, MessageSquareText, Logs, UserRoundCog, LogOut, Loader2 } from 'lucide-vue-next';
import {Separator} from "@/components/ui/separator"
import router from "@/router";
import { useAuthStore } from "@/stores/auth";
import Button from "./ui/button/Button.vue";

const auth = useAuthStore()
const route = useRoute()

const isSidebarOpen = inject('sidebarState', ref(false))

// Menu items.
const items = [
  {
    title: "Dashboard",
    url: "/admin",
    icon: House,
  },
  {
    title: "Users",
    url: "/users",
    icon: UsersRound,
  },
  {
    title: "Reports",
    url: "/reports",
    icon: Files,
  },
  {
    title: "Feedbacks",
    url: "/feedbacks",
    icon: MessageSquareText,
  },
  {
    title: "Logs",
    url: "/logs",
    icon: Logs,
  },
  {
    title: "Settings",
    url: "/settings",
    icon: UserRoundCog,
  },
  {
    title: "Logout",
    url: "/logout",
    icon: LogOut,
  }
];

const navigate = (url: string) => {
  router.push(url)
  isSidebarOpen.value = false
}
</script>

<template>
  <Sidebar v-if="route.path !== '/forgot-password' && route.path !== '/' && route.path !== '/dashboard'" v-model:open="isSidebarOpen" class="flex flex-col h-screen w-1/6">
    <SidebarContent class="flex-1 flex flex-col">
      <SidebarGroup>
        <SidebarGroupLabel class="mt-10 w-full flex flex-col gap-5 mb-5">
          <img src="@/assets/logo-w-outline.png" alt="">
          <Separator class="dark:bg-gray-200/50"/>
        </SidebarGroupLabel>
        <SidebarGroupContent class="flex-1 mt-4">
          <SidebarMenu>
            <SidebarMenuItem v-for="item in items.slice(0, -1)" :key="item.title" class="mt-2">
              <div asChild  class="hover:text-[#E7E7E7] active:text-white py-2">
                <a @click="navigate(item.url)" class="flex items-center gap-4" 
                   :class="route.path === item.url ? 'text-yellow-300 hover:text-yellow-300 active:text-yellow-300 hover:bg-transparent cursor-pointer active:bg-transparent' : 'text-[#E7E7E7] hover:bg-transparent cursor-pointer active:bg-transparent'">
                  <component :is="item.icon" class="size-8" />
                  <span class="text-xl ">{{item.title}}</span>
                </a>
              </div>
            </SidebarMenuItem>  
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
      <!-- Logout at bottom -->
      <SidebarGroup class="mt-auto mb-4">
        <Separator class="dark:bg-gray-200/50"/>
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <div asChild  class="hover:text-[#E7E7E7] active:text-white hover:bg-transparent">
                <Button @click="auth.logout" 
                    class="flex gap-4 hover:text-white bg-transparent"
                    :disabled="auth.isLoading"
                   :class="route.path === items[items.length-1].url ? 'text-yellow-300 hover:text-yellow-300 active:text-yellow-300 hover:bg-transparent cursor-pointer active:bg-transparent' : 'text-[#E7E7E7] hover:bg-transparent cursor-pointer active:bg-transparent'">
                   <Loader2 v-if="auth.isLoading" class="size-6 animate-spin" />
                   <component v-else :is="items[items.length-1].icon" class="size-6" />

                  <span class="text-xl ">{{items[items.length-1].title}}</span>
                </Button>
              </div>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
  </Sidebar>
</template>