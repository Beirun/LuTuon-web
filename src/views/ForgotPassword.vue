<script setup lang="ts">
import {
  Stepper,
  StepperDescription,
  StepperIndicator,
  StepperItem,
  StepperSeparator,
  StepperTitle,
  StepperTrigger,
} from '@/components/ui/stepper'
import { ref } from 'vue'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Eye, EyeClosed, Check } from 'lucide-vue-next'

const currentStep = ref(1)
const email = ref('')
const verificationCode = ref('')
const newPassword = ref('')
const confirmPassword = ref('')

const showNewPassword = ref(false)
const showConfirmPassword = ref(false)

const handleNext = () => {
  if (email.value !== '') {
    currentStep.value = 2
  }
}

const handleVerify = () => {
  if (verificationCode.value !== '') {
    currentStep.value = 3
  }
}

const handleSubmit = () => {
  if (newPassword.value !== '' && confirmPassword.value !== '') {
    // Handle password submission logic here
    console.log('Password changed successfully!')
  }
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
        <StepperItem v-slot="{ state }" :step="1" :active-step="currentStep">
          <StepperTrigger :disabled="true">
            <StepperIndicator>
              <span v-if="currentStep > 1"><Check /></span>
              <span v-else class="font-bold">1</span>
            </StepperIndicator>
            <StepperTitle>Enter Email</StepperTitle>
          </StepperTrigger>
          <StepperSeparator class="w-full h-px" />
        </StepperItem>

        <StepperItem v-slot="{ state }" :step="2" :active-step="currentStep">
          <StepperTrigger :disabled="true">
            <StepperIndicator>
              <span v-if="currentStep > 2"><Check /></span>
              <span v-else class="font-bold">2</span>
            </StepperIndicator>
            <StepperTitle>Verification</StepperTitle>
          </StepperTrigger>
          <StepperSeparator class="w-full h-px" />
        </StepperItem>

        <StepperItem v-slot="{ state }" :step="3" :active-step="currentStep">
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
          :disabled="email === ''"
          @click="
            () => {
              handleNext()
              nextStep()
            }
          "
        >
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
        />
        <Button
          class="w-[80vw] xs:w-3/5 sm:w-5/6 lg:w-1/5"
          :disabled="verificationCode === ''"
          @click="
            () => {
              handleVerify()
              nextStep()
            }
          "
        >
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
          :disabled="newPassword === '' || confirmPassword === ''"
          @click="handleSubmit"
        >
          Submit
        </Button>
      </div>
      <Button
        v-if="currentStep > 1"
        class="w-[80vw] xs:w-3/5 sm:w-5/6 lg:w-1/5"
        @click="
          () => {
            prevStep()
            currentStep -= 1
          }
        "
      >
        Back
      </Button>
    </Stepper>
  </div>
</template>
