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
        <div class="flex justify-between -mt-10 sm:mt-0">
          <p class="text-3xl">Welcome to dashboard, <b>Admin!</b></p>
        </div>
        <Separator class="text-[#DBDBE0] mt-5 mb-13 sm:mb-0" />
        <div class="w-full h-full flex flex-col gap-10 justify-end mt-[3vh] sm:mt-0">
          <div class="w-full sm:h-1/2 h-[25vh] outline-1 rounded-2xl pt-5 pb-16 pl-5 pr-8">
            <p class="lg:text-2xl font-bold pb-4 px-5">Registered Users</p>
            <Line :data="lineData" :options="lineOptions" />
          </div>
          <div class="w-full lg:h-2/5 h-full flex lg:flex-row flex-col gap-10 pb-10">

            <div class="sm:w-1/2 w-full sm:h-full h-[25vh] outline-1 rounded-2xl p-5 pb-12">
              <p class="lg:text-2xl font-bold">Most Played Dish</p>
              <Bar :data="hBarData" :options="hBarOptions" />
            </div>
            <div class="sm:w-1/2 w-full sm:h-full h-[25vh] outline-1 rounded-2xl p-5 pb-12">
              <p class="lg:text-2xl font-bold">Weekly Players</p>
              <Bar :data="vBarData" :options="vBarOptions" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
