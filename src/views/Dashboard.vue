<!-- eslint-disable vue/multi-word-component-names -->
<script lang="ts" setup>
import { Separator } from '@/components/ui/separator'
import { lineOptions, vBarOptions, hBarOptions } from '@/lib/chartConfig'
import { useReportStore } from '@/stores/report'
import { useUserStore } from '@/stores/user'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  BarElement,
} from 'chart.js'
import { ref, onBeforeMount, computed } from 'vue'
import { Bar, Line } from 'vue-chartjs'

const user = useUserStore()
const report = useReportStore()

const lineData = computed(() => {
  const now = new Date()
  const months = new Map<string, number>()

  // initialize 12-month window with zero
  for (let i = 0; i < 12; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
    months.set(key, 0)
  }

  // count actual users in that 12-month window
  for (let i = 0; i < user.users.length; i++) {
    const d = new Date(user.users[i].dateCreated)

    const diff =
      (now.getFullYear() - d.getFullYear()) * 12 +
      (now.getMonth() - d.getMonth())

    if (diff >= 0 && diff < 12) {
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
      months.set(key, (months.get(key) || 0) + 1)
    }
  }

  const sorted = [...months.entries()].sort((a, b) => a[0].localeCompare(b[0]))

  const labels: string[] = []
  const values: number[] = []

  for (let i = 0; i < sorted.length; i++) {
    const [y, m] = sorted[i][0].split('-')

    const full = new Date(`${y}-${m}-01`).toLocaleString('en-US', {
      month: 'long',
      year: 'numeric',
    })

    labels.push(full)
    values.push(sorted[i][1])
  }

  for(let i = values.length; i >=0; i--){
    if(values[i] !== 0) continue

    if(i-1 >= 0 && values[i-1] === 0){
      labels.splice(i - 1, 1)
      values.splice(i - 1, 1)
    }
  }
  return {
    labels,
    datasets: [
      {
        label: 'Users Created',
        data: values,
        borderColor: '#F8C600',
        pointRadius: 6,
        pointBorderColor: '#F8C600',
        pointBorderWidth: 3,
        pointBackgroundColor: '#fafafa',
      },
    ],
  }
})




const hBarData = computed(() => {
  const dishes = ['Tinolang Manok', 'Adobong Manok', 'Humba', 'Tortang Talong']
  const count = new Map<string, number>()

  // initialize all to 0
  for (let i = 0; i < dishes.length; i++) count.set(dishes[i], 0)

  // count attempts
  for (let i = 0; i < report.reports.length; i++) {
    const r = report.reports[i]
    if (count.has(r.foodName)) count.set(r.foodName, (count.get(r.foodName) || 0) + 1)
  }

  const labels: string[] = []
  const values: number[] = []

  for (let i = 0; i < dishes.length; i++) {
    labels.push(dishes[i])
    values.push(count.get(dishes[i]) || 0)
  }

  return {
    labels,
    datasets: [
      {
        label: 'Most Played Dish',
        backgroundColor: '#F8C600',
        data: values,
      },
    ],
  }
})


const vBarData = computed(() => {
  const names = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const counts = Array(7).fill(0)

  // count attempts by weekday
  for (let i = 0; i < report.reports.length; i++) {
    const d = new Date(report.reports[i].attemptDate)
    counts[d.getDay()]++
  }

  // rotate so first item is tomorrow
  const today = new Date().getDay()
  const start = (today + 1) % 7

  const rotatedLabels: string[] = []
  const rotatedValues: number[] = []

  for (let i = 0; i < 7; i++) {
    const idx = (start + i) % 7
    rotatedLabels.push(names[idx])
    rotatedValues.push(counts[idx])
  }

  return {
    labels: rotatedLabels,
    datasets: [
      {
        label: 'Weekly Players',
        backgroundColor: '#F8C600',
        data: rotatedValues,
      },
    ],
  }
})


onBeforeMount(async () => {
  await report.fetchReports()
  await user.fetchUsers()

  console.log("reports", report.reports)
 
})

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
)
</script>


<template>
  <div class="min-h-screen w-full flex justify-end">
    <!-- Sidebar would typically go here but is commented out -->

    <div class="flex flex-col p-4 md:p-6 lg:p-8 w-full md:w-5/6">
      <div class="mb-6">
        <p class="text-2xl md:text-3xl">Welcome to dashboard, <b>Admin!</b></p>
      </div>
      <Separator class="text-[#DBDBE0] mb-6" />

      <div class="grid grid-cols-1 gap-6">
        <!-- Registered Users Chart -->
        <div
          class="outline-1 dark:outline-gray-200/10 dark:bg-[#1e1e1e]/10 bg-[#e8e8e8]/10 rounded-2xl p-4 md:p-6 shadow-sm"
        >
          <p class="text-xl md:text-2xl font-bold mb-4">Registered Users</p>
          <div class="h-64 md:h-80">
            <Line
              :data="lineData"
              :options="{ ...lineOptions, responsive: true, maintainAspectRatio: false }"
            />
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-5 sm:mb-5 md:mb-0">
          <!-- Most Played Dish -->
          <div
            class="outline-1 dark:outline-gray-200/10 dark:bg-[#1e1e1e]/10 bg-[#e8e8e8]/10 rounded-2xl p-4 md:p-6 shadow-sm"
          >
            <p class="text-xl md:text-2xl font-bold mb-4">Most Played Dish</p>
            <div class="h-64">
              <Bar
                :data="hBarData"
                :options="{ ...hBarOptions, responsive: true, maintainAspectRatio: false }"
              />
            </div>
          </div>

          <!-- Weekly Players -->
          <div
            class="outline-1 dark:outline-gray-200/10 dark:bg-[#1e1e1e]/10 bg-[#e8e8e8]/10 rounded-2xl p-4 md:p-6 shadow-sm"
          >
            <p class="text-xl md:text-2xl font-bold mb-4">Weekly Players</p>
            <div class="h-64">
              <Bar
                :data="vBarData"
                :options="{ ...vBarOptions, responsive: true, maintainAspectRatio: false }"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
