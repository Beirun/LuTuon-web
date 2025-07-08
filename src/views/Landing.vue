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

    
    <!-- Header Section -->

    <div
      class="w-screen h-17.5 sm:h-17.5 md:h-20 bg-white absolute top-0 right-0 flex items-center justify-between px-4 sm:px-4 md:px-12">
      <img src="@/assets/logo.png" class="h-8 sm:h-8 md:h-10" alt="" />
      <button @click="isLoginOpen = true"
        class="px-4 py-1 sm:px-4 sm:py-1 md:px-8 md:py-2 text-gray-700 bg-[#F8C600] font-semibold text-sm sm:text-sm md:text-lg active:brightness-90 cursor-pointer rounded-sm sm:rounded:sm md:rounded-md hover:shadow-md hover:shadow-[#aa8700]/40 transition-all duration-300">
        Log In
      </button>
    </div>


    <!-- Hero Section -->

    <div
      class="w-screen min-h-screen bg-[radial-gradient(ellipse_at_center,_#fff2bd_0%,_transparent_90%)] flex flex-col justify-center items-center gap-10 pb-30 sm:pb-30 md:pb-20 lg:pb-10">
      <div class="text-center space-y-2 flex justify-center w-full">
        <div class="font-bold text-[40px] text-[#242629] w-31/40 md:max-w-250 sm:text-[40px] leading-12 sm:leading-12 md:leading-14 lg:leading-20 md:text-[40px] lg:text-7xl pb-10 sm:pb-10 md:pb-0   pt-45 sm:pt-45 md:pt-40">
          Learn To&nbsp;<span
            class="bg-gradient-to-r from-[#DB6600] to-[#F8C600] bg-clip-text text-transparent">Cook</span>
          Filipino Dishes The Fun and Interactive Way
        </div>
      </div>
      <button @click="isLoginOpen = true"
        class="flex items-center mb-15 sm:mb-15 md:mb-0 gap-2 mt-8 px-8 py-2 text-gray-700 bg-[#F8C600] font-semibold text-lg active:brightness-90 cursor-pointer rounded-md hover:shadow-md hover:shadow-[#aa8700]/40 transition-all duration-300">
        Log In
        <MoveRight />
      </button>


      <!-- Buttons Section -->

      <div class="flex flex-col items-center mt-15 gap-15 sm:gap-15 lg:gap-20 sm:flex-col lg:flex-row">
        <div
          class="cursor-pointer flex justify-center items-center gap-8 w-79/80 sm:w-79/80 md:w-100 bg-white rounded-xl p-8 shadow-lg transition-all duration-300 hover:shadow-[#aa8700]/50 shadow-black/10 active:brightness-90 hover:brightness-93">
          <div>
            <img src="@/assets/android.png" alt="" />
          </div>
          <div>
            <div class="text-md sm:text-md md:text-lg">DIRECT APK</div>
            <div class="font-bold text-3xl sm:text-3xl md:text-4xl text-[#242629]">Download</div>
          </div>
        </div>
        <a href="https://play.google.com/store/apps/details?id=com.miHoYo.GenshinImpact" target="_blank"
          class="cursor-pointer flex justify-center items-center gap-8 w-79/80 sm:w-79/80 md:w-100 bg-white rounded-xl p-8 shadow-lg transition-all duration-300 hover:shadow-[#aa8700]/50 shadow-black/10 active:brightness-90 hover:brightness-93">
          <div>
            <img src="@/assets/google-play.png" alt="" />
          </div>
          <div>
            <div class="text-md sm:text-md md:text-lg">GET IT ON</div>
            <div class="font-bold text-3xl sm:text-3xl md:text-4xl text-[#242629]">Google Play</div>
          </div>
        </a>
      </div>
    </div>


    <!-- Footer Section -->

    <div class="bg-[#202020] w-screen h-60 flex justify-between items-center px-8 flex-col-reverse py-8 sm:h-60 md:h-30 sm:py-8 sm:flex-col-reverse md:flex-row">
      <div class="flex h-10 min-w-20 mb-4 sm:mb-4 md:mb-0">
        <img src="@/assets/logo-white.png" alt="" />
      </div>
      <div class="flex flex-col gap-6 w-100 px-8">
        <div class="flex w-full justify-between">
          <a class="text-white font-thin hover:underline duration-300 transition-all text-sm" href="">Terms of
            Service</a>
          <a class="text-white font-thin hover:underline duration-300 transition-all text-sm" href="">Privacy Policy</a>
          <a class="text-white font-thin hover:underline duration-300 transition-all text-sm" href="">About Us</a>
        </div>
        <div class="flex justify-center md:justify-start">
          <div class="text-[#A2A2A2] text-sm font-thin">
            Copyright © LuTuon 2025. All Rights Reserved.
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
