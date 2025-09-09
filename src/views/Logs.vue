<!-- @/views/Logs.vue -->
<script lang="ts" setup>
import SideBar from '@/components/SideBar.vue'
import { Separator } from '@/components/ui/separator'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Skeleton } from '@/components/ui/skeleton'
import { useLogStore } from '@/stores/log'
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

const logStore = useLogStore()

// Pagination state
const itemsPerPage = 15
const currentPage = ref(1)

// total pages based on logs
const totalPages = computed(() =>
  Math.ceil(logStore.logs.length / itemsPerPage)
)

// slice logs for current page
const paginatedLogs = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  return logStore.logs.slice(start, start + itemsPerPage)
})

onBeforeMount(async () => {
  if (logStore.logs.length === 0) await logStore.fetchLogs()
})
</script>

<template>
  <div class="min-h-screen w-full flex justify-end">
    <div class="flex flex-col p-4 xs:pl-4 sm:pl-8 md:p-6 md:pr-2 md:pl-18 lg:p-8 w-full md:w-5/6 ">
      <div class="md:p-10">

        <div class="flex justify-between mb-5 lg:mb-5">
          <p class="text-3xl font-bold">Account Logs</p>
        </div>
        <Separator class="text-[#DBDBE0] mb-6" />

        <div class="grid grid-cols-1 gap-6">
          <!-- Table -->
          <div
            class="w-full max-h-[78vh] overflow-auto outline-1 
                   dark:outline-gray-200/10 dark:bg-[#1e1e1e]/10 
                   bg-[#e8e8e8]/10 rounded-2xl p-5"
          >
            <Table>
              <TableCaption></TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead class="font-bold text-foreground text-center">Username</TableHead>
                  <TableHead class="font-bold text-foreground text-center">Email</TableHead>
                  <TableHead class="font-bold text-foreground text-center">Date</TableHead>
                  <TableHead class="font-bold text-foreground text-center">Description</TableHead>
                </TableRow>
              </TableHeader>

              <!-- Skeleton while loading -->
              <TableBody v-if="logStore.loading">
                <TableRow v-for="i in 5" :key="i">
                  <TableCell class="text-center"><Skeleton class="h-4 w-24 mx-auto" /></TableCell>
                  <TableCell class="text-center"><Skeleton class="h-4 w-28 mx-auto" /></TableCell>
                  <TableCell class="text-center"><Skeleton class="h-4 w-24 mx-auto" /></TableCell>
                  <TableCell class="text-center"><Skeleton class="h-4 w-36 mx-auto" /></TableCell>
                </TableRow>
              </TableBody>

              <!-- No logs -->
              <TableBody v-else-if="!logStore.logs.length">
                <TableRow class="hover:bg-transparent">
                  <TableCell colspan="6" class="text-center text-foreground/80 py-36 text-3xl font-bold">
                    No Logs Found
                  </TableCell>
                </TableRow>
              </TableBody>

              <!-- Data rows -->
              <TableBody v-else>
                <TableRow v-for="l in paginatedLogs" :key="l.logId">
                  <TableCell class="text-foreground text-center">{{ l.userName }}</TableCell>
                  <TableCell class="text-foreground text-center">{{ l.userEmail }}</TableCell>
                  <TableCell class="text-foreground text-center">{{ formatDateTime(l.logDate) }}</TableCell>
                  <TableCell class="text-foreground text-center">{{ l.logDescription }}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>

          <!-- Pagination -->
          <div v-if="!logStore.loading && logStore.logs.length" class="flex justify-center mt-4">
            <Pagination
              v-slot="{ page }"
              :items-per-page="itemsPerPage"
              :total="logStore.logs.length"
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
  </div>
</template>
