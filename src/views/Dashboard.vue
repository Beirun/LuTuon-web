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
  <div class="min-h-screen w-full flex justify-end">
    <!-- Sidebar would typically go here but is commented out -->
    
    <div class="flex flex-col p-4 md:p-6 lg:p-8 w-full md:w-5/6">
      <div class="mb-6">
        <p class="text-2xl md:text-3xl">Welcome to dashboard, <b>Admin!</b></p>
      </div>
      <Separator class="text-[#DBDBE0] mb-6" />
      
      <div class="grid grid-cols-1 gap-6">
        <!-- Registered Users Chart -->
        <div class="outline-1 
                   dark:outline-gray-200/10 dark:bg-[#1e1e1e]/10 
                   bg-[#e8e8e8]/10 rounded-2xl p-4 md:p-6 shadow-sm">
          <p class="text-xl md:text-2xl font-bold mb-4">Registered Users</p>
          <div class="h-64 md:h-80">
            <Line :data="lineData" :options="{...lineOptions, responsive: true, maintainAspectRatio: false}" />
          </div>
        </div>
        
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-5 sm:mb-5 md:mb-0">
          <!-- Most Played Dish -->
          <div class="outline-1 
                   dark:outline-gray-200/10 dark:bg-[#1e1e1e]/10 
                   bg-[#e8e8e8]/10 rounded-2xl p-4 md:p-6 shadow-sm">
            <p class="text-xl md:text-2xl font-bold mb-4">Most Played Dish</p>
            <div class="h-64">
              <Bar :data="hBarData" :options="{...hBarOptions, responsive: true, maintainAspectRatio: false}" />
            </div>
          </div>
          
          <!-- Weekly Players -->
          <div class="outline-1
                   dark:outline-gray-200/10 dark:bg-[#1e1e1e]/10 
                   bg-[#e8e8e8]/10 rounded-2xl p-4 md:p-6 shadow-sm">
            <p class="text-xl md:text-2xl font-bold mb-4">Weekly Players</p>
            <div class="h-64">
              <Bar :data="vBarData" :options="{...vBarOptions, responsive: true, maintainAspectRatio: false}" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>