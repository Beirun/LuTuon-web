<script lang="ts" setup>
import SideBar from '@/components/SideBar.vue'
import { Separator } from '@/components/ui/separator'
// import {Icon} from '@iconify/vue'
import { Bell } from 'lucide-vue-next'
import { lineOptions, vBarOptions, hBarOptions } from '@/lib/chartConfig'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  scales,
  BarElement,
} from 'chart.js'
import { Bar, Line } from 'vue-chartjs'

const lineData = {
  labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
  datasets: [
    {
      label: 'Data One',
      data: [40, 39, 10, 40, 39, 80, 40],
      borderColor: '#F8C600',
      pointRadius: 6,
      pointBorderColor: '#F8C600',
      pointBorderWidth: 3,
      pointBackgroundColor: '#fafafa',
    },
  ],
}

const hBarData = {
  labels: ['Adobo', 'Torta', 'Humba', 'Tinola'],
  datasets: [
    {
      label: 'Data One',
      backgroundColor: '#F8C600',
      data: [40, 20, 12, 11],
    },
  ],
}

const vBarData = {
  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  datasets: [
    {
      label: 'Data One',
      backgroundColor: '#F8C600',
      data: [40, 20, 12, 11, 20, 15, 10],
    },
  ],
}

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
  <div class="w-screen h-screen flex lg:justify-end">
    <div class="lg:w-5/6 w-full md:w-full h-full flex justify-center items-center right-0">
      <div class="w-7/8 h-7/8">
        <div class="flex justify-between mb-10 lg:mb-5">
          <p class="text-3xl">Welcome to dashboard, <b>Admin!</b></p>
        </div>
        <Separator class="text-[#DBDBE0] mb-10 lg:mb-0" />
        <div class="w-full h-full flex flex-col gap-10 justify-end">
          <div class="w-full h-1/2 outline-1 dark:outline-gray-200/10 dark:bg-[#1e1e1e]/10 bg-[#e8e8e8]/10 rounded-2xl pt-5 pb-16 pl-5 pr-8">
            <p class="lg:text-2xl font-bold pb-4 px-5">Registered Users</p>
            <Line :data="lineData" :options="lineOptions" />
          </div>
          <div class="w-full lg:h-2/5 h-full flex lg:flex-row flex-col gap-10 pb-10">
            <div class="w-full lg:w-1/2 h-full outline-1 dark:outline-gray-200/10 dark:bg-[#1e1e1e]/10 bg-[#e8e8e8]/10 rounded-2xl p-5 pb-12">
              <p class="lg:text-2xl font-bold">Most Played Dish</p>
              <Bar :data="hBarData" :options="hBarOptions" />
            </div>
            <div class="w-full lg:w-1/2 h-full outline-1 dark:outline-gray-200/10 dark:bg-[#1e1e1e]/10 bg-[#e8e8e8]/10 rounded-2xl p-5 pb-12">
              <p class="lg:text-2xl font-bold">Weekly Players</p>
              <Bar :data="vBarData" :options="vBarOptions" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
