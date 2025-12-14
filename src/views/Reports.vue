<!-- eslint-disable vue/multi-word-component-names -->
<script lang="ts" setup>
import { Separator } from '@/components/ui/separator'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Skeleton } from '@/components/ui/skeleton'
import { useReportStore } from '@/stores/report'
import { onBeforeMount, ref, computed, watch } from 'vue'
import { diffMinutesSeconds, formatDateTime } from '@/plugins/date'
import { Input } from '@/components/ui/input'
import { Button, buttonVariants } from '@/components/ui/button'

// Pagination components
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import type { DateValue } from '@internationalized/date'
import type { DateRange } from 'reka-ui'
import type { Grid } from 'reka-ui/date'
import type { Ref } from 'vue'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { CalendarDate, isEqualMonth } from '@internationalized/date'
import { Calendar, ChevronLeft, ChevronRight, Check, Triangle, Download } from 'lucide-vue-next'
import { RangeCalendarRoot, useDateFormatter } from 'reka-ui'
import { createMonth, toDate } from 'reka-ui/date'
import { cn } from '@/lib/utils'
import {
  RangeCalendarCell,
  RangeCalendarCellTrigger,
  RangeCalendarGrid,
  RangeCalendarGridBody,
  RangeCalendarGridHead,
  RangeCalendarGridRow,
  RangeCalendarHeadCell,
} from '@/components/ui/range-calendar'
import { jsPDF } from 'jspdf'
import { autoTable } from 'jspdf-autotable'
import logo from '@/assets/logo.png'
import { useSonnerStore } from '@/stores/sonner'

const sonner = useSonnerStore()

const filter = ref('')
const searchQuery = ref('')

const changeFilter = (filterBy: string) => {
  filter.value = filterBy
  searchQuery.value = ''
}

const today = new Date()
const start = new CalendarDate(today.getFullYear(), today.getMonth() + 1, today.getDate())

const value = ref({
  start,
  end: start.add({ days: 20 }),
}) as Ref<DateRange>

const locale = ref('en-US')
const formatter = useDateFormatter(locale.value)

const placeholder = ref(value.value.start) as Ref<DateValue>
const secondMonthPlaceholder = ref(value.value.end) as Ref<DateValue>

const firstMonth = ref(
  createMonth({
    dateObj: placeholder.value,
    locale: locale.value,
    fixedWeeks: true,
    weekStartsOn: 0,
  }),
) as Ref<Grid<DateValue>>

const secondMonth = ref(
  createMonth({
    dateObj: secondMonthPlaceholder.value,
    locale: locale.value,
    fixedWeeks: true,
    weekStartsOn: 0,
  }),
) as Ref<Grid<DateValue>>

function updateMonth(reference: 'first' | 'second', months: number) {
  if (reference === 'first') {
    placeholder.value = placeholder.value.add({ months })
  } else {
    secondMonthPlaceholder.value = secondMonthPlaceholder.value.add({
      months,
    })
  }
}
watch(placeholder, (_placeholder) => {
  firstMonth.value = createMonth({
    dateObj: _placeholder,
    weekStartsOn: 0,
    fixedWeeks: false,
    locale: locale.value,
  })
  if (isEqualMonth(secondMonthPlaceholder.value, _placeholder)) {
    secondMonthPlaceholder.value = secondMonthPlaceholder.value.add({
      months: 1,
    })
  }
})

watch(secondMonthPlaceholder, (_secondMonthPlaceholder) => {
  secondMonth.value = createMonth({
    dateObj: _secondMonthPlaceholder,
    weekStartsOn: 0,
    fixedWeeks: false,
    locale: locale.value,
  })
  if (isEqualMonth(_secondMonthPlaceholder, placeholder.value))
    placeholder.value = placeholder.value.subtract({ months: 1 })
})

const report = useReportStore()

// pagination state
const currentPage = ref(1)
const itemsPerPage = 15

// filtering first
const filteredReports = computed(() => {
  if (!report.reports.length) return []

  if (filter.value === 'username') {
    return report.reports.filter((r) =>
      r.userName?.toLowerCase().includes(searchQuery.value.toLowerCase()),
    )
  }
  if (filter.value === 'point') {
    return report.reports.filter((r) =>
      r.attemptPoint?.toLowerCase().includes(searchQuery.value.toLowerCase()),
    )
  }
  if (filter.value === 'food') {
    return report.reports.filter((r) =>
      r.foodName?.toLowerCase().includes(searchQuery.value.toLowerCase()),
    )
  }
  if (filter.value === 'type') {
    return report.reports.filter((r) =>
      r.attemptType?.toLowerCase().includes(searchQuery.value.toLowerCase()),
    )
  }
  if (filter.value === 'date' && value.value.start && value.value.end) {
    const startDate = toDate(value.value.start).getTime()
    const endDate = toDate(value.value.end).getTime() + (24 * 60 * 60 * 1000 - 1)
    return report.reports.filter((r) => {
      const date = new Date(r.attemptDate).getTime()
      return date >= startDate && date <= endDate
    })
  }

  return report.reports.filter(
    (r) =>
      r.userName?.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      r.attemptPoint?.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      r.foodName?.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      r.attemptDate?.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      r.attemptType?.toLowerCase().includes(searchQuery.value.toLowerCase()),
  )
})

