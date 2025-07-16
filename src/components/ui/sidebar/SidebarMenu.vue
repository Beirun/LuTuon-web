<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'

const props = defineProps<{
  class?: HTMLAttributes['class']
}>()
</script>

<template>
  <ul
    data-slot="sidebar-menu"
    data-sidebar="menu"
    :class="cn('text-[#E7E7E7] mt-10 h-full flex w-3/4 min-w-0 flex-col gap-10', props.class)"
  >
    <slot />
  </ul>
</template>
