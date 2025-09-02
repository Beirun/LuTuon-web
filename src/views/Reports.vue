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
import { onBeforeMount } from 'vue'
import { diffMinutesSeconds, formatDateTime } from '@/plugins/date'
const reportStore = useReportStore()

onBeforeMount(async () => {
  if (reportStore.reports.length === 0) await reportStore.fetchReports()
})
</script>

<template>
  <div class="w-screen h-screen flex lg:justify-end">
    <div class="lg:w-5/6 w-full md:w-full h-full flex justify-center items-center right-0">
      <div class="w-7/8 h-7/8">
        <div class="flex justify-between mb-10 lg:mb-5">
          <p class="text-3xl font-bold">Reports</p>
        </div>
        <Separator class="text-[#DBDBE0] mb-10 lg:mb-0" />
        <div class="w-full h-full flex flex-col justify-center">
          <div class="w-full h-9/10 outline-1 rounded-2xl p-5 overflow-x-auto">
            <Table>
              <TableCaption></TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead class="font-bold text-black text-center">Username</TableHead>
                  <TableHead class="font-bold text-black text-center">Point</TableHead>
                  <TableHead class="font-bold text-black text-center">Food</TableHead>
                  <TableHead class="font-bold text-black text-center">Date</TableHead>
                  <TableHead class="font-bold text-black text-center">Duration</TableHead>
                  <TableHead class="font-bold text-black text-center">Type</TableHead>
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
                <TableRow>
                  <TableCell colspan="8" class="text-center text-gray-500 py-16 text-3xl font-bold">
                    No Reports Found
                  </TableCell>
                </TableRow>
              </TableBody>

              <!-- Data rows -->
              <TableBody v-else>
                <TableRow v-for="r in reportStore.reports" :key="r.attemptId">
                  <TableCell class="text-black text-center">{{ r.userName }}</TableCell>
                  <TableCell class="text-black text-center">{{ r.attemptPoint }}</TableCell>
                  <TableCell class="text-black text-center">{{ r.foodName }}</TableCell>
                  <TableCell class="text-black text-center">{{
                    formatDateTime(r.attemptDate)
                  }}</TableCell>
                  <TableCell class="text-black text-center">
                    {{ diffMinutesSeconds(r.attemptDate,r.attemptDuration) }}
                  </TableCell>
                  <TableCell class="text-black text-center">{{ r.attemptType }}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
