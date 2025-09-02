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
import { useUserStore } from '@/stores/user'
import { onBeforeMount } from 'vue'
import { formatDate, formatDateTime } from '@/plugins/date'

const user = useUserStore()

onBeforeMount(async () => {
  if (user.users.length === 0) await user.fetchUsers()
})
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
          <div class="w-full h-9/10 outline-1 dark:outline-gray-200/10 dark:bg-[#1e1e1e]/10 bg-[#e8e8e8]/10 rounded-2xl p-5 overflow-x-auto">
            <Table>
              <TableCaption></TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead class="font-bold text-foreground text-center">Username</TableHead>
                  <TableHead class="font-bold text-foreground text-center">Email Address</TableHead>
                  <TableHead class="font-bold text-foreground text-center">Birthdate</TableHead>
                  <TableHead class="font-bold text-foreground text-center">Role</TableHead>
                  <TableHead class="font-bold text-foreground text-center">Date Joined</TableHead>
                </TableRow>
              </TableHeader>

              <!-- Skeleton while loading -->
              <TableBody v-if="user.loading">
                <TableRow v-for="i in 5" :key="i">
                  <TableCell class="h-[6vh] text-center">
                    <Skeleton class="h-4 w-24 mx-auto" />
                  </TableCell>
                  <TableCell class="text-center">
                    <Skeleton class="h-4 w-36 mx-auto" />
                  </TableCell>
                  <TableCell class="text-center">
                    <Skeleton class="h-4 w-28 mx-auto" />
                  </TableCell>
                  <TableCell class="text-center">
                    <Skeleton class="h-4 w-20 mx-auto" />
                  </TableCell>
                  <TableCell class="text-center">
                    <Skeleton class="h-4 w-40 mx-auto" />
                  </TableCell>
                </TableRow>
              </TableBody>

              <!-- No users -->
              <TableBody v-else-if="!user.users.length">
                <TableRow class="hover:bg-transparent">
                  <TableCell colspan="5" class="text-center text-foreground/80 py-36">
                    No Users Found
                  </TableCell>
                </TableRow>
              </TableBody>

              <!-- Data rows -->
              <TableBody v-else>
                <TableRow v-for="u in user.users" :key="u.userId">
                  <TableCell class="h-[6vh] text-foreground text-center">{{ u.userName }}</TableCell>
                  <TableCell class="text-foreground text-center">{{ u.userEmail }}</TableCell>
                  <TableCell class="text-foreground text-center">{{
                    formatDate(u.userDob)
                  }}</TableCell>
                  <TableCell class="text-foreground text-center">{{ u.roleName }}</TableCell>
                  <TableCell class="text-foreground text-center">{{
                    formatDateTime(u.dateCreated)
                  }}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
