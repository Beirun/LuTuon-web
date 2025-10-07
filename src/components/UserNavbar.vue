<script setup lang="ts">
import { useNotificationStore } from '@/stores/notification'
import { computed, onBeforeMount } from 'vue'
import DarkModeSwitch from '@/components/DarkModeSwitch.vue'
import { timeAgo } from '@/plugins/date'
import { Triangle, MoreVertical, Bell, LogOut } from 'lucide-vue-next'
import { useAuthStore } from '@/stores/auth'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu'
import { Button } from './ui/button'
import router from '@/router'

const auth = useAuthStore()
const notification = useNotificationStore()
onBeforeMount(async () => notification.fetchNotifications())
const unreadCount = computed(
  () => notification.notifications.filter((n) => n.notificationStatus !== 'read').length,
)
const handleLogout = async () => {
  await auth.logout()
}
async function markAsRead(id: string) {
  await notification.updateNotificationStatus(id, 'read')
}

async function remove(id: string) {
  await notification.deleteNotification(id)
}
</script>

<template>
  <div class="w-full h-1/10 flex justify-between items-center px-2 lg:px-10 shadow-xs">
    <div @click="router.push('/overview')" class="cursor-pointer">
      <img src="@/assets/logo.png" alt="" />
    </div>
    <div class="flex w-full h-full justify-end items-center gap-5">
      <DarkModeSwitch />
      <DropdownMenu>
        <DropdownMenuTrigger as-child>
          <Button
            variant="outline"
            class="h-12 w-12 shadow-sm shadow-black/20 active:brightness-90 hover:brightness-95 duration-300 cursor-pointer relative"
          >
            <component :is="Bell" class="text-[#3A3A3A] dark:text-white" />
            <span
              v-if="unreadCount > 0"
              class="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center px-1"
            >
              {{ unreadCount }}
            </span>
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent class="w-[24rem] p-3">
          <div class="font-semibold text-center text-lg mb-2">Notifications</div>
          <hr class="mb-2 border-gray-200 dark:border-gray-700" />

          <div
            v-if="!notification.loading && notification.notifications.length"
            class="flex flex-col gap-2"
          >
            <div
              v-for="n in notification.notifications"
              :key="n.notificationId"
              class="flex flex-col gap-1 p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <div class="flex justify-between gap-1 items-start">
                <div class="flex">
                  <span class="font-medium">{{ n.notificationTitle }}</span>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger as-child>
                    <Button
                      variant="ghost"
                      size="icon"
                      class="w-6 h-6 p-0 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                    >
                      <component :is="MoreVertical" class="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent class="w-[1rem]">
                    <Button
                      variant="ghost"
                      @click.stop="markAsRead(n.notificationId)"
                      :disabled="n.notificationStatus === 'read'"
                      class="text-xs w-full flex justify-start"
                    >
                      Mark as Read
                    </Button>
                    <Button
                      variant="ghost"
                      @click.stop="remove(n.notificationId)"
                      class="text-red-500 text-xs w-full flex justify-start"
                    >
                      Delete
                    </Button>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <span class="text-sm text-gray-600 dark:text-gray-300 pr-4">
                {{ n.notificationMessage }}
              </span>
              <div class="flex">
                <small class="text-xs font-medium text-gray-500">{{
                  timeAgo(n.notificationDate)
                }}</small>
              </div>
            </div>
          </div>

          <div v-else-if="!notification.loading" class="text-center text-sm text-gray-500 py-2">
            No notifications
          </div>

          <div v-else class="text-center text-sm text-gray-500 py-2">Loading...</div>
        </DropdownMenuContent>
      </DropdownMenu>
      <DropdownMenu>
        <DropdownMenuTrigger as-child>
          <Button
            variant="outline"
            class="h-12 px-3 w-33 sm:w-fit font-light text-gray-600 dark:text-[#e8e8e8] shadow-sm shadow-black/20 rounded-md border border-border flex items-center gap-2 cursor-pointer active:brightness-90 hover:brightness-95 duration-300"
          >
            <span class="block sm:hidden"> {{ auth.userInfo.userEmail.slice(0, 10) }}... </span>
            <span class="hidden sm:block">
              {{ auth.userInfo.userEmail }}
            </span>

            <component
              :is="Triangle"
              height="15"
              class="rotate-180 fill-[#3A3A3A] text-[#3A3A3A] dark:text-[#e8e8e8] dark:fill-[#e8e8e8]"
            />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" class="sm:w-50">
          <DropdownMenuItem
            @click="handleLogout"
            class="cursor-pointer flex items-center justify-between text-base"
          >
            <span>Logout</span>
            <LogOut class="size-5 text-gray-400" />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  </div>
</template>
