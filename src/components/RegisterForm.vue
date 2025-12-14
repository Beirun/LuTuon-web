<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import Button from './ui/button/Button.vue'
import Input from './ui/input/Input.vue'
import Label from './ui/label/Label.vue'
import { ref, onMounted, onUnmounted, reactive, watch } from 'vue'
import {
  Eye,
  EyeClosed,
  Loader2,
  CalendarDays,
  ArrowLeft,
  CircleQuestionMark,
} from 'lucide-vue-next'
import { googleTokenLogin } from 'vue3-google-login'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import type { DateValue } from '@internationalized/date'
import { DateFormatter, getLocalTimeZone } from '@internationalized/date'
import { cn } from '@/lib/utils'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card'

const birthdate = ref<DateValue>()
const df = new DateFormatter('en-US', {
  dateStyle: 'long',
})

const continueRegister = ref(false)

const continueReg = () => {
  continueRegister.value = !continueRegister.value
  console.log(new Date(birthdate.value?.toDate(getLocalTimeZone())!).toISOString())
}

const auth = useAuthStore()
const credentials = reactive({
  email: '',
  birthdate: '',
  password: '',
  confirmPassword: '',
})

watch(birthdate, (v) => {
  credentials.birthdate = v ? v.toDate(getLocalTimeZone()).toISOString() : ''
})

