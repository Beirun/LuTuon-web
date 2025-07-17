<script setup lang="ts">
// import { Icon } from '@iconify/vue'
import { useColorMode } from '@vueuse/core'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Moon, Sun } from 'lucide-vue-next'

// Pass { disableTransition: false } to enable transitions
const mode = useColorMode({ disableTransition: false })
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <Button variant="outline" class="cursor-pointer shadow-md inset-shadow-black/50 size-9 sm:size-9 md:size-12 py-1 active:brightness-90 hover:brightness-95 duration-300">
        <Sun class="size-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
        <Moon class="absolute size-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        <span class="sr-only">Toggle theme</span>
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end">
      <DropdownMenuItem @click="mode = 'light'" class="cursor-pointer">
        Light
      </DropdownMenuItem>
      <DropdownMenuItem @click="mode = 'dark'" class="cursor-pointer">
        Dark
      </DropdownMenuItem>
      <DropdownMenuItem @click="mode = 'auto'" class="cursor-pointer">
        System
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>