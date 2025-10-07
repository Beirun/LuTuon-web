<script setup lang="ts">
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarFooter,
} from '@/components/ui/sidebar'
import { ref, inject, onBeforeMount, computed } from 'vue'
import { useRoute } from 'vue-router'
import {
  Triangle,
  House,
  UsersRound,
  Files,
  MessageSquareText,
  Logs,
  Bell,
  UserRound,
  Settings,
  LogOut,
  Loader2,
  Sun,
  Moon,
  Palette,
} from 'lucide-vue-next'
import { Separator } from '@/components/ui/separator'
import router from '@/router'
import { useAuthStore } from '@/stores/auth'
import Button from './ui/button/Button.vue'
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover'
import { HoverCard, HoverCardTrigger, HoverCardContent } from '@/components/ui/hover-card'
import { useColorMode } from '@vueuse/core'
import { useNotificationStore } from '@/stores/notification'

const auth = useAuthStore()
const route = useRoute()
const isSidebarOpen = inject('sidebarState', ref(false))

const mode = useColorMode({ disableTransition: false })

const popoverOpen = ref(false) // control for Popover
const hoverOpen = ref(false) // control for HoverCard

const items = [
  { title: 'Dashboard', url: '/admin', icon: House },
  { title: 'Users', url: '/users', icon: UsersRound },
  { title: 'Reports', url: '/reports', icon: Files },
  { title: 'Feedbacks', url: '/feedbacks', icon: MessageSquareText },
  { title: 'Logs', url: '/logs', icon: Logs },
  { title: 'Notifications', url: '/notifications', icon: Bell },
  { title: 'Account', url: '/account', icon: UserRound },
]

const navigate = (url: string) => {
  router.push(url)
  isSidebarOpen.value = false
  popoverOpen.value = false
  hoverOpen.value = false
}

const doLogout = async () => {
  await auth.logout()
  popoverOpen.value = false
  hoverOpen.value = false
}

const setMode = (val: 'light' | 'dark' | 'auto') => {
  mode.value = val
  hoverOpen.value = false
  popoverOpen.value = false
}
const notification = useNotificationStore()
onBeforeMount(async () => await notification.fetchNotifications())

const unreadCount = computed(
  () => notification.notifications.filter((n) => n.notificationStatus !== 'read').length,
)
</script>

<template>
  <Sidebar
    v-if="
      route.path === '/admin' ||
      route.path === '/users' ||
      route.path === '/reports' ||
      route.path === '/feedbacks' ||
      route.path === '/logs' ||
      route.path === '/notifications' ||
      route.path === '/settings'
    "
    v-model:open="isSidebarOpen"
    class="flex flex-col h-screen w-1/6"
  >
    <SidebarHeader>
      <SidebarGroupLabel class="mt-10 w-full flex flex-col gap-5 mb-5">
        <img src="@/assets/logo-w-outline.png" alt="" />
      </SidebarGroupLabel>
      <Separator class="dark:bg-gray-200/50 mt-4" />
    </SidebarHeader>
    <SidebarContent class="flex-1 flex flex-col">
      <SidebarGroup v-for="item in items.slice(0, -1)" :key="item.title" class="mb-2">
        <div
          asChild
          class="hover:text-[#E7E7E7] active:text-white py-2 w-full pl-[clamp(1.5rem,1.75vw,40px)] mt-2 hover:brightness-120"
        >
          <a
            @click="navigate(item.url)"
            class="flex items-center gap-4"
            :class="
              route.path === item.url
                ? 'text-yellow-300 hover:text-yellow-300 active:text-yellow-300 hover:bg-transparent cursor-pointer active:bg-transparent'
                : 'text-[#E7E7E7] hover:bg-transparent cursor-pointer active:bg-transparent'
            "
          >
            <div class="relative">
              <component :is="item.icon" class="size-8" />
              <span
                v-if="unreadCount > 0 && item.title === 'Notifications'"
                class="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center px-1"
              >
                {{ unreadCount }}
              </span>
            </div>
            <span class="text-xl">{{ item.title }}</span>
          </a>
        </div>
      </SidebarGroup>

      <SidebarFooter class="mt-auto mb-4">
        <Separator class="dark:bg-gray-200/50" />
        <Popover v-model:open="popoverOpen">
          <PopoverTrigger as-child>
            <div
              class="flex gap-4 hover:text-white w-full justify-start py-2 pl-[clamp(1.5rem,1.75vw,40px)] mt-2 hover:brightness-120"
              :class="
                route.path === items[items.length - 1].url
                  ? 'text-yellow-300 hover:text-yellow-300 active:text-yellow-300 hover:bg-transparent cursor-pointer active:bg-transparent'
                  : 'text-[#E7E7E7] hover:bg-transparent cursor-pointer active:bg-transparent'
              "
            >
              <component :is="items[items.length - 1].icon" class="size-6" />
              <span class="text-xl">{{ items[items.length - 1].title }}</span>
            </div>
          </PopoverTrigger>

          <PopoverContent side="right" class="w-44 p-2 ml-2 mb-4 bg-[#242629] dark:bg-[#121210]">
            <div class="flex flex-col gap-2">
              <Button
                @click="navigate('/settings')"
                class="flex gap-2 justify-start bg-transparent font-normal focus-visible:ring-0 text-[#E7E7E7] dark:hover:text-background"
              >
                <Settings class="size-5" />
                <span>Settings</span>
              </Button>

              <!-- Appearance Hover -->
              <HoverCard v-model:open="hoverOpen">
                <HoverCardTrigger as-child>
                  <Button
                    class="flex gap-2 justify-start bg-transparent font-normal focus-visible:ring-0 text-[#E7E7E7] dark:hover:text-background"
                  >
                    <Palette class="size-5" />
                    <span>Appearance</span>
                    <Triangle class="size-3 rotate-90 ml-2 mt-1" />
                  </Button>
                </HoverCardTrigger>
                <HoverCardContent side="right" class="w-40 p-2 ml-2 bg-[#242629] dark:bg-[#121210]">
                  <div class="flex flex-col gap-2">
                    <Button
                      @click="setMode('light')"
                      class="flex gap-2 justify-start bg-transparent font-normal text-[#E7E7E7] dark:hover:text-background"
                    >
                      <Sun class="size-5" />
                      <span>Light</span>
                    </Button>
                    <Button
                      @click="setMode('dark')"
                      class="flex gap-2 justify-start bg-transparent font-normal text-[#E7E7E7] dark:hover:text-background"
                    >
                      <Moon class="size-5" />
                      <span>Dark</span>
                    </Button>
                    <Button
                      @click="setMode('auto')"
                      class="flex gap-2 justify-start bg-transparent font-normal text-[#E7E7E7] dark:hover:text-background"
                    >
                      <Palette class="size-5" />
                      <span>System</span>
                    </Button>
                  </div>
                </HoverCardContent>
              </HoverCard>

              <Button
                @click="doLogout"
                :disabled="auth.isLoading"
                class="flex gap-2 justify-start bg-transparent font-normal focus-visible:ring-0 text-[#E7E7E7] dark:hover:text-background"
              >
                <Loader2 v-if="auth.isLoading" class="size-5 animate-spin" />
                <LogOut v-else class="size-5" />
                <span>Logout</span>
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </SidebarFooter>
    </SidebarContent>
  </Sidebar>
</template>