const paginatedReports = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  return filteredReports.value.slice(start, start + itemsPerPage)
})

onBeforeMount(async () => {
  if (report.reports.length === 0) await report.fetchReports()
})
// then paginate
const totalPages = computed(() => Math.ceil(filteredReports.value.length / itemsPerPage))

const exportData = async () => {
  if (!filteredReports.value.length){
    sonner.error("No Data Found.")
    return
  }
  const count = filteredReports.value.length
  const now = new Date()
  const doc = new jsPDF()

  const img = new Image()
  img.src = logo
  await new Promise((resolve) => {
    img.onload = resolve
  })


  const pageWidth = doc.internal.pageSize.getWidth()
  const title = 'Reports'
  const titleX = pageWidth/2
  const startY = 30

  const imgWidth = 40
  const imgHeight = 15
  const x = (pageWidth - imgWidth)/2
  const y = 10

  doc.addImage(img, 'PNG', x, y,imgWidth,imgHeight)

  doc.setFont('helvetica', 'bold')
  doc.text(title, titleX, startY,{align: 'center'})

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  if (filter.value && searchQuery.value != ""){
    const cap = filter.value ? filter.value[0].toUpperCase() + filter.value.slice(1).toLowerCase() : ''
    doc.text(`Filter: ${cap} | Query: ${searchQuery.value} | Total Rows: ${count}`, titleX, startY+5, {align:'center'})
  }
  else{
    doc.text(`Filter: ALL | Total Rows: ${count}`, titleX, startY+5, {align:'center'})
  }
  doc.text(`Generated on: ${now.toLocaleDateString()} @ ${now.toLocaleTimeString()}`, titleX, startY+10, {align:'center'})
  doc.setFont('helvetica', 'italic')

  const tableColumn = ['No.','Username', 'Point', 'Food','Date','Duration', 'Type']
  const tableRows = filteredReports.value.map((r, i) => [
    i + 1,
    r.userName,
    r.attemptPoint,
    r.foodName,
    formatDateTime(r.attemptDate),
    r.attemptDuration,
    r.attemptType,
  ])

  autoTable(doc, {
    head: [tableColumn],
    body: tableRows,
    startY: startY+15,
    styles: {fontSize: 8},
    headStyles: {fillColor: [41,128,185]},
  })
  if (filter.value && searchQuery.value != ""){
    doc.save(`LuTuon_Reports_FilteredBy=${filter.value.toUpperCase()}_Query=${searchQuery.value}_${now.toLocaleDateString()}.pdf`)
  }else{
    doc.save(`LuTuon_Reports_${now.toLocaleDateString()}.pdf`)
  }
}
</script>

