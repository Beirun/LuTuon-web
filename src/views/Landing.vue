<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { MoveRight } from 'lucide-vue-next'
import { ref } from 'vue'
import LoginForm from '@/components/LoginForm.vue'
import RegisterForm from '@/components/RegisterForm.vue'
import DarkModeSwitch from '@/components/DarkModeSwitch.vue'
import Button from '@/components/ui/button/Button.vue'

const isLoginOpen = ref(false)
const isRegisterOpen = ref(false)

const openRegisterDialog = () => {
  isLoginOpen.value = false
  isRegisterOpen.value = true
}
const openLoginDialog = () => {
  isLoginOpen.value = true
  isRegisterOpen.value = false
}

const openPlayStore = () => {
  window.open('https://play.google.com/store/apps/details?id=com.miHoYo.GenshinImpact', '_blank')
}
</script>

<template>
  <LoginForm
    :open="isLoginOpen"
    @update:open="(val) => (isLoginOpen = val)"
    @open-register-dialog="openRegisterDialog"
  />
  <RegisterForm
    :open="isRegisterOpen"
    @update:open="(val) => (isRegisterOpen = val)"
    @open-login-dialog="openLoginDialog"
  />

  <div class="max-w-screen min-h-screen overflow-x-hidden">
    <!-- Header Section -->

    <div
      class="w-screen h-17.5 sm:h-17.5 md:h-20 bg-background absolute top-0 right-0 flex items-center justify-between px-4 sm:px-4 md:px-12"
    >
      <img src="@/assets/logo.png" class="h-8 sm:h-8 md:h-10" alt="" />
      <div class="flex justify-between items-center h-full gap-4 sm:gap-4 md:gap-10">
        <DarkModeSwitch />
        <Button
          @click="isLoginOpen = true"
          class="h-12 sm:h-9 md:h-12 text-primary-foreground/80 dark:text-primary-foreground px-4 py-1 sm:px-4 md:px-8 bg-primary font-medium text-sm sm:text-sm md:text-lg active:brightness-90 cursor-pointer rounded-sm sm:rounded:sm md:rounded-md shadow-md shadow-black/40 transition-all duration-300 hover:brightness-95 dark:hover:brightness-110"
        >
          Login
        </Button>
      </div>
    </div>

    <!-- Hero Section -->

    <div
      class="w-screen min-h-screen bg-[radial-gradient(ellipse_at_center,_#fff2bd_0%,_transparent_90%)] dark:bg-[radial-gradient(ellipse_at_center,_#473b00_0%,_transparent_75%)] flex flex-col justify-center items-center gap-10 pb-30 sm:pb-30 md:pb-20 lg:pb-10"
    >
      <div class="text-center space-y-2 flex justify-center w-full">
        <div
          class="font-gotham font-black sm:font-black md:font-bold text-4xl text-foreground w-33/40 md:max-w-275 leading-12 sm:leading-12 md:leading-14 lg:leading-20 xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl pb-10 sm:pb-10 md:pb-0 pt-45 sm:pt-45 md:pt-30"
        >
          Learn To&nbsp;<span
            class="bg-gradient-to-r from-[#DB6600] to-primary bg-clip-text text-transparent"
            >Cook</span
          >
          Filipino Dishes The Fun and Interactive Way
        </div>
      </div>
      <Button
        @click="isLoginOpen = true"
        class="flex items-center mb-15 sm:mb-15 md:mb-0 gap-2 mt-8 h-12 w-36 text-primary-foreground/80 dark:text-primary-foreground bg-primary font-medium text-lg active:brightness-90 cursor-pointer rounded-md shadow-md shadow-black/40 transition-all duration-300 hover:brightness-95 dark:hover:brightness-110"
      >
        Login
        <MoveRight class="size-6" />
      </Button>

      <!-- Buttons Section -->

      <div
        class="flex flex-col items-center mt-15 gap-15 sm:gap-15 lg:gap-20 sm:flex-col lg:flex-row text-foreground"
      >
        <Button
          variant="outline"
          class="dark:hover:brightness-110 cursor-pointer h-30 flex justify-center items-center gap-8 w-79/80 sm:w-79/80 md:w-100 bg-card rounded-xl p-8 shadow-lg transition-all duration-300 hover:shadow-[#aa8700]/50 shadow-black/10 active:brightness-90 hover:brightness-95"
        >
          <div>
            <img src="@/assets/android.png" alt="" />
          </div>
          <div>
            <div class="text-md sm:text-md md:text-lg">DIRECT APK</div>
            <div class="font-bold text-3xl sm:text-3xl md:text-4xl">Download</div>
          </div>
        </Button>
        <Button
          @click="openPlayStore"
          variant="outline"
          class="dark:hover:brightness-120 cursor-pointer h-30 flex justify-center items-center gap-8 w-79/80 sm:w-79/80 md:w-100 bg-card rounded-xl p-8 shadow-lg transition-all duration-300 hover:shadow-[#aa8700]/50 shadow-black/10 active:brightness-90 hover:brightness-95"
        >
          <div>
            <img src="@/assets/google-play.png" alt="" />
          </div>
          <div>
            <div class="text-md sm:text-md md:text-lg">GET IT ON</div>
            <div class="font-bold text-3xl sm:text-3xl md:text-4xl">Google Play</div>
          </div>
        </Button>
      </div>
    </div>

    <!-- Footer Section -->

    <div
      class="bg-[#202020] dark:bg-[#121212] w-screen h-60 flex justify-between items-center px-8 flex-col-reverse py-8 sm:h-60 md:h-30 sm:py-8 sm:flex-col-reverse md:flex-row"
    >
      <div class="flex h-10 min-w-20 mb-4 sm:mb-4 md:mb-0">
        <img src="@/assets/logo-white.png" alt="" />
      </div>
      <div class="flex flex-col gap-6 w-100 px-8">
        <div class="flex w-full justify-between">
          <a
            class="text-white font-thin hover:underline duration-300 transition-all text-sm"
            href=""
            >Terms of Service</a
          >
          <a
            class="text-white font-thin hover:underline duration-300 transition-all text-sm"
            href=""
            >Privacy Policy</a
          >
          <a
            class="text-white font-thin hover:underline duration-300 transition-all text-sm"
            href=""
            >About Us</a
          >
        </div>
        <div class="flex justify-center md:justify-start">
          <div class="text-white text-sm font-thin brightness-50">
            Copyright © LuTuon 2025. All Rights Reserved.
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
