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
import RegisterForm from './RegisterForm.vue';
import { ref } from 'vue';

const props = defineProps({
  open: Boolean
})

const emit = defineEmits(['update:open', 'openRegisterDialog'])

const openRegisterDialog = () => {
  emit('update:open', false)
  emit('openRegisterDialog')
}

const handleOpenChange = (openState : boolean) => {
  emit('update:open', openState)
}

</script>
<template>
    <Dialog v-model:open="props.open" @update:open="handleOpenChange">
        <DialogContent>
            <DialogHeader>
                <DialogTitle>
                    <div class="w-full flex flex-col justify-center items-center">
                        <img src="@/assets/logo.png" alt="" />
                    </div>
                </DialogTitle>
                <DialogDescription>
                    <div class="w-full flex flex-col justify-center items-center">
                        <div class="text-4xl text-[#242629] font-bold mt-2">Account Login</div>
                    </div>
                </DialogDescription>
            </DialogHeader>
            <div class="px-8 flex flex-col items-center justify-center pt-4">
                <div class="w-full flex flex-col gap-8">
                    <div class="flex flex-col gap-1">
                        <label for="email" class="text-xl px-4">Email</label>
                        <input placeholder="email@example.com" id="email" type="text"
                            class="px-4 py-3 text-lg border border-gray-500 rounded-md focus:outline-[#F8C600]" />
                    </div>
                    <div class="flex flex-col gap-1">
                        <label for="password" class="text-xl px-4">Password</label>
                        <input placeholder="••••••••" id="password" type="password"
                            class="px-4 py-3 text-lg border border-gray-500 rounded-md focus:outline-[#F8C600]" />
                    </div>
                </div>

                <div class="w-full py-4 flex justify-end">
                    <a class="text-[#C08F06] text-lg hover:underline hover:brightness-80" href="#">Forgot Password?</a>
                </div>
                <button
                    class="bg-[#ECB211] text-[#242629] w-full py-4 rounded-lg text-xl font-bold active:brightness-90 hover:brightness-95 cursor-pointer hover:shadow-md hover:shadow-[#aa8700]/30 transition-all duration-300">
                    LOGIN
                </button>
                <div class="w-full py-4 flex justify-center">
                    <span class="text-[#242629] text-lg font-light"> Don't Have an Account? </span>
                    &nbsp;
                    <button @click="openRegisterDialog" class="text-[#C08F06] text-lg font-light hover:underline hover:brightness-80">Register
                        Here!</button>
                </div>
                <div class="w-full flex justify-center items-center gap-4">
                    <div class="h-[1px] w-full bg-gray-700"></div>
                    <div>OR</div>
                    <div class="h-[1px] w-full bg-gray-700"></div>
                </div>
                <button
                    class="flex justify-center items-center gap-4 bg-[#F1F1F1] text-[#242629] w-full py-4 my-4 rounded-lg text-xl  active:brightness-90 hover:brightness-95 cursor-pointer hover:shadow-md hover:shadow-[#aa8700]/20 transition-all duration-300">
                    <img src="@/assets/google.png" class="size-8" alt="">
                    LOGIN WITH GOOGLE
                </button>
            </div>
        </DialogContent>
    </Dialog>
</template>
