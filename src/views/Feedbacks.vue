<!-- @/views/Feedback.vue -->
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
import { useFeedbackStore } from '@/stores/feedback'
import { onBeforeMount, ref, computed } from 'vue'
import { formatDateTime } from '@/plugins/date'

// Pagination components
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'

const feedbackStore = useFeedbackStore()

// Pagination state
const currentPage = ref(1)
const itemsPerPage = 10

const total = computed(() => feedbackStore.feedbacks.length)

const paginatedFeedbacks = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  return feedbackStore.feedbacks.slice(start, start + itemsPerPage)
})

onBeforeMount(async () => {
  if (feedbackStore.feedbacks.length === 0) await feedbackStore.fetchFeedbacks()
})
</script>

<template>
  <div class="min-h-screen w-full flex justify-end">
    <div class="flex flex-col p-4 xs:pl-4 sm:pl-8 md:p-6 md:pr-2 md:pl-18 lg:p-8 w-full md:w-5/6 ">
      <div class="md:p-10">

        <div class="flex justify-between mb-5 lg:mb-5">
          <p class="text-3xl font-bold">Feedbacks</p>
        </div>
        <Separator class="text-[#DBDBE0] mb-6" />

        <div class="grid grid-cols-1 gap-6">
          <div
            class="w-full max-h-[78vh] overflow-auto outline-1 
                   dark:outline-gray-200/10 dark:bg-[#1e1e1e]/10 
                   bg-[#e8e8e8]/10 rounded-2xl p-5 scrollbar-styled"
          >
            <Table>
              <TableCaption></TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead class="font-bold text-foreground text-center">Username</TableHead>
                  <TableHead class="font-bold text-foreground text-center">Email</TableHead>
                  <TableHead class="font-bold text-foreground text-center">Date</TableHead>
                  <TableHead class="font-bold text-foreground text-center">Message</TableHead>
                </TableRow>
              </TableHeader>

              <!-- Skeleton while loading -->
              <TableBody v-if="feedbackStore.loading">
                <TableRow v-for="i in 5" :key="i">
                  <TableCell class="text-center"><Skeleton class="h-4 w-24 mx-auto" /></TableCell>
                  <TableCell class="text-center"><Skeleton class="h-4 w-32 mx-auto" /></TableCell>
                  <TableCell class="text-center"><Skeleton class="h-4 w-28 mx-auto" /></TableCell>
                  <TableCell class="text-center"><Skeleton class="h-4 w-40 mx-auto" /></TableCell>
                </TableRow>
              </TableBody>

              <!-- No feedbacks -->
              <TableBody v-else-if="!feedbackStore.feedbacks.length">
                <TableRow class="hover:bg-transparent">
                  <TableCell colspan="5" class="text-center text-foreground py-36 text-3xl font-bold">
                    No Feedbacks Found
                  </TableCell>
                </TableRow>
              </TableBody>

              <!-- Data rows -->
              <TableBody v-else>
                <TableRow v-for="f in paginatedFeedbacks" :key="f.feedbackId">
                  <TableCell class="text-foreground text-center">{{ f.userName }}</TableCell>
                  <TableCell class="text-foreground text-center">{{ f.userEmail }}</TableCell>
                  <TableCell class="text-foreground text-center">{{ formatDateTime(f.feedbackDate) }}</TableCell>
                  <TableCell class="text-foreground text-center">{{ f.feedbackMessage }}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>

          <!-- Pagination -->
          <div v-if="!feedbackStore.loading && feedbackStore.feedbacks.length" class="flex justify-center mt-4">
            <Pagination v-slot="{ page }" :items-per-page="itemsPerPage" :total="total" v-model:page="currentPage">
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
  </div>
</template>
