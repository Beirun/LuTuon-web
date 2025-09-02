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
import { onBeforeMount } from 'vue'
import { formatDateTime } from '@/plugins/date'

const logStore = useLogStore()

onBeforeMount(async () => {
  if (logStore.logs.length === 0) await logStore.fetchLogs()
})
</script>

<template>
  <div class="w-screen h-screen flex lg:justify-end">
    <div class="lg:w-5/6 w-full md:w-full h-full flex justify-center items-center right-0">
      <div class="w-7/8 h-7/8">
        <div class="flex justify-between mb-10 lg:mb-5">
          <p class="text-3xl font-bold">Account Logs</p>
        </div>
        <Separator class="text-[#DBDBE0] mb-10 lg:mb-0" />
        <div class="w-full h-full flex flex-col justify-center">
          <div class="w-full h-9/10 outline-1 rounded-2xl p-5 overflow-x-auto">
            <Table>
              <TableCaption></TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead class="font-bold text-black text-center">Username</TableHead>
                  <TableHead class="font-bold text-black text-center">Email</TableHead>
                  <TableHead class="font-bold text-black text-center">Date</TableHead>
                  <TableHead class="font-bold text-black text-center">Description</TableHead>
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
                <TableRow>
                  <TableCell colspan="6" class="text-center text-gray-500 py-16 text-3xl font-bold">
                    No Logs Found
                  </TableCell>
                </TableRow>
              </TableBody>

              <!-- Data rows -->
              <TableBody v-else>
                <TableRow v-for="l in logStore.logs" :key="l.logId">
                  <TableCell class="text-black text-center">{{ l.userName }}</TableCell>
                  <TableCell class="text-black text-center">{{ l.userEmail }}</TableCell>
                  <TableCell class="text-black text-center">{{ formatDateTime(l.logDate) }}</TableCell>
                  <TableCell class="text-black text-center">{{ l.logDescription }}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
