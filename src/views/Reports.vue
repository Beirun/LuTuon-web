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
                  <TableHead class="font-bold text-black text-center">Account ID</TableHead>
                  <TableHead class="font-bold text-black text-center">Username</TableHead>
                  <TableHead class="font-bold text-black text-center">Attempt</TableHead>
                  <TableHead class="font-bold text-black text-center">Point</TableHead>
                  <TableHead class="font-bold text-black text-center">Food</TableHead>
                  <TableHead class="font-bold text-black text-center">Date</TableHead>
                  <TableHead class="font-bold text-black text-center">Duration</TableHead>
                  <TableHead class="font-bold text-black text-center">Type</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell class="h-[6vh] text-black text-center">1001</TableCell>
                  <TableCell class=" text-black text-center">kenji</TableCell>
                  <TableCell class=" text-black text-center">3</TableCell>
                  <TableCell class=" text-black text-center">-</TableCell>
                  <TableCell class=" text-black text-center">Chicken Adobo</TableCell>
                  <TableCell class=" text-black text-center">07/17/25</TableCell>
                  <TableCell class=" text-black text-center">6 min 10 sec</TableCell>
                  <TableCell class=" text-black text-center">Tutorial</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
