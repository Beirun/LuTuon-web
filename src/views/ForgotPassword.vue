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
import { Icon } from '@iconify/vue'

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
  <div class="w-screen h-screen flex flex-col justify-center items-center">
    <div class-="w-1/5 flex flex-col justify-center items-center">

    </div>
    <p class="text-2xl font-bold mb-6">Forgot Password?</p>
    <Stepper class="w-full mb-8 flex justify-center">
      <StepperItem :step="1" :active-step="currentStep">
        <StepperTrigger :disabled="true">
          <StepperIndicator>
            <span v-if="currentStep > 1">✓</span>
            <span v-else>1</span>
          </StepperIndicator>
          <StepperTitle>Enter Email</StepperTitle>
        </StepperTrigger>
        <StepperSeparator class="w-full h-px" />
      </StepperItem>

      <StepperItem :step="2" :active-step="currentStep">
        <StepperTrigger :disabled="true">
          <StepperIndicator>
            <span v-if="currentStep > 2">✓</span>
            <span v-else>2</span>
          </StepperIndicator>
          <StepperTitle>Verification</StepperTitle>
        </StepperTrigger>
        <StepperSeparator class="w-full h-px" />
      </StepperItem>

      <StepperItem :step="3" :active-step="currentStep">
        <StepperTrigger :disabled="true">
          <StepperIndicator>
            <span>3</span>
          </StepperIndicator>
          <StepperTitle>Set Password</StepperTitle>
        </StepperTrigger>
      </StepperItem>
    </Stepper>

    <!-- Step 1 Content -->
    <div v-if="currentStep === 1" class="w-full flex flex-col items-center gap-4">
      <p>Please enter the account you want to change the password for</p>
      <Input class="w-1/5" v-model="email" placeholder="email@example.com" />
      <Button
        class="w-1/5"
        :disabled="email === ''"
        @click="handleNext"
      >
        Next
      </Button>
    </div>

    <!-- Step 2 Content -->
    <div v-if="currentStep === 2" class="w-full flex flex-col items-center gap-4">
      <p>Verification code sent to {{ email }}</p>
      <Input v-model="verificationCode" class="w-1/5" placeholder="Verification code" />
      <Button
        class="w-1/5"
        :disabled="verificationCode === ''"
        @click="handleVerify"
      >
        Verify
      </Button>
    </div>

    <!-- Step 3 Content -->
    <div v-if="currentStep === 3" class="w-full flex flex-col items-center gap-4">
      <p>Set your new password</p>
      <div class="w-1/5 relative">
        <Input
          v-model="newPassword"
          :type="showNewPassword ? 'text' : 'password'"
          placeholder="New password"
        />
        <Icon
          icon="radix-icons:eye-closed"
          class="size-5 absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground text-2xl cursor-pointer"
          :class="showNewPassword ? 'hidden' : ''"
          @click="ToggleShowNewPassword"
        />
        <Icon
          icon="radix-icons:eye-open"
          class="size-5 absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground text-2xl cursor-pointer"
          :class="showNewPassword ? '' : 'hidden'"
          @click="ToggleShowNewPassword"
        />
      </div>
      <div class="w-1/5 relative">
        <Input
          v-model="confirmPassword"
          :type="showConfirmPassword ? 'text' : 'password'"
          placeholder="Confirm password"
        />
        <Icon
          icon="radix-icons:eye-closed"
          class="size-5 absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground text-2xl cursor-pointer"
          :class="showConfirmPassword ? 'hidden' : ''"
          @click="ToggleShowConfirmPassword"
        />
        <Icon
          icon="radix-icons:eye-open"
          class="size-5 absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground text-2xl cursor-pointer"
          :class="showConfirmPassword ? '' : 'hidden'"
          @click="ToggleShowConfirmPassword"
        />
      </div>
      <Button
        class="w-1/5"
        :disabled="newPassword === '' || confirmPassword === ''"
        @click="handleSubmit"
      >
        Submit
      </Button>
    </div>
  </div>
</template>