const register = async () => {
  credentials.birthdate = new Date(birthdate.value?.toDate(getLocalTimeZone())!).toISOString()
  const success = await auth.register(credentials)
  if (!success) return
  credentials.confirmPassword = ''
  credentials.password = ''
  credentials.email = ''
  credentials.birthdate = ''
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
watch(
  () => props.open,
  (v) => {
    if (!v) {
      continueRegister.value = false
      birthdate.value = undefined
      credentials.email = ''
      credentials.birthdate = ''
      credentials.password = ''
      credentials.confirmPassword = ''
    }
  },
)

const emit = defineEmits(['update:open', 'openLoginDialog'])
const openLoginDialog = () => {
  continueRegister.value = false
  credentials.email = ''
  birthdate.value = undefined
  credentials.birthdate = ''
  emit('update:open', false)
  emit('openLoginDialog')
}

const handleOpenChange = (openState: boolean) => {
  emit('update:open', openState)
}

async function google() {
  const object = await googleTokenLogin()
  auth.continueWithGoogle(object)
}
</script>
<template>
  <Dialog :open="props.open" @update:open="handleOpenChange">
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
        <div class="w-full flex flex-col gap-8" v-if="!continueRegister">
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
            <Label for="email" class="text-base sm:text-base md:text-xl px-2 sm:px-2 md:px-4"
              >Birthdate</Label
            >
            <Popover>
              <PopoverTrigger as-child>
                <Button
                  variant="outline"
                  :class="
                    cn(
                      'w-full h-14 justify-start text-left font-normal',
                      !birthdate && 'text-muted-foreground',
                    )
                  "
                >
                  <CalendarDays class="mr-2 h-4 w-4" />
                  {{ birthdate ? df.format(birthdate.toDate(getLocalTimeZone())) : 'Pick a date' }}
                </Button>
              </PopoverTrigger>

              <PopoverContent class="w-auto p-0">
                <Calendar v-model="birthdate" initial-focus />
              </PopoverContent>
            </Popover>
          </div>
        </div>
        <div class="w-full flex flex-col gap-8" v-if="continueRegister">
          <Button
            @click="continueReg()"
            class="w-1/6 bg-transparent border-none hover:bg-transparent text-white h-1"
            ><ArrowLeft />Back</Button
          >
          <div class="w-full flex flex-col gap-1">
            <Label for="password" class="text-base sm:text-base md:text-xl px-2 sm:px-2 md:px-4"
              >Password</Label
            >
            <div class="w-full flex flex-row gap-2 items-center">
              <div class="relative w-full">
                <Input
                  v-model="credentials.password"
                  tabindex="-1"
                  :placeholder="showPassword ? 'Password123' : '••••••••'"
                  id="password"
                  :type="showPassword ? 'text' : 'password'"
                  class="w-full h-14 px-2 sm:px-2 md:px-4 py-3 text-base sm:text-base md:text-lg border border-border rounded-sm sm:rounded-sm md:rounded-md focus:outline-primary focus:outline-2"
                />
                <EyeClosed
                  class="size-5 absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground text-2xl"
                  :class="showPassword ? 'hidden' : ''"
                  @click="TogglePassword"
                />
                <Eye
                  class="size-5 absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground text-2xl"
                  :class="showPassword ? '' : 'hidden'"
                  @click="TogglePassword"
                />
              </div>

              <HoverCard :open-delay="0" :close-delay="0">
                <HoverCardTrigger as-child>
                  <CircleQuestionMark />
                </HoverCardTrigger>
                <HoverCardContent class="text-xs w-75 text-left">
                  <ol class="list-decimal list-inside space-y-1">
                    <li>Must be 8-64 characters</li>
                    <li>Must contain a capital letter</li>
                    <li>Must contain numbers 0-9</li>
                    <li>Must contain a special character such as: !@#$%^&*()-_+={}[]|\;:"<>,./?</li>
                  </ol>
                </HoverCardContent>
              </HoverCard>
            </div>
          </div>
          <div class="flex flex-col gap-1" v-if="continueRegister">
            <Label
              for="confirmpassword"
              class="text-base sm:text-base md:text-xl px-2 sm:px-2 md:px-4"
              >Confirm Password</Label
            >
            <div class="w-full flex flex-row gap-2 items-center">
              <div class="relative w-full">
                <Input
                  v-model="credentials.confirmPassword"
                  tabindex="-1"
                  :placeholder="showConfirmPassword ? 'Password123' : '••••••••'"
                  id="confirmpassword"
                  :type="showConfirmPassword ? 'text' : 'password'"
                  class="h-14 px-2 sm:px-2 md:px-4 py-3 text-base sm:text-base md:text-lg border border-border rounded-sm sm:rounded-sm md:rounded-md focus:outline-primary focus:outline-2"
                />
                <EyeClosed
                  class="size-5 absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground text-2xl"
                  :class="showConfirmPassword ? 'hidden' : ''"
                  @click="ToggleConfirmPassword"
                />
                <Eye
                  class="size-5 absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground text-2xl"
                  :class="showConfirmPassword ? '' : 'hidden'"
                  @click="ToggleConfirmPassword"
                />
              </div>

              <HoverCard :open-delay="0" :close-delay="0">
                <HoverCardTrigger as-child>
                  <CircleQuestionMark />
                </HoverCardTrigger>
                <HoverCardContent class="text-xs w-75 text-left">
                  <ol class="list-decimal list-inside space-y-1">
                    <li>Must be 8-64 characters</li>
                    <li>Must contain a capital letter</li>
                    <li>Must contain numbers 0-9</li>
                    <li>Must contain a special character such as: !@#$%^&*()-_+={}[]|\;:"<>,./?</li>
                  </ol>
                </HoverCardContent>
              </HoverCard>
            </div>
          </div>
        </div>
        <Button
          v-if="!continueRegister"
          :disabled="!credentials.email || !credentials.birthdate"
          @click="continueReg()"
          class="h-14 bg-primary text-primary-foreground/80 dark:text-primary-foreground w-full py-3 sm:py-3 md:py-4 rounded-sm sm:rounded-sm md:rounded-md text-base sm:text-base md:text-xl font-medium active:brightness-90 hover:brightness-95 cursor-pointer hover:shadow-md hover:shadow-[#aa8700]/30 transition-all duration-300 mt-8"
        >
          <Loader2 v-if="auth.isLoading" class="w-4 h-4 animate-spin" />

          CONTINUE
        </Button>
        <Button
          v-if="continueRegister"
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
          @click="google"
          :disabled="auth.isLoading"
          variant="outline"
          class="h-14 flex justify-center items-center gap-4 bg-background brightness-95 text-foreground w-full my-4 rounded-md text-base sm:text-base md:text-lg active:brightness-90 hover:brightness-95 cursor-pointer hover:shadow-md hover:shadow-primary-foreground/20 transition-all duration-300"
        >
          <img src="@/assets/google.png" class="size-6 sm:size-6 md:size-8" alt="" />
          CONTINUE WITH GOOGLE
        </Button>
      </div>
    </DialogContent>
  </Dialog>
</template>
