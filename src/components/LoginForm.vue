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
import RegisterForm from './RegisterForm.vue'
import { ref } from 'vue'
import Button from './ui/button/Button.vue'
import Input from './ui/input/Input.vue'
import Label from './ui/label/Label.vue'

const props = defineProps({
  open: Boolean,
})

const emit = defineEmits(['update:open', 'openRegisterDialog'])

const openRegisterDialog = () => {
  emit('update:open', false)
  emit('openRegisterDialog')
}

const handleOpenChange = (openState: boolean) => {
  emit('update:open', openState)
}
</script>
<template>
  <Dialog v-model:open="props.open" @update:open="handleOpenChange">
    <DialogContent class="flex flex-col pt-8 md:h-175 sm:max-h-175 overflow-y-auto">
      <DialogHeader>
        <DialogTitle>
          <div class="w-full flex flex-col justify-center items-center">
            <img class="h-10 sm:h-10 md:h-12" src="@/assets/logo.png" alt="" />
          </div>
        </DialogTitle>
        <DialogDescription>
          <div class="w-full flex flex-col justify-center items-center">
            <div class="text-3xl sm:text-3xl md:text-4xl text-foreground font-bold mt-2">
              Account Login
            </div>
          </div>
        </DialogDescription>
      </DialogHeader>
      <div class="px-2 sm:px-2 md:px-8 flex flex-col items-center justify-center pt-4">
        <div class="w-full flex flex-col gap-8">
          <div class="flex flex-col gap-1">
            <Label for="email" class="text-base sm:text-base md:text-xl px-2 sm:px-2 md:px-4"
              >Email</Label
            >
            <Input
              tabindex="-1"
              placeholder="email@example.com"
              id="email"
              type="text"
              class="h-14 px-2 sm:px-2 md:px-4 py-3 text-base sm:text-base md:text-lg border border-border rounded-sm sm:rounded-sm md:rounded-md focus:outline-primary focus:outline-2"
            />
          </div>
          <div class="flex flex-col gap-1">
            <Label for="password" class="text-base sm:text-base md:text-xl px-2 sm:px-2 md:px-4"
              >Password</Label
            >
            <Input
              tabindex="-1"
              placeholder="••••••••"
              id="password"
              type="password"
              class="h-14 px-2 sm:px-2 md:px-4 py-3 text-base sm:text-base md:text-lg border border-border rounded-sm sm:rounded-sm md:rounded-md focus:outline-primary focus:outline-2"
            />
          </div>
        </div>

        <div class="w-full py-4 flex justify-end">
          <Button
            variant="link"
            class="font-light px-0 text-primary brightness-85 text-sm sm:text-sm md:text-lg hover:underline hover:brightness-80"
            href="#"
            >Forgot Password?</Button
          >
        </div>
        <Button
          class="h-14 bg-primary text-primary-foreground/80 dark:text-primary-foreground w-full py-3 sm:py-3 md:py-4 rounded-sm sm:rounded-sm md:rounded-md text-base sm:text-base md:text-xl font-medium active:brightness-90 hover:brightness-95 cursor-pointer hover:shadow-md hover:shadow-[#aa8700]/30 transition-all duration-300 dark:hover:brightness-110 dark:active:brightness-90"
        >
          LOGIN
        </Button>
        <div class="w-full py-4 flex justify-center items-center">
          <span class="text-foreground text-sm sm:text-sm md:text-lg font-light">
            Don't Have an Account?
          </span>
          &nbsp;
          <Button
            variant="link"
            @click="openRegisterDialog"
            class="px-0 text-primary brightness-85 text-sm sm:text-sm md:text-lg font-light hover:underline hover:brightness-80"
            >Register Here!</Button
          >
        </div>
        <div class="w-full flex justify-center items-center gap-4">
          <div class="h-[1px] w-full bg-foreground"></div>
          <div class="text-sm sm:text-sm md:text-base">OR</div>
          <div class="h-[1px] w-full bg-foreground"></div>
        </div>
        <Button
          variant="outline"
          class="h-14 flex justify-center items-center gap-4 bg-background brightness-95 text-foreground w-full my-4 rounded-md text-base sm:text-base md:text-lg active:brightness-90 hover:brightness-95 cursor-pointer hover:shadow-md hover:shadow-primary-foreground/20 transition-all duration-300"
        >
          <img src="@/assets/google.png" class="size-6 sm:size-6 md:size-8" alt="" />
          LOGIN WITH GOOGLE
        </Button>
      </div>
    </DialogContent>
  </Dialog>
</template>
