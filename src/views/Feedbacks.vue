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
import { onBeforeMount } from 'vue'
import { formatDateTime } from '@/plugins/date'

const feedbackStore = useFeedbackStore()

onBeforeMount(async () => {
  if (feedbackStore.feedbacks.length === 0) await feedbackStore.fetchFeedbacks()
})
</script>

<template>
  <div class="w-screen h-screen flex lg:justify-end">
    <div class="lg:w-5/6 w-full md:w-full h-full flex justify-center items-center right-0">
      <div class="w-7/8 h-7/8">
        <div class="flex justify-between mb-10 lg:mb-5">
          <p class="text-3xl font-bold">Feedbacks</p>
        </div>
        <Separator class="text-[#DBDBE0] mb-10 lg:mb-0" />
        <div class="w-full h-full flex flex-col justify-center">
          <div class="w-full h-9/10 outline-1 dark:outline-gray-200/10 dark:bg-[#1e1e1e]/10 bg-[#e8e8e8]/10 rounded-2xl p-5 overflow-x-auto">
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
                <TableRow v-for="f in feedbackStore.feedbacks" :key="f.feedbackId">
                  <TableCell class="text-foreground text-center">{{ f.userName }}</TableCell>
                  <TableCell class="text-foreground text-center">{{ f.userEmail }}</TableCell>
                  <TableCell class="text-foreground text-center">{{ formatDateTime(f.feedbackDate) }}</TableCell>
                  <TableCell class="text-foreground text-center">{{ f.feedbackMessage }}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
