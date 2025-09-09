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
import { onBeforeMount, ref, computed } from 'vue'
import { formatDate, formatDateTime } from '@/plugins/date'

// pagination imports
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'

const user = useUserStore()

const itemsPerPage = 10
const currentPage = ref(1)

onBeforeMount(async () => {
  if (user.users.length === 0) await user.fetchUsers()
})

const total = computed(() => user.users.length)
const totalPages = computed(() => Math.ceil(total.value / itemsPerPage))

const paginatedUsers = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  return user.users.slice(start, start + itemsPerPage)
})
</script>

<template>
  <div class="min-h-screen w-full flex justify-end">
    <div class="flex flex-col p-4 xs:pl-4 sm:pl-8 md:p-6 md:pr-2 md:pl-18 lg:p-8 w-full md:w-5/6 ">
      <div class="md:p-10">

        <div class="flex justify-between mb-5 lg:mb-5">
          <p class="text-3xl font-bold">User List</p>
        </div>
        <Separator class="text-[#DBDBE0] mb-6" />
        <div class="grid grid-cols-1 gap-6">
          <div class="w-full max-h-[78vh] overflow-auto outline-1 
                   dark:outline-gray-200/10 dark:bg-[#1e1e1e]/10 
                   bg-[#e8e8e8]/10 rounded-2xl p-5 scrollbar-styled">
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
                <TableRow v-for="u in paginatedUsers" :key="u.userId">
                  <TableCell class="h-[6vh] text-foreground text-center">{{ u.userName }}</TableCell>
                  <TableCell class="text-foreground text-center">{{ u.userEmail }}</TableCell>
                  <TableCell class="text-foreground text-center">{{ formatDate(u.userDob) }}</TableCell>
                  <TableCell class="text-foreground text-center">{{ u.roleName }}</TableCell>
                  <TableCell class="text-foreground text-center">{{ formatDateTime(u.dateCreated) }}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>

          <!-- Pagination -->
          <div v-if="totalPages > 1" class="mt-4 flex justify-center">
            <Pagination v-slot="{ page }" :items-per-page="itemsPerPage" :total="total" :default-page="1" v-model:page="currentPage">
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
