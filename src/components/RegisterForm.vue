<script setup lang="ts">
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogClose,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import LoginForm from './LoginForm.vue';
import { ref } from 'vue';
const props = defineProps({
  open: Boolean
})

const emit = defineEmits(['update:open', 'openLoginDialog'])
const openLoginDialog = () => {
  emit('update:open', false)
  emit('openLoginDialog')
}

const handleOpenChange = (openState : boolean) => {
  emit('update:open', openState)
}
</script>
<template>
    <Dialog v-model:open="props.open" @update:open="handleOpenChange">

        <DialogContent class="flex flex-col pt-8">
            <DialogHeader>
                <DialogTitle>
                    <div class="w-full flex flex-col justify-center items-center">
                        <img  class="h-10 sm:h-10 md:h-12" src="@/assets/logo.png" alt="" />
                    </div>
                </DialogTitle>
                <DialogDescription>
                    <div class="w-full flex flex-col justify-center items-center">
                        <div class="text-3xl sm:text-3xl md:text-4xl text-[#242629] font-bold mt-2">Account Register</div>
                    </div>
                </DialogDescription>
            </DialogHeader>
            <div class="px-2 sm:px-2 md:px-8 flex flex-col items-center justify-center pt-4">
                <div class="w-full flex flex-col gap-8">
                    <div class="flex flex-col gap-1">
                        <label for="email" class="text-base sm:text-base md:text-xl px-2 sm:px-2 md:px-4">Email</label>
                        <input tabindex="-1" placeholder="email@example.com" id="email" type="text"
                            class="px-2 sm:px-2 md:px-4 py-3 text-base sm:text-base md:text-lg border border-gray-500 rounded-sm sm:rounded-sm md:rounded-md focus:outline-[#F8C600]" />
                    </div>
                    <div class="flex flex-col gap-1">
                        <label for="password" class="text-base sm:text-base md:text-xl px-2 sm:px-2 md:px-4">Password</label>
                        <input tabindex="-1" placeholder="••••••••" id="password" type="password"
                            class="px-2 sm:px-2 md:px-4 py-3 text-base sm:text-base md:text-lg border border-gray-500 rounded-sm sm:rounded-sm md:rounded-md focus:outline-[#F8C600]" />
                    </div>
                    <div class="flex flex-col gap-1">
                        <label for="confirmpassword" class="text-base sm:text-base md:text-xl px-2 sm:px-2 md:px-4">Confirm Password</label>
                        <input tabindex="-1" placeholder="••••••••" id="confirmpassword" type="password"
                            class="px-2 sm:px-2 md:px-4 py-3 text-base sm:text-base md:text-lg border border-gray-500 rounded-sm sm:rounded-sm md:rounded-md focus:outline-[#F8C600]" />
                    </div>
                </div>
                <button
                    class="bg-[#ECB211] text-[#242629] w-full py-3 sm:py-3 md:py-4 rounded-sm sm:rounded-sm md:rounded-md text-base sm:text-base md:text-xl font-bold active:brightness-90 hover:brightness-95 cursor-pointer hover:shadow-md hover:shadow-[#aa8700]/30 transition-all duration-300 mt-8">
                    REGISTER
                </button>
                <div class="w-full py-4 flex justify-center">
                    <span class="text-[#242629] text-sm sm:text-sm md:text-lg font-light"> Already Have an Account? </span>
                    &nbsp;
                            <button @click="openLoginDialog" class="text-[#C08F06] text-sm sm:text-sm md:text-lg font-light hover:underline hover:brightness-80">Login
                                Here!</button>
                </div>
                <div class="w-full flex justify-center items-center gap-4">
                    <div class="h-[1px] w-full bg-gray-700"></div>
                    <div class="text-sm sm:text-sm md:text-base">OR</div>
                    <div class="h-[1px] w-full bg-gray-700"></div>
                </div>
                <button
                    class="flex justify-center items-center gap-4 bg-[#F1F1F1] text-[#242629] w-full py-4 my-4 rounded-md text-base sm:text-base md:text-xl  active:brightness-90 hover:brightness-95 cursor-pointer hover:shadow-md hover:shadow-[#aa8700]/20 transition-all duration-300">
                    <img src="@/assets/google.png" class="size-6 sm:size-6 md:size-8" alt="">
                    REGISTER WITH GOOGLE
                </button>
            </div>
        </DialogContent>
    </Dialog>
</template>
