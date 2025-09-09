<!-- @/views/Reports.vue -->
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
import { useReportStore } from '@/stores/report'
import { onBeforeMount, ref, computed } from 'vue'
import { diffMinutesSeconds, formatDateTime } from '@/plugins/date'

// Pagination components
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'

const reportStore = useReportStore()

// pagination state
const currentPage = ref(1)
const itemsPerPage = 10

const paginatedReports = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  return reportStore.reports.slice(start, start + itemsPerPage)
})

onBeforeMount(async () => {
  if (reportStore.reports.length === 0) await reportStore.fetchReports()
})
</script>

<template>
  <div class="min-h-screen w-full flex justify-end">
    <div class="flex flex-col p-4 md:p-6 lg:p-8 w-full md:w-5/6">
      <div class="md:p-10">
        <div class="flex justify-between mb-5 lg:mb-5">
          <p class="text-3xl font-bold">Reports</p>
        </div>
        <Separator class="text-[#DBDBE0] mb-6" />

        <div class="grid grid-cols-1 gap-6">
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
                  <TableHead class="font-bold text-foreground text-center">Point</TableHead>
                  <TableHead class="font-bold text-foreground text-center">Food</TableHead>
                  <TableHead class="font-bold text-foreground text-center">Date</TableHead>
                  <TableHead class="font-bold text-foreground text-center">Duration</TableHead>
                  <TableHead class="font-bold text-foreground text-center">Type</TableHead>
                </TableRow>
              </TableHeader>

              <!-- Skeleton while loading -->
              <TableBody v-if="reportStore.loading">
                <TableRow v-for="i in 5" :key="i">
                  <TableCell class="text-center"><Skeleton class="h-4 w-20 mx-auto" /></TableCell>
                  <TableCell class="text-center"><Skeleton class="h-4 w-24 mx-auto" /></TableCell>
                  <TableCell class="text-center"><Skeleton class="h-4 w-10 mx-auto" /></TableCell>
                  <TableCell class="text-center"><Skeleton class="h-4 w-10 mx-auto" /></TableCell>
                  <TableCell class="text-center"><Skeleton class="h-4 w-28 mx-auto" /></TableCell>
                  <TableCell class="text-center"><Skeleton class="h-4 w-24 mx-auto" /></TableCell>
                </TableRow>
              </TableBody>

              <!-- No reports -->
              <TableBody v-else-if="!reportStore.reports.length">
                <TableRow class="hover:bg-transparent">
                  <TableCell colspan="8" class="text-center text-foreground/80 py-36 text-3xl font-bold">
                    No Reports Found
                  </TableCell>
                </TableRow>
              </TableBody>

              <!-- Data rows -->
              <TableBody v-else>
                <TableRow v-for="r in paginatedReports" :key="r.attemptId">
                  <TableCell class="text-foreground text-center">{{ r.userName }}</TableCell>
                  <TableCell class="text-foreground text-center">{{ r.attemptPoint }}</TableCell>
                  <TableCell class="text-foreground text-center">{{ r.foodName }}</TableCell>
                  <TableCell class="text-foreground text-center">
                    {{ formatDateTime(r.attemptDate) }}
                  </TableCell>
                  <TableCell class="text-foreground text-center">
                    {{ diffMinutesSeconds(r.attemptDate, r.attemptDuration) }}
                  </TableCell>
                  <TableCell class="text-foreground text-center">{{ r.attemptType }}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </div>

        <!-- Pagination controls -->
        <div v-if="!reportStore.loading && reportStore.reports.length"  class="flex justify-center mt-6">
          <Pagination v-slot="{ page }"
            :items-per-page="itemsPerPage"
            :total="reportStore.reports.length"
            :default-page="1"
            v-model:page="currentPage"
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
              </template>

              <PaginationEllipsis :index="4" />

              <PaginationNext />
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </div>
  </div>
</template>
