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
          <p class="text-3xl font-bold">User List</p>
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
                  <TableHead class="font-bold text-black text-center">Birthdate</TableHead>
                  <TableHead class="font-bold text-black text-center">Email Address</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell class="h-[6vh] text-black text-center">1001</TableCell>
                  <TableCell class=" text-black text-center">kenji</TableCell>
                  <TableCell class=" text-black text-center">August 15, 2003</TableCell>
                  <TableCell class=" text-black text-center">kennethjamesbatuhan@gmail.com</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
