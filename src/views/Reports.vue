<!-- @/views/Reports.vue -->
<script lang="ts" setup>
import SideBar from '@/components/SideBar.vue'
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
import type {DateRange} from 'reka-ui'
import type { Grid } from 'reka-ui/date'
import type { Ref } from 'vue'
import {Popover, PopoverContent, PopoverTrigger} from '@/components/ui/popover'
import { CalendarDate, isEqualMonth } from '@internationalized/date'
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-vue-next'
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

const filter = ref('username')

const changeFilter = (filterBy: string) => {
  filter.value = filterBy
}

const today = new Date()
const start = new CalendarDate(today.getFullYear(), today.getMonth() + 1, today.getDate())

const value = ref({
  start,
  end: start.add({ days: 20 })
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


const reportStore = useReportStore()

// pagination state
const currentPage = ref(1)
const itemsPerPage = 10

const paginatedReports = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  return reportStore.reports.slice(start, start + itemsPerPage)
})

onBeforeMount(async () => {
  if (reportStore.reports.length === 0) await reportStore.fetchReports()
})
</script>

<template>
  <div class="min-h-screen w-full flex justify-end">
    <div class="flex flex-col p-4 xs:pl-4 sm:pl-8 md:p-6 md:pr-2 md:pl-18 lg:p-8 w-full md:w-5/6 ">
      <div class="md:p-10">
        <div class="flex justify-between mb-5 lg:mb-5">
          <p class="text-3xl font-bold">Reports</p>
          <div class="w-1/3 flex items-center justify-end">
            <Input
              v-if="filter === 'username' || filter === 'point' || filter==='food' || filter === 'type'"
              placeholder="Search"
              />
            <Popover v-else>
              <PopoverTrigger as-child>
                <Button
                  variant="outline"
                  :class="
                    cn(
                      'w-[280px] justify-start text-left font-normal',
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
                <Button variant="outline" class="ml-2 cursor-pointer">
                  <span
                    >Filter by <span class="capitalize">{{ filter }}</span></span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem @click="changeFilter('username')">Username</DropdownMenuItem>
                <DropdownMenuItem @click="changeFilter('point')">Point</DropdownMenuItem>
                <DropdownMenuItem @click="changeFilter('food')">Food</DropdownMenuItem>
                <DropdownMenuItem @click="changeFilter('date')">Date</DropdownMenuItem>
                <DropdownMenuItem @click="changeFilter('type')">Type</DropdownMenuItem>
              </DropdownMenuContent>
              </DropdownMenu>
          </div>
        </div>
        <Separator class="text-[#DBDBE0] mb-6" />

        <div class="grid grid-cols-1 gap-6">
          <div
            class="w-full max-h-[78vh] overflow-auto outline-1 
                   dark:outline-gray-200/10 dark:bg-[#1e1e1e]/10 
                   bg-[#e8e8e8]/10 rounded-2xl p-5"
          >
            <Table>
              <TableCaption></TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead class="font-bold text-foreground text-center">Username</TableHead>
                  <TableHead class="font-bold text-foreground text-center">Point</TableHead>
                  <TableHead class="font-bold text-foreground text-center">Food</TableHead>
                  <TableHead class="font-bold text-foreground text-center">Date</TableHead>
                  <TableHead class="font-bold text-foreground text-center">Duration</TableHead>
                  <TableHead class="font-bold text-foreground text-center">Type</TableHead>
                </TableRow>
              </TableHeader>

              <!-- Skeleton while loading -->
              <TableBody v-if="reportStore.loading">
                <TableRow v-for="i in 5" :key="i">
                  <TableCell class="text-center"><Skeleton class="h-4 w-20 mx-auto" /></TableCell>
                  <TableCell class="text-center"><Skeleton class="h-4 w-24 mx-auto" /></TableCell>
                  <TableCell class="text-center"><Skeleton class="h-4 w-10 mx-auto" /></TableCell>
                  <TableCell class="text-center"><Skeleton class="h-4 w-10 mx-auto" /></TableCell>
                  <TableCell class="text-center"><Skeleton class="h-4 w-28 mx-auto" /></TableCell>
                  <TableCell class="text-center"><Skeleton class="h-4 w-24 mx-auto" /></TableCell>
                </TableRow>
              </TableBody>

              <!-- No reports -->
              <TableBody v-else-if="!reportStore.reports.length">
                <TableRow class="hover:bg-transparent">
                  <TableCell colspan="8" class="text-center text-foreground/80 py-36 text-3xl font-bold">
                    No Reports Found
                  </TableCell>
                </TableRow>
              </TableBody>

              <!-- Data rows -->
              <TableBody v-else>
                <TableRow v-for="r in paginatedReports" :key="r.attemptId">
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
        <div v-if="!reportStore.loading && reportStore.reports.length"  class="flex justify-center mt-6">
          <Pagination v-slot="{ page }"
            :items-per-page="itemsPerPage"
            :total="reportStore.reports.length"
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
              </template>

              <PaginationEllipsis :index="4" />

              <PaginationNext />
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </div>
  </div>
</template>
