<script setup lang="ts">
import {
  Stepper,
  StepperIndicator,
  StepperItem,
  StepperSeparator,
  StepperTitle,
  StepperTrigger,
} from '@/components/ui/stepper'
import { ref } from 'vue'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Eye, EyeClosed, Check, Loader2 } from 'lucide-vue-next'
import { useResetStore } from '@/stores/reset'

const reset = useResetStore()
const currentStep = ref(1)
const email = ref('')
const verificationCode = ref('')
const onKeyPress = (e: KeyboardEvent) => {
  const key = e.key
  if (!/^\d$/.test(key)) {
    e.preventDefault() // block non-numeric keys
  }
  if (verificationCode.value.length >= 6) {
    e.preventDefault() // block input beyond 6
  }
}

const onInput = (e: Event) => {
  const el = e.target as HTMLInputElement
  // sanitize in case of paste
  verificationCode.value = el.value.replace(/\D/g, '').slice(0, 6)
}
const newPassword = ref('')
const confirmPassword = ref('')

const showNewPassword = ref(false)
const showConfirmPassword = ref(false)

const handleNext = async (nextStep: () => void) => {
  const result = await reset.requestReset(email.value)
  if (!result) return
  currentStep.value = 2
  nextStep()
}

const handleVerify = async (nextStep: () => void) => {
  const result = await reset.verifyCode(email.value, verificationCode.value)
  if (!result) return
  currentStep.value = 3
  nextStep()
}

const handleSubmit = async () => {
  await reset.resetPassword(
    email.value,
    verificationCode.value,
    newPassword.value,
    confirmPassword.value,
  )
}

const ToggleShowNewPassword = () => {
  showNewPassword.value = !showNewPassword.value
}

const ToggleShowConfirmPassword = () => {
  showConfirmPassword.value = !showConfirmPassword.value
}
</script>

<template>
  <div class="w-screen h-[100dvh] flex flex-col justify-center items-center">
    <p class="text-center text-2xl font-bold mb-6">Forgot Password?</p>
    <Stepper
      v-slot="{ nextStep, prevStep }"
      class="w-full mb-8 flex justify-center items-center flex-col"
    >
      <div class="flex w-full justify-center gap-2">
        <StepperItem :step="1" :active-step="currentStep">
          <StepperTrigger :disabled="true">
            <StepperIndicator>
              <span v-if="currentStep > 1"><Check /></span>
              <span v-else class="font-bold">1</span>
            </StepperIndicator>
            <StepperTitle>Enter Email</StepperTitle>
          </StepperTrigger>
          <StepperSeparator class="w-full h-px" />
        </StepperItem>

        <StepperItem :step="2" :active-step="currentStep">
          <StepperTrigger :disabled="true">
            <StepperIndicator>
              <span v-if="currentStep > 2"><Check /></span>
              <span v-else class="font-bold">2</span>
            </StepperIndicator>
            <StepperTitle>Verification</StepperTitle>
          </StepperTrigger>
          <StepperSeparator class="w-full h-px" />
        </StepperItem>

        <StepperItem :step="3" :active-step="currentStep">
          <StepperTrigger :disabled="true">
            <StepperIndicator>
              <span class="font-bold">3</span>
            </StepperIndicator>
            <StepperTitle>Set Password</StepperTitle>
          </StepperTrigger>
        </StepperItem>
      </div>

      <!-- Step 1 Content -->
      <div v-if="currentStep === 1" class="w-full flex flex-col items-center gap-4">
        <p class="text-center">
          Please enter the account email you want to change the password for
        </p>
        <Input
          autofocus
          class="w-[80vw] xs:w-3/5 sm:w-5/6 lg:w-1/5"
          v-model="email"
          placeholder="email@example.com"
        />
        <Button
          class="w-[80vw] xs:w-3/5 sm:w-5/6 lg:w-1/5"
          :disabled="email === '' || reset.loading"
          @click="
            () => {
              handleNext(nextStep)
            }
          "
        >
          <Loader2 v-if="reset.loading" class="w-4 h-4 animate-spin" />

          Next
        </Button>
      </div>

      <!-- Step 2 Content -->
      <div v-if="currentStep === 2" class="w-full flex flex-col items-center gap-4">
        <p>Verification code sent to {{ email }}</p>
        <Input
          class="w-[80vw] xs:w-3/5 sm:w-5/6 lg:w-1/5"
          v-model="verificationCode"
          placeholder="Verification code"
          @keypress="onKeyPress"
          @input="onInput"
        />
        <Button
          class="w-[80vw] xs:w-3/5 sm:w-5/6 lg:w-1/5"
          :disabled="verificationCode === '' || reset.loading"
          @click="
            () => {
              handleVerify(nextStep)
            }
          "
        >
          <Loader2 v-if="reset.loading" class="w-4 h-4 animate-spin" />
          Verify
        </Button>
      </div>

      <!-- Step 3 Content -->
      <div v-if="currentStep === 3" class="w-full flex flex-col items-center gap-4">
        <p>Set your new password</p>
        <div class="w-[80vw] xs:w-3/5 sm:w-5/6 lg:w-1/5 relative">
          <Input
            v-model="newPassword"
            :type="showNewPassword ? 'text' : 'password'"
            placeholder="New password"
          />
          <EyeClosed
            class="size-5 absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground text-2xl cursor-pointer"
            :class="showNewPassword ? 'hidden' : ''"
            @click="ToggleShowNewPassword"
          />
          <Eye
            class="size-5 absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground text-2xl cursor-pointer"
            :class="showNewPassword ? '' : 'hidden'"
            @click="ToggleShowNewPassword"
          />
        </div>
        <div class="w-[80vw] xs:w-3/5 sm:w-5/6 lg:w-1/5 relative">
          <Input
            v-model="confirmPassword"
            :type="showConfirmPassword ? 'text' : 'password'"
            placeholder="Confirm password"
          />
          <EyeClosed
            icon="radix-icons:eye-closed"
            class="size-5 absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground text-2xl cursor-pointer"
            :class="showConfirmPassword ? 'hidden' : ''"
            @click="ToggleShowConfirmPassword"
          />
          <Eye
            icon="radix-icons:eye-open"
            class="size-5 absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground text-2xl cursor-pointer"
            :class="showConfirmPassword ? '' : 'hidden'"
            @click="ToggleShowConfirmPassword"
          />
        </div>
        <Button
          class="w-[80vw] xs:w-3/5 sm:w-5/6 lg:w-1/5"
          :disabled="newPassword === '' || confirmPassword === '' || reset.loading"
          @click="handleSubmit"
        >
          <Loader2 v-if="reset.loading" class="w-4 h-4 animate-spin" />
          Submit
        </Button>
      </div>
      <Button
        :disabled="reset.loading"
        v-if="currentStep > 1"
        class="w-[80vw] xs:w-3/5 sm:w-5/6 lg:w-1/5"
        @click="
          () => {
            prevStep()
            currentStep -= 1
          }
        "
      >
        <Loader2 v-if="reset.loading" class="w-4 h-4 animate-spin" />
        Back
      </Button>
    </Stepper>
  </div>
</template>
