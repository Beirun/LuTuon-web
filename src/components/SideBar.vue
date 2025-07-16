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
import {useRoute, useRouter} from "vue-router"
import { House, UsersRound, Files, MessageSquareText, Logs, UserRoundCog, LogOut } from 'lucide-vue-next';

const route = useRoute()
const router = useRouter()

// Menu items.
const items = [
  {
    title: "Dashboard",
    url: "/dashboard",
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
</script>

<template>
  <Sidebar class="flex flex-col h-screen">
    <SidebarContent class="flex-1 flex flex-col">
      <SidebarGroup>
        <SidebarGroupLabel class="mt-10">
          <img src="@/assets/logo.png" alt="">
        </SidebarGroupLabel>
        <SidebarGroupContent class="flex-1">
          <SidebarMenu>
            <SidebarMenuItem v-for="item in items.slice(0, -1)" :key="item.title">
              <SidebarMenuButton asChild  class="hover:text-[#E7E7E7] active:text-white">
                <a @click="router.push(item.url)" 
                   :class="route.path === item.url ? 'text-yellow-300 hover:text-yellow-300 active:text-yellow-300 hover:bg-transparent cursor-pointer active:bg-transparent' : 'text-[#E7E7E7] hover:bg-transparent cursor-pointer active:bg-transparent'">
                  <component :is="item.icon" class="size-6" />
                  <span class="text-xl ">{{item.title}}</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>

      <!-- Logout at bottom -->
      <SidebarGroup class="mt-auto">
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild  class="hover:text-[#E7E7E7] active:text-white">
                <a @click="router.push(items[items.length-1].url)" 
                   :class="route.path === items[items.length-1].url ? 'text-yellow-300 hover:text-yellow-300 active:text-yellow-300 hover:bg-transparent cursor-pointer active:bg-transparent' : 'text-[#E7E7E7] hover:bg-transparent cursor-pointer active:bg-transparent'">
                  <component :is="items[items.length-1].icon" class="size-6" />
                  <span class="text-xl ">{{items[items.length-1].title}}</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
  </Sidebar>
</template>