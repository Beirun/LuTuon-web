<script lang="ts" setup>
import { useAuthStore } from '@/stores/auth'
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { Bell, Triangle, ShieldUser, SquareUserRound, LockKeyhole } from 'lucide-vue-next'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
const route = useRoute()
const auth = useAuthStore();

const items = [
  {
    title: 'Account Overview',
    icon: ShieldUser,
    url: '/dashboard',
  },
  {
    title: 'Personal Information',
    icon: SquareUserRound,
    url: '/personal-information',
  },
  {
    title: 'Password',
    icon: LockKeyhole,
    url: '/password',
  },
]

const manage = ref(false)

const handleManage = () => {
  manage.value = !manage.value
}
</script>

<template>
  <div class="w-screen h-screen flex flex-col justify-center">
    <!-- header -->
    <div class="w-full h-1/10 flex justify-between items-center px-10 shadow-xs">
      <div><img src="@/assets/logo.png" alt="" /></div>
      <div @click="auth.logout" class="flex w-full h-full justify-end items-center gap-5">
        <component :is="Bell" class="fill-[#3A3A3A] text-[#3A3A3A]" />
        <div class="h-1/2 px-3 rounded-md border border-[#D6D6D6] flex items-center gap-2">
          {{ auth.userInfo.userEmail }}
          <component :is="Triangle" height="15" class="rotate-180 fill-[#3A3A3A] text-[#3A3A3A]" />
        </div>
      </div>
    </div>

    <!-- body -->
    <div class="w-full h-full pt-10 flex flex-col items-center gap-5">
      <div class="w-1/2 bg-white flex justify-between items-center border-b border-[#D6D6D6] pb-5">
        <p class="text-2xl font-bold">Account Center</p>
        <div class="h-full p-3 rounded-md border border-[#D6D6D6] flex items-center">
          ID: 11223344
        </div>
      </div>
      <div class="w-1/2 h-3/4 flex justify-between gap-5">
        <div class="w-1/3 border-r border-[#D6D6D6]">
          <div v-for="item in items" class="my-10">
            <a
              @click=""
              :class="
                route.path === item.url
                  ? 'text-[#F8C600] hover:text-yellow-300 active:text-yellow-300 hover:bg-transparent cursor-pointer active:bg-transparent flex gap-5'
                  : 'text-[#515151] hover:bg-transparent cursor-pointer active:bg-transparent flex gap-5'
              "
            >
              <component :is="item.icon" class="size-6" />
              <span class="text-xl">{{ item.title }}</span>
            </a>
          </div>
        </div>
        <div class="w-2/3 flex flex-col gap-5">
          <div class="w-full border border-[#D6D6D6] rounded-xl">
            <div class="flex justify-between border-b p-3">
              <p class="text-lg font-bold">Personal Information</p>
              <Button
                @click="handleManage"
                class="bg-transparent p-0 hover:bg-transparent cursor-pointer shadow-none text-[#F8C600]"
                >Manage</Button
              >
            </div>
            <div>
              <Table>
                <TableBody>
                  <TableRow class="flex justify-between px-5">
                    <TableCell class="h-[6vh] text-black text-center">Username</TableCell>
                    <TableCell class="text-black text-center">
                      <Input
                        :disabled="!manage"
                        :value="auth.userInfo.userName"
                        placeholder="kenji"
                        class="text-right p-0 w-full border-0 shadow-none focus:outline-none"
                        :class="manage ? 'text-black' : 'text-gray-400'"
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow class="flex justify-between px-5">
                    <TableCell class="h-[6vh] text-black text-center">Birthdate</TableCell>
                    <TableCell class="text-black text-center">
                      {{ 
                        new Date(auth.userInfo.userDob)
                          .toLocaleString("en-US", {
                            year: "numeric",
                            month: "2-digit",
                            day: "2-digit",
                        }) 
                      }}
                  </TableCell>
                  </TableRow>
                  <TableRow class="flex justify-between px-5">
                    <TableCell class="h-[6vh] text-black text-center">Email Address</TableCell>
                    <TableCell class="text-black text-center">{{ auth.userInfo.userEmail }}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </div>
          <div class="w-full h-1/3 border border-[#D6D6D6] rounded-xl"></div>
        </div>
      </div>
    </div>

    <!-- footer -->
    <div></div>
  </div>
</template>
