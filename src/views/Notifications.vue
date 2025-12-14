<!-- eslint-disable vue/multi-word-component-names -->
<script lang="ts" setup>
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { useNotificationStore } from '@/stores/notification'
import { ref, computed } from 'vue'
import { formatDateTime } from '@/plugins/date'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from '@/components/ui/dropdown-menu'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import { MoreVertical, CheckCheck } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'

const notificationStore = useNotificationStore()
async function markAsRead(id: string) {
  await notificationStore.updateNotificationStatus(id, 'read')
}

async function markAllAsRead(){
  await notificationStore.updateAllNotificationStatus()
}

async function remove(id: string) {
  await notificationStore.deleteNotification(id)
}
// pagination state
const itemsPerPage = 10
const currentPage = ref(1)

const paginatedNotifications = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  return notificationStore.notifications.slice(start, start + itemsPerPage)
})
const totalPages = computed(() => Math.ceil(paginatedNotifications.value.length / itemsPerPage))
</script>

<template>
  <div class="min-h-screen w-full flex justify-end">
    <div class="flex flex-col p-4 xs:pl-4 sm:pl-8 md:p-6 md:pr-2 md:pl-18 lg:p-8 w-full md:w-5/6">
      <div class="md:p-10">
        <div class="flex justify-between mb-5 lg:mb-5">
          <p class="text-3xl font-bold">Notifications</p>
          <Button @click="markAllAsRead()">Mark All as Read <CheckCheck/></Button>
        </div>
        <Separator class="text-[#DBDBE0] mb-6" />

        <div class="grid grid-cols-1 gap-4">
          <!-- Skeleton while loading -->
          <template v-if="notificationStore.loading">
            <div
              v-for="i in 5"
              :key="i"
              class="rounded-xl border p-4 bg-muted/30 flex flex-col gap-2"
            >
              <Skeleton class="h-5 w-40" />
              <Skeleton class="h-4 w-64" />
              <Skeleton class="h-4 w-28" />
            </div>
          </template>

          <!-- No notifications -->
          <template v-else-if="!notificationStore.notifications.length">
            <div class="rounded-xl border p-10 text-center text-foreground/80 text-2xl font-bold">
              No Notifications Found
            </div>
          </template>

          <!-- Notification cards -->
          <template v-else>
            <div
              v-for="n in paginatedNotifications"
              :key="n.notificationId"
              class="rounded-xl border p-5 bg-background shadow-sm hover:shadow-md transition flex flex-col gap-2"
            >
              <div class="flex justify-between items-center">
                <div class="flex gap-2">
                  <p class="font-semibold text-xl">{{ n.notificationTitle }}</p>
                  <span
                    class="px-2 py-1 text-xs rounded-full"
                    :class="
                      n.notificationStatus === 'unread'
                        ? 'bg-red-500/10 text-red-600 dark:text-red-400'
                        : 'bg-green-500/10 text-green-600 dark:text-green-400'
                    "
                  >
                    {{ n.notificationStatus }}
                  </span>
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
              <p class="text-base text-muted-foreground">
                {{ n.notificationMessage }}
              </p>
              <span class="text-xs text-gray-400">
                {{ formatDateTime(n.notificationDate) }}
              </span>
            </div>
          </template>
        </div>

        <!-- Pagination -->
        <div v-if="totalPages > 1" class="flex justify-center mt-6">
          <Pagination
            v-slot="{ page }"
            :items-per-page="itemsPerPage"
            :total="totalPages"
            :default-page="currentPage"
            @update:page="currentPage = $event"
          >
            <PaginationContent v-slot="{ items }">
              <PaginationPrevious />
              <template v-for="(item, index) in items" :key="index">
                <PaginationItem
                  v-if="item.type === 'page'"
                  :value="item.value"
                  :is-active="item.value === page"
                >
                  {{ item.value }}
                </PaginationItem>
                <PaginationEllipsis v-else :index="index" />
              </template>
              <PaginationNext />
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </div>
  </div>
</template>
