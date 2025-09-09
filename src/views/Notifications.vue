<!-- @/views/Notifications.vue -->
<script lang="ts" setup>
import SideBar from '@/components/SideBar.vue'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { useNotificationStore } from '@/stores/notification'
import { onBeforeMount, ref, computed } from 'vue'
import { formatDateTime } from '@/plugins/date'

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'

const notificationStore = useNotificationStore()

// pagination state
const itemsPerPage = 10
const currentPage = ref(1)

const totalPages = computed(() =>
  Math.ceil(notificationStore.notifications.length / itemsPerPage)
)

const paginatedNotifications = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  return notificationStore.notifications.slice(start, start + itemsPerPage)
})


</script>

<template>
  <div class="min-h-screen w-full flex justify-end">
    <div class="flex flex-col p-4 xs:pl-4 sm:pl-8 md:p-6 md:pr-2 md:pl-18 lg:p-8 w-full md:w-5/6">
      <div class="md:p-10">
        <div class="flex justify-between mb-5 lg:mb-5">
          <p class="text-3xl font-bold">Notifications</p>
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
            <div
              class="rounded-xl border p-10 text-center text-foreground/80 text-2xl font-bold"
            >
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
                <p class="font-semibold text-lg">{{ n.notificationTitle }}</p>
                <span
                  class="px-2 py-1 text-xs rounded-full"
                  :class="n.notificationStatus === 'unread'
                    ? 'bg-red-500/10 text-red-600 dark:text-red-400'
                    : 'bg-green-500/10 text-green-600 dark:text-green-400'"
                >
                  {{ n.notificationStatus }}
                </span>
              </div>
              <p class="text-sm text-muted-foreground">
                {{ n.notificationMessage }}
              </p>
              <span class="text-xs text-gray-400">
                {{ formatDateTime(n.notificationDate) }}
              </span>
            </div>
          </template>
        </div>

        <!-- Pagination -->
        <div
          v-if="!notificationStore.loading && notificationStore.notifications.length"
          class="flex justify-center mt-6"
        >
          <Pagination
            v-slot="{ page }"
            :items-per-page="itemsPerPage"
            :total="notificationStore.notifications.length"
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
