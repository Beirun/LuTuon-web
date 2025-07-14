<script lang="ts" setup>
import { Separator } from '@/components/ui/separator'
import { Icon } from '@iconify/vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
</script>

<template>
  <div class="w-1/6 h-screen bg-[#242629] flex flex-col items-center">
    <div class="w-7/10 h-full flex flex-col items-center py-8 gap-10">
      <img src="@/assets/logo.png" alt="" />
      <Separator />
      <div class="w-full h-full flex flex-col justify-between">
        <div class="flex flex-col gap-10">
          <div class="flex items-center cursor-pointer" @click="router.push('/dashboard')">
            <Icon
              icon="material-symbols:home-rounded"
              class="text-4xl"
              :class="route.path === '/dashboard' ? 'text-yellow-300' : 'text-[#E7E7E7]'"
            />
            <div
              class="text-2xl ml-4"
              :class="route.path === '/dashboard' ? 'text-yellow-300' : 'text-[#E7E7E7]'"
            >
              Dashboard
            </div>
          </div>
          <div class="flex items-center cursor-pointer" @click="router.push('/users')">
            <Icon
              icon="solar:user-bold"
              class="text-4xl text-[#E7E7E7]"
              :class="route.path === '/users' ? 'text-yellow-300' : 'text-[#E7E7E7]'"
            />
            <div
              class="text-[#E7E7E7] text-2xl ml-4"
              :class="route.path === '/users' ? 'text-yellow-300' : 'text-[#E7E7E7]'"
            >
              Users
            </div>
          </div>
          <div class="flex items-center cursor-pointer">
            <Icon icon="iconoir:reports-solid" class="text-4xl text-[#E7E7E7]" />
            <div class="text-[#E7E7E7] text-2xl ml-4">Reports</div>
          </div>
          <div class="flex items-center cursor-pointer">
            <Icon icon="fluent:comment-24-filled" class="text-4xl text-[#E7E7E7]" />
            <div class="text-[#E7E7E7] text-2xl ml-4">Feedback</div>
          </div>
          <div class="flex items-center cursor-pointer">
            <Icon icon="icon-park-solid:log" class="text-4xl text-[#E7E7E7]" />
            <div class="text-[#E7E7E7] text-2xl ml-4">Logs</div>
          </div>
          <div class="flex items-center cursor-pointer">
            <Icon icon="ix:user-settings-filled" class="text-4xl text-[#E7E7E7]" />
            <div class="text-[#E7E7E7] text-2xl ml-4">Settings</div>
          </div>
        </div>
        <div>
          <div class="flex items-center cursor-pointer">
            <Icon icon="majesticons:door-exit" class="text-4xl text-[#E7E7E7]" />
            <div class="text-[#E7E7E7] text-2xl ml-4">Logout</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
