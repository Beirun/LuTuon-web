<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
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
import LoginForm from './LoginForm.vue'
import Button from './ui/button/Button.vue'
import Input from './ui/input/Input.vue'
import Label from './ui/label/Label.vue'
import { ref, onMounted, onUnmounted, reactive } from 'vue'
// import { Icon } from '@iconify/vue'
import { Eye, EyeClosed, Loader2} from 'lucide-vue-next'

const auth = useAuthStore();
const credentials = reactive({
  email: '',
  password: '',
  confirmPassword: ''
})

const register = async() =>{
    const success = await auth.register(credentials)
    if(!success) return
    credentials.confirmPassword = ''
    credentials.password = ''
    credentials.email= ''
    handleOpenChange(false)
  
}
const screenWidth = ref(window.innerWidth)
const showPassword = ref(false)
const showConfirmPassword = ref(false)

const TogglePassword = () => {
  showPassword.value = !showPassword.value
}

const ToggleConfirmPassword = () => {
  showConfirmPassword.value = !showConfirmPassword.value
}


const updateWidth = () => {
  screenWidth.value = window.innerWidth
}

onMounted(() => {
  window.addEventListener('resize', updateWidth)
})

onUnmounted(() => {
  window.removeEventListener('resize', updateWidth)
})
const props = defineProps({
  open: Boolean,
})

const emit = defineEmits(['update:open', 'openLoginDialog'])
const openLoginDialog = () => {
  emit('update:open', false)
  emit('openLoginDialog')
}

const handleOpenChange = (openState: boolean) => {
  emit('update:open', openState)
}
</script>
<template>
  <Dialog v-model:open="props.open" @update:open="handleOpenChange">
    <DialogContent class="flex flex-col pt-8">
      <DialogHeader>
        <DialogTitle>
          <div class="w-full flex flex-col justify-center items-center">
            <img class="h-10 sm:h-10 md:h-12" src="@/assets/logo.png" alt="" />
          </div>
        </DialogTitle>
        <DialogDescription>
          <div class="w-full flex flex-col justify-center items-center">
            <div class="text-3xl sm:text-3xl md:text-4xl text-foreground font-bold mt-2">
              Account Register
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
              v-model="credentials.email"
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
            <div class="relative">
              <Input
              v-model="credentials.password"
              tabindex="-1"
              :placeholder="showPassword ? 'Password123' : '••••••••'"
              id="password"
              :type="showPassword ? 'text': 'password'"
              class="h-14 px-2 sm:px-2 md:px-4 py-3 text-base sm:text-base md:text-lg border border-border rounded-sm sm:rounded-sm md:rounded-md focus:outline-primary focus:outline-2"
              />
              <EyeClosed class="size-5 absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground text-2xl"  :class="showPassword ? 'hidden' : ''" @click="TogglePassword"/>
              <Eye class="size-5 absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground text-2xl " :class="showPassword ? '' : 'hidden'" @click="TogglePassword"/>
            </div>
          </div>
          <div class="flex flex-col gap-1">
            <Label
              for="confirmpassword"
              class="text-base sm:text-base md:text-xl px-2 sm:px-2 md:px-4"
              >Confirm Password</Label
            >
            <div class="relative">
              
              <Input
              v-model="credentials.confirmPassword"
              tabindex="-1"
              :placeholder="showConfirmPassword ? 'Password123' : '••••••••'"
              id="confirmpassword"
              :type="showConfirmPassword ? 'text': 'password'"
              class="h-14 px-2 sm:px-2 md:px-4 py-3 text-base sm:text-base md:text-lg border border-border rounded-sm sm:rounded-sm md:rounded-md focus:outline-primary focus:outline-2"
              />
              <EyeClosed class=" size-5 absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground text-2xl"  :class="showConfirmPassword ? 'hidden' : ''" @click="ToggleConfirmPassword"/>
              <Eye class="size-5 absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground text-2xl " :class="showConfirmPassword ? '' : 'hidden'" @click="ToggleConfirmPassword"/>
            </div>
          </div>
        </div>
        <Button
          :disabled="auth.isLoading"
          @click="register"
          class="h-14 bg-primary text-primary-foreground/80 dark:text-primary-foreground w-full py-3 sm:py-3 md:py-4 rounded-sm sm:rounded-sm md:rounded-md text-base sm:text-base md:text-xl font-medium active:brightness-90 hover:brightness-95 cursor-pointer hover:shadow-md hover:shadow-[#aa8700]/30 transition-all duration-300 mt-8"
        >
          <Loader2 v-if="auth.isLoading" class="w-4 h-4 animate-spin" />

          REGISTER
        </Button>
        <div class="w-full py-4 flex justify-center items-center">
          <span class="text-foreground text-sm sm:text-sm md:text-lg font-light">
            Already Have an Account?
          </span>
          &nbsp;
          <Button
            variant="link"
            @click="openLoginDialog"
            class="px-0 text-primary brightness-85 text-sm sm:text-sm md:text-lg font-light hover:underline hover:brightness-80 cursor-pointer"
            >Login Here!</Button
          >
        </div>
        <div class="w-full flex justify-center items-center gap-4">
          <div class="h-[1px] w-full bg-foreground"></div>
          <div class="text-sm sm:text-sm md:text-base">OR</div>
          <div class="h-[1px] w-full bg-foreground"></div>
        </div>
        <Button
          :disabled="auth.isLoading"
          variant="outline"
          class="h-14 flex justify-center items-center gap-4 bg-background brightness-95 text-foreground w-full my-4 rounded-md text-base sm:text-base md:text-lg active:brightness-90 hover:brightness-95 cursor-pointer hover:shadow-md hover:shadow-primary-foreground/20 transition-all duration-300"
        >
          <img src="@/assets/google.png" class="size-6 sm:size-6 md:size-8" alt="" />
          REGISTER WITH GOOGLE
        </Button>
      </div>
    </DialogContent>
  </Dialog>
</template>
