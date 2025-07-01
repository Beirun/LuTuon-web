<script setup lang="ts">
import { MoveRight } from 'lucide-vue-next'
import { ref } from 'vue'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import LoginForm from '@/components/LoginForm.vue'
import RegisterForm from '@/components/RegisterForm.vue'
const isLoginOpen = ref(false)
const isRegisterOpen = ref(false)
const openRegisterDialog = () => {
  isLoginOpen.value = false;
  isRegisterOpen.value = true;
}
const openLoginDialog = () => {
  isLoginOpen.value = true
  isRegisterOpen.value = false
}
</script>

<template>
  <LoginForm :open="isLoginOpen" @update:open="val => isLoginOpen = val" @open-register-dialog="openRegisterDialog" />
  <RegisterForm :open="isRegisterOpen" @update:open="val => isRegisterOpen = val" @open-login-dialog="openLoginDialog" />

  <div class="max-w-screen min-h-screen overflow-x-hidden">
    <div
      class="w-screen h-20 bg-white absolute top-0 right-0 shadow-md shadow-black/10 flex items-center justify-between px-12">
      <img src="@/assets/logo.png" alt="" />
      <button @click="isLoginOpen = true"
        class="px-8 py-2 text-gray-700 bg-[#F8C600] font-semibold text-lg active:brightness-90 cursor-pointer rounded-md hover:shadow-md hover:shadow-[#aa8700]/40 transition-all duration-300">
        Log In
      </button>
    </div>
    <div
      class="w-screen h-screen bg-[radial-gradient(ellipse_at_center,_#fff2bd_0%,_transparent_70%)] flex flex-col justify-center items-center gap-10">
      <div class="text-center space-y-2">
        <div class="font-bold text-7xl text-[#242629] w-250">
          Learn To&nbsp;<span
            class="bg-gradient-to-r from-[#DB6600] to-[#F8C600] bg-clip-text text-transparent">Cook</span>
          Filipino Dishes The Fun and Interactive Way
        </div>
      </div>
      <button @click="isLoginOpen = true"
        class="flex items-center gap-2 mt-8 px-8 py-2 text-gray-700 bg-[#F8C600] font-semibold text-lg active:brightness-90 cursor-pointer rounded-md hover:shadow-md hover:shadow-[#aa8700]/40 transition-all duration-300">
        Log In
        <MoveRight />
      </button>

      <div class="flex mt-10 gap-x-20">
        <div
          class="cursor-pointer flex justify-center items-center gap-8 w-100 bg-white rounded-xl p-8 shadow-lg transition-all duration-300 hover:shadow-[#aa8700]/50 shadow-black/10 active:brightness-90">
          <div>
            <img src="@/assets/android.png" alt="" />
          </div>
          <div>
            <div class="text-lg">DIRECT APK</div>
            <div class="font-bold text-4xl text-[#242629]">Download</div>
          </div>
        </div>
        <a href="https://play.google.com/store/apps/details?id=com.miHoYo.GenshinImpact" target="_blank"
          class="cursor-pointer flex justify-center items-center gap-8 w-100 bg-white rounded-xl p-8 shadow-lg transition-all duration-300 hover:shadow-[#aa8700]/50 shadow-black/10 active:brightness-90">
          <div>
            <img src="@/assets/google-play.png" alt="" />
          </div>
          <div>
            <div class="text-lg">GET IT ON</div>
            <div class="font-bold text-4xl text-[#242629]">Google Play</div>
          </div>
        </a>
      </div>
    </div>
    <div class="bg-[#202020] w-screen h-30 flex justify-between items-center px-8">
      <div class="flex h-10">
        <img src="@/assets/logo-white.png" alt="" />
      </div>
      <div class="flex flex-col gap-6 w-100 px-8">
        <div class="flex w-full justify-between">
          <a class="text-white font-thin hover:underline duration-300 transition-all text-sm" href="">Terms of
            Service</a>
          <a class="text-white font-thin hover:underline duration-300 transition-all text-sm" href="">Privacy Policy</a>
          <a class="text-white font-thin hover:underline duration-300 transition-all text-sm" href="">About Us</a>
        </div>
        <div class="flex">
          <div class="text-[#A2A2A2] text-sm font-thin">
            Copyright © LuTuon 2025. All Rights Reserved.
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
