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
import { useFeedbackStore } from '@/stores/feedback'
import { onBeforeMount, ref, computed, watch } from 'vue'
import { formatDateTime } from '@/plugins/date'

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
import { Input } from '@/components/ui/input'

import { Button, buttonVariants } from '@/components/ui/button'
import type { DateValue } from '@internationalized/date'
import type { DateRange } from 'reka-ui'
import type { Grid } from 'reka-ui/date'
import type { Ref } from 'vue'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { CalendarDate, isEqualMonth } from '@internationalized/date'
import { Calendar, ChevronLeft, ChevronRight, Triangle, Check, Download } from 'lucide-vue-next'
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
    secondMonthPlaceholder.value = secondMonthPlaceholder.value.add({ months })
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
    secondMonthPlaceholder.value = secondMonthPlaceholder.value.add({ months: 1 })
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

const feedbackStore = useFeedbackStore()

// Pagination state
const itemsPerPage = 15
const currentPage = ref(1)

// Filtering
const searchQuery = ref('')
const filteredFeedbacks = computed(() => {
  if (!feedbackStore.feedbacks.length) return []
  if (filter.value === 'username') {
    return feedbackStore.feedbacks.filter((f) =>
      f.userName?.toLowerCase().includes(searchQuery.value.toLowerCase()),
    )
  }
  if (filter.value === 'email') {
    return feedbackStore.feedbacks.filter((f) =>
      f.userEmail?.toLowerCase().includes(searchQuery.value.toLowerCase()),
    )
  }
  if (filter.value === 'date' && value.value.start && value.value.end) {
    const start = toDate(value.value.start).getTime()
    const d = toDate(value.value.end)
    d.setHours(23, 59, 59, 999)
    const end = d.getTime()
    return feedbackStore.feedbacks.filter((f) => {
      const feedbackTime = new Date(f.feedbackDate).getTime()
      return feedbackTime >= start && feedbackTime <= end
    })
  }
  return feedbackStore.feedbacks.filter(
    (f) =>
      f.userName?.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      f.userEmail?.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      f.feedbackMessage?.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      formatDateTime(f.feedbackDate).toLowerCase().includes(searchQuery.value.toLowerCase()),
  )
})

// paginated results
const paginatedFeedbacks = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  return filteredFeedbacks.value.slice(start, start + itemsPerPage)
})

onBeforeMount(async () => {
  if (feedbackStore.feedbacks.length === 0) await feedbackStore.fetchFeedbacks()
})

// then paginate
const totalPages = computed(() => Math.ceil(filteredFeedbacks.value.length / itemsPerPage))

const exportData = async () => {
  if (!filteredFeedbacks.value.length){
    sonner.error("No Data Found.")
    return
  }
  const now = new Date()
  const doc = new jsPDF()

  const img = new Image()
  img.src = logo
  await new Promise((resolve) => {
    img.onload = resolve
  })

  const count = filteredFeedbacks.value.length
  const pageWidth = doc.internal.pageSize.getWidth()
  const title = 'Feedbacks'
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

  const tableColumn = ['No.', 'Username', 'Email', 'Date','Message']
  const tableRows = filteredFeedbacks.value.map((f, i) => [
    i + 1,
    f.userName,
    f.userEmail,
    formatDateTime(f.feedbackDate),
    f.feedbackMessage,
  ])

  autoTable(doc, {
    head: [tableColumn],
    body: tableRows,
    startY: startY+15,
    styles: {fontSize: 8},
    headStyles: {fillColor: [41,128,185]},
  })
  if (filter.value && searchQuery.value != ""){
    doc.save(`LuTuon_Feedbacks_FilteredBy=${filter.value.toUpperCase()}_Query=${searchQuery.value}_${now.toLocaleDateString()}.pdf`)
  }else{
    doc.save(`LuTuon_Feedbacks_${now.toLocaleDateString()}.pdf`)
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
          <p class="text-3xl font-bold">Feedbacks</p>
          <div class="w-full sm:w-full md:w-full lg:w-1/3 flex items-center justify-end gap-2">
            <Input
              v-if="filter === '' || filter === 'username' || filter === 'email'"
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
                  <Calendar class="mr-2 h-4 w-4" />
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
                <Button variant="outline" class="cursor-pointer">
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
                <DropdownMenuItem @click="changeFilter('email')" class="flex justify-between gap-2"
                  >Email <Check v-if="filter === 'email'" class="size-4"
                /></DropdownMenuItem>
                <DropdownMenuItem @click="changeFilter('date')" class="flex justify-between gap-2"
                  >Date <Check v-if="filter === 'date'" class="size-4"
                /></DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button @click="exportData" class="cursor-pointer">PDF <Download/></Button>
          </div>
        </div>
        <Separator class="text-[#DBDBE0] mb-6" />
        <div class="w-full text-right mb-5">
          Total Rows: <span class="font-bold">{{ filteredFeedbacks.length }}</span>
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
                  <TableHead class="font-bold text-foreground text-center">Email</TableHead>
                  <TableHead class="font-bold text-foreground text-center">Date</TableHead>
                  <TableHead class="font-bold text-foreground text-center">Message</TableHead>
                </TableRow>
              </TableHeader>

              <!-- Skeleton while loading -->
              <TableBody v-if="feedbackStore.loading">
                <TableRow v-for="i in 5" :key="i">
                  <TableCell class="text-center"><Skeleton class="h-4 w-24 mx-auto" /></TableCell>
                  <TableCell class="text-center"><Skeleton class="h-4 w-24 mx-auto" /></TableCell>
                  <TableCell class="text-center"><Skeleton class="h-4 w-28 mx-auto" /></TableCell>
                  <TableCell class="text-center"><Skeleton class="h-4 w-24 mx-auto" /></TableCell>
                  <TableCell class="text-center"><Skeleton class="h-4 w-36 mx-auto" /></TableCell>
                </TableRow>
              </TableBody>

              <!-- No feedbacks -->
              <TableBody v-else-if="!filteredFeedbacks.length">
                <TableRow class="hover:bg-transparent">
                  <TableCell
                    colspan="6"
                    class="text-center text-foreground/80 py-36 text-3xl font-bold"
                  >
                    No Feedbacks Found
                  </TableCell>
                </TableRow>
              </TableBody>

              <!-- Data rows -->
              <TableBody v-else>
                <TableRow v-for="(f, i) in paginatedFeedbacks" :key="f.feedbackId">
                  <TableCell class="text-foreground text-center">{{ (currentPage - 1) * itemsPerPage + i + 1 }}</TableCell>
                  <TableCell class="text-foreground text-center">{{ f.userName }}</TableCell>
                  <TableCell class="text-foreground text-center">{{ f.userName }}</TableCell>
                  <TableCell class="text-foreground text-center">{{ f.userEmail }}</TableCell>
                  <TableCell class="text-foreground text-center">{{
                    formatDateTime(f.feedbackDate)
                  }}</TableCell>
                  <TableCell class="text-foreground text-center">{{ f.feedbackMessage }}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>

          <!-- Pagination -->
          <div
            v-if="!feedbackStore.loading && filteredFeedbacks.length && totalPages > 1"
            class="flex justify-center mt-4"
          >
            <Pagination
              v-slot="{ page }"
              :items-per-page="itemsPerPage"
              :total="filteredFeedbacks.length"
              :default-page="currentPage"
              @update:page="currentPage = $event"
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
  </div>
</template>
