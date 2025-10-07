<!-- src/components/NotFound.vue -->
<template>
  <div
    class="min-h-screen flex items-center justify-center px-6 transition-colors duration-300"
    :class="
      isDark
        ? 'bg-[var(--background)] text-[var(--foreground)]'
        : 'bg-[var(--background)] text-[var(--foreground)]'
    "
  >
    <main class="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
      <section class="space-y-5 text-center md:text-left">
        <img src="@/assets/logo.png" class="w-28 mx-auto md:mx-0" alt="Logo" />

        <h3
          class="text-6xl md:text-7xl font-extrabold leading-tight"
          :style="{ color: 'var(--primary)' }"
        >
          404
        </h3>

        <p class="text-lg md:text-xl" :style="{ color: 'var(--muted-foreground)' }">
          The page you’re looking for can’t be found. It might have been removed, had its name
          changed, or is temporarily unavailable.
        </p>

        <div class="flex flex-col sm:flex-row justify-center md:justify-start gap-3">
          <button
            @click="goback"
            class="cursor-pointer inline-flex justify-center items-center px-5 py-3 rounded-lg font-medium shadow w-full sm:w-auto"
            :style="{ backgroundColor: 'var(--primary)', color: 'var(--primary-foreground)' }"
          >
            Go Back
          </button>
        </div>

        <p class="text-sm" :style="{ color: 'var(--muted-foreground)' }">
          Tip: check the URL for typos or return to the homepage.
        </p>
      </section>

      <aside class="hidden md:flex items-center justify-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 600 400"
          class="w-full max-w-md"
          role="img"
          aria-labelledby="notFoundTitle notFoundDesc"
        >
          <title id="notFoundTitle">Lost illustration</title>
          <desc id="notFoundDesc">A simple illustration representing a lost page.</desc>
          <g fill="none" fill-rule="evenodd">
            <rect width="600" height="400" rx="24" fill="var(--muted)" />
            <g transform="translate(80 60)">
              <rect width="440" height="280" rx="16" fill="var(--card)" stroke="var(--border)" />
              <g transform="translate(40 30)">
                <circle cx="120" cy="60" r="46" fill="var(--muted)" />
                <path
                  d="M98 138c18 10 44 10 62 0"
                  :stroke="isDark ? '#818CF8' : '#C7D2FE'"
                  stroke-width="6"
                  stroke-linecap="round"
                />
                <rect x="220" y="20" width="120" height="80" rx="8" fill="var(--muted)" />
                <rect x="220" y="120" width="130" height="16" rx="4" fill="var(--input)" />
                <rect x="220" y="146" width="90" height="12" rx="4" fill="var(--input)" />
                <circle cx="136" cy="58" r="8" fill="var(--primary)" />
                <path
                  d="M94 56c10-8 36-8 46 0"
                  :stroke="isDark ? '#A5B4FC' : '#94A3B8'"
                  stroke-width="4"
                  stroke-linecap="round"
                />
              </g>
            </g>
          </g>
        </svg>
      </aside>
    </main>
  </div>
</template>

<script setup lang="ts">
import router from '@/router'
import { ref, onMounted } from 'vue'

const showBackConfirm = ref(false)
const isDark = ref(false)

onMounted(() => {
  const updateDarkMode = () => (isDark.value = document.documentElement.classList.contains('dark'))
  updateDarkMode()
  const observer = new MutationObserver(updateDarkMode)
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
})

function goback() {
  showBackConfirm.value = false
  try {
    if (window.history.length > 1) router.back()
    else router.push('/')
  } catch {
    router.push('/')
  }
}
</script>

<style scoped>
:root,
.dark {
  transition:
    background-color 0.3s ease,
    color 0.3s ease;
}
</style>