<template>
  <div class="min-h-screen w-full flex justify-end">
    <div class="flex flex-col p-4 xs:pl-4 sm:pl-8 md:p-6 md:pr-2 md:pl-18 lg:p-8 w-full md:w-5/6">
      <div class="md:p-10">
        <div
          class="flex flex-col sm:flex-col md:flex-col lg:flex-row justify-between mb-5 lg:mb-5 gap-5"
        >
          <p class="text-3xl font-bold">Reports</p>
          <div class="w-full sm:w-full md:w-full lg:w-1/3 flex items-center justify-end gap-2">
            <Input
              v-if="
                filter === '' ||
                filter === 'username' ||
                filter === 'point' ||
                filter === 'food' ||
                filter === 'type'
              "
              v-model="searchQuery"
              placeholder="Search"
            />
            <Popover v-else>
              <PopoverTrigger as-child>
                <Button
                  variant="outline"
                  :class="
                    cn(
                      'w-fit justify-start text-left font-normal',
                      !value && 'text-muted-foreground',
                    )
                  "
                >
                  <Calendar class=" h-4 w-4" />
                  <template v-if="value.start">
                    <template v-if="value.end">
                      {{
                        formatter.custom(toDate(value.start), {
                          dateStyle: 'medium',
                        })
                      }}
                      -
                      {{
                        formatter.custom(toDate(value.end), {
                          dateStyle: 'medium',
                        })
                      }}
                    </template>

                    <template v-else>
                      {{
                        formatter.custom(toDate(value.start), {
                          dateStyle: 'medium',
                        })
                      }}
                    </template>
                  </template>
                  <template v-else> Pick a date </template>
                </Button>
              </PopoverTrigger>
              <PopoverContent class="w-auto p-0">
                <RangeCalendarRoot
                  v-slot="{ weekDays }"
                  v-model="value"
                  v-model:placeholder="placeholder"
                  class="p-3"
                >
                  <div class="flex flex-col gap-y-4 mt-4 sm:flex-row sm:gap-x-4 sm:gap-y-0">
                    <div class="flex flex-col gap-4">
                      <div class="flex items-center justify-between">
                        <button
                          :class="
                            cn(
                              buttonVariants({ variant: 'outline' }),
                              'h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100',
                            )
                          "
                          @click="updateMonth('first', -1)"
                        >
                          <ChevronLeft class="h-4 w-4" />
                        </button>
                        <div :class="cn('text-sm font-medium')">
                          {{ formatter.fullMonthAndYear(toDate(firstMonth.value)) }}
                        </div>
                        <button
                          :class="
                            cn(
                              buttonVariants({ variant: 'outline' }),
                              'h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100',
                            )
                          "
                          @click="updateMonth('first', 1)"
                        >
                          <ChevronRight class="h-4 w-4" />
                        </button>
                      </div>
                      <RangeCalendarGrid>
                        <RangeCalendarGridHead>
                          <RangeCalendarGridRow>
                            <RangeCalendarHeadCell
                              v-for="day in weekDays"
                              :key="day"
                              class="w-full"
                            >
                              {{ day }}
                            </RangeCalendarHeadCell>
                          </RangeCalendarGridRow>
                        </RangeCalendarGridHead>
                        <RangeCalendarGridBody>
                          <RangeCalendarGridRow
                            v-for="(weekDates, index) in firstMonth.rows"
                            :key="`weekDate-${index}`"
                            class="mt-2 w-full"
                          >
                            <RangeCalendarCell
                              v-for="weekDate in weekDates"
                              :key="weekDate.toString()"
                              :date="weekDate"
                            >
                              <RangeCalendarCellTrigger :day="weekDate" :month="firstMonth.value" />
                            </RangeCalendarCell>
                          </RangeCalendarGridRow>
                        </RangeCalendarGridBody>
                      </RangeCalendarGrid>
                    </div>
                    <div class="flex flex-col gap-4">
                      <div class="flex items-center justify-between">
                        <button
                          :class="
                            cn(
                              buttonVariants({ variant: 'outline' }),
                              'h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100',
                            )
                          "
                          @click="updateMonth('second', -1)"
                        >
                          <ChevronLeft class="h-4 w-4" />
                        </button>
                        <div :class="cn('text-sm font-medium')">
                          {{ formatter.fullMonthAndYear(toDate(secondMonth.value)) }}
                        </div>

                        <button
                          :class="
                            cn(
                              buttonVariants({ variant: 'outline' }),
                              'h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100',
                            )
                          "
                          @click="updateMonth('second', 1)"
                        >
                          <ChevronRight class="h-4 w-4" />
                        </button>
                      </div>
                      <RangeCalendarGrid>
                        <RangeCalendarGridHead>
                          <RangeCalendarGridRow>
                            <RangeCalendarHeadCell
                              v-for="day in weekDays"
                              :key="day"
                              class="w-full"
                            >
                              {{ day }}
                            </RangeCalendarHeadCell>
                          </RangeCalendarGridRow>
                        </RangeCalendarGridHead>
                        <RangeCalendarGridBody>
                          <RangeCalendarGridRow
                            v-for="(weekDates, index) in secondMonth.rows"
                            :key="`weekDate-${index}`"
                            class="mt-2 w-full"
                          >
                            <RangeCalendarCell
                              v-for="weekDate in weekDates"
                              :key="weekDate.toString()"
                              :date="weekDate"
                            >
                              <RangeCalendarCellTrigger
                                :day="weekDate"
                                :month="secondMonth.value"
                              />
                            </RangeCalendarCell>
                          </RangeCalendarGridRow>
                        </RangeCalendarGridBody>
                      </RangeCalendarGrid>
                    </div>
                  </div>
                </RangeCalendarRoot>
              </PopoverContent>
            </Popover>
            <DropdownMenu>
              <DropdownMenuTrigger as-child>
                <Button variant="outline" class=" cursor-pointer">
                  <span class="flex gap-2"
                    >Filter <Triangle class="mt-0.5 size-4 rotate-180" />
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  @click="changeFilter('username')"
                  class="flex justify-between gap-2"
                  >Username <Check v-if="filter === 'username'" class="size-4"
                /></DropdownMenuItem>
                <DropdownMenuItem @click="changeFilter('point')" class="flex justify-between gap-2"
                  >Point <Check v-if="filter === 'point'" class="size-4"
                /></DropdownMenuItem>
                <DropdownMenuItem @click="changeFilter('food')" class="flex justify-between gap-2"
                  >Food <Check v-if="filter === 'food'" class="size-4"
                /></DropdownMenuItem>
                <DropdownMenuItem @click="changeFilter('date')" class="flex justify-between gap-2"
                  >Date <Check v-if="filter === 'date'" class="size-4"
                /></DropdownMenuItem>
                <DropdownMenuItem @click="changeFilter('type')" class="flex justify-between gap-2"
                  >Type <Check v-if="filter === 'type'" class="size-4"
                /></DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button @click="exportData"  class="cursor-pointer">PDF
              <Download />
            </Button>
          </div>
        </div>
        <Separator class="text-[#DBDBE0] mb-6" />
        <div class="w-full text-right mb-5">
          Total Rows: <span class="font-bold">{{ filteredReports.length }}</span>
        </div>
        <div class="grid grid-cols-1 gap-6">
          <div
            class="w-full max-h-[78vh] overflow-auto outline-1 dark:outline-gray-200/10 dark:bg-[#1e1e1e]/10 bg-[#e8e8e8]/10 rounded-2xl p-5"
          >
            <Table>
              <TableCaption></TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead class="font-bold text-foreground text-center"></TableHead>
                  <TableHead class="font-bold text-foreground text-center">Username</TableHead>
                  <TableHead class="font-bold text-foreground text-center">Point</TableHead>
                  <TableHead class="font-bold text-foreground text-center">Food</TableHead>
                  <TableHead class="font-bold text-foreground text-center">Date</TableHead>
                  <TableHead class="font-bold text-foreground text-center">Duration</TableHead>
                  <TableHead class="font-bold text-foreground text-center">Type</TableHead>
                </TableRow>
              </TableHeader>

              <!-- Skeleton while loading -->
              <TableBody v-if="report.loading">
                <TableRow v-for="i in 5" :key="i">
                  <TableCell class="text-center"><Skeleton class="h-4 w-20 mx-auto" /></TableCell>
                  <TableCell class="text-center"><Skeleton class="h-4 w-24 mx-auto" /></TableCell>
                  <TableCell class="text-center"><Skeleton class="h-4 w-24 mx-auto" /></TableCell>
                  <TableCell class="text-center"><Skeleton class="h-4 w-10 mx-auto" /></TableCell>
                  <TableCell class="text-center"><Skeleton class="h-4 w-10 mx-auto" /></TableCell>
                  <TableCell class="text-center"><Skeleton class="h-4 w-28 mx-auto" /></TableCell>
                  <TableCell class="text-center"><Skeleton class="h-4 w-24 mx-auto" /></TableCell>
                </TableRow>
              </TableBody>

              <!-- No reports -->
              <TableBody v-else-if="!report.reports.length">
                <TableRow class="hover:bg-transparent">
                  <TableCell
                    colspan="8"
                    class="text-center text-foreground/80 py-36 text-3xl font-bold"
                  >
                    No Reports Found
                  </TableCell>
                </TableRow>
              </TableBody>

              <!-- Data rows -->
              <TableBody v-else>
                <TableRow v-for="(r, i) in paginatedReports" :key="r.attemptId">
                  <TableCell class="text-foreground text-center">{{ (currentPage - 1) * itemsPerPage + i + 1 }}</TableCell>
                  <TableCell class="text-foreground text-center">{{ r.userName }}</TableCell>
                  <TableCell class="text-foreground text-center">{{ r.attemptPoint }}</TableCell>
                  <TableCell class="text-foreground text-center">{{ r.foodName }}</TableCell>
                  <TableCell class="text-foreground text-center">
                    {{ formatDateTime(r.attemptDate) }}
                  </TableCell>
                  <TableCell class="text-foreground text-center">
                    {{ diffMinutesSeconds(r.attemptDate, r.attemptDuration) }}
                  </TableCell>
                  <TableCell class="text-foreground text-center">{{ r.attemptType }}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </div>

        <!-- Pagination controls -->
        <div
          v-if="!report.loading && report.reports.length && totalPages > 1"
          class="flex justify-center mt-6"
        >
          <Pagination
            v-slot="{ page }"
            :items-per-page="itemsPerPage"
            :total="filteredReports.length"
            :default-page="1"
            v-model:page="currentPage"
          >
            <PaginationContent v-slot="{ items }">
              <PaginationPrevious />

              <template v-for="(item, index) in items" :key="index">
                <PaginationItem
                  v-if="item.type === 'page'"
                  :value="item.value"
                  :is-active="item.value === page"
                >
                  {{ item.value }}
                </PaginationItem>
                <PaginationEllipsis v-else :index="index" />
              </template>


              <PaginationNext />
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </div>
  </div>
</template>
