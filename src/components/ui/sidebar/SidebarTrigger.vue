<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { PanelLeft } from 'lucide-vue-next'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { useSidebar } from './utils'

const props = defineProps<{
  class?: HTMLAttributes['class']
}>()

const { toggleSidebar } = useSidebar()
</script>

<template>
  <Button
    data-sidebar="trigger"
    data-slot="sidebar-trigger"
    variant="ghost"
    size="icon"
    :class="cn('size-8 relative top-3 left-3', props.class)"
    @click="toggleSidebar"
  >
    <PanelLeft class="size-7 text-black dark:text-[#E7E7E7]"/>
    <span class="sr-only">Toggle Sidebar</span>
  </Button>
</template>
