<script lang="ts" setup>
import { useAuthStore } from '@/stores/auth'
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  Bell,
  Triangle,
  ShieldUser,
  SquareUserRound,
  LockKeyhole,
  LogOut,
  CalendarDays,
  Eye,
  EyeClosed
} from 'lucide-vue-next'
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu'
import type { DateValue } from '@internationalized/date'
import { DateFormatter, getLocalTimeZone } from '@internationalized/date'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import DarkModeSwitch from '@/components/DarkModeSwitch.vue'
const auth = useAuthStore()

const items = [
  { title: 'Account Overview', icon: ShieldUser, url: '/dashboard' },
  { title: 'Personal Information', icon: SquareUserRound },
  { title: 'Security', icon: LockKeyhole },
]
const account_overview = ref(false)
const personal_information = ref(false)
const password = ref(false)
const activeItem = ref('account overview')

const edit = ref(false)
const managePasswordEdit = ref(false)

const handleSwitch = (tab: string) => {
  activeItem.value = tab
  if (tab === 'account overview') {
    account_overview.value = !account_overview.value
    managePasswordEdit.value = false
    edit.value = false
  }
  if (tab === 'personal information') {
    personal_information.value = !personal_information.value
    managePasswordEdit.value = false
    edit.value = false
  }
  if (tab === 'security') {
    password.value = !password.value
    managePasswordEdit.value = false
    edit.value = false
  }
}

const handleEdit = () => {
  edit.value = !edit.value
}

const handlePasswordEdit = () => {
  managePasswordEdit.value = !managePasswordEdit.value
}

const df = new DateFormatter('en-US', {
  dateStyle: 'long',
})

const value = ref<DateValue>()

const handleLogout = () => {
  auth.logout()
}

const showOldPassword = ref(false)
const showNewPassword = ref(false)
const showConfirmPassword = ref(false)

const TogglePassword = (password: string) => {
  if (password === 'old') {
    showOldPassword.value = !showOldPassword.value
  }
  if (password === 'new') {
    showNewPassword.value = !showNewPassword.value
  }
  if (password === 'confirm') {
    showConfirmPassword.value = !showConfirmPassword.value
  }
}

</script>

<template>
  <div class="w-screen h-screen flex flex-col justify-center">
    <!-- header -->
    <div class="w-full h-1/10 flex justify-between items-center px-10 shadow-xs">
      <div><img src="@/assets/logo.png" alt="" /></div>
      <div class="flex w-full h-full justify-end items-center gap-5">
        <DarkModeSwitch/>
        <Button variant="outline" class="h-12 w-12 shadow-sm shadow-black/20 active:brightness-90 hover:brightness-95 duration-300 cursor-pointer">
          <component :is="Bell" class="text-[#3A3A3A] dark:text-white " />
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger as-child>
            <Button 
              variant="outline"
              class="h-12 px-3 w-33 sm:w-fit font-light text-gray-600 dark:text-[#e8e8e8] shadow-sm shadow-black/20 rounded-md border border-border flex items-center gap-2 cursor-pointer active:brightness-90 hover:brightness-95 duration-300"
              
              >
              <span class="block sm:hidden">
                {{ auth.userInfo.userEmail.slice(0, 10) }}...
              </span>
              <span class="hidden sm:block">
                {{ auth.userInfo.userEmail }}
              </span>

              <component
                :is="Triangle"
                height="15"
                class="rotate-180 fill-[#3A3A3A] text-[#3A3A3A] dark:text-[#e8e8e8] dark:fill-[#e8e8e8]"
              />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" class="sm:w-40">
            <DropdownMenuItem
              @click="handleLogout"
              class="cursor-pointer flex items-center justify-between text-base"
            >
              <span>Logout</span>
              <LogOut class="size-5" />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>

    <!-- body -->
    <div class="w-full h-full pt-10 flex flex-col items-center gap-5">
      <div
        class="sm:w-1/2 w-9/10 bg-background flex justify-between items-center border-b border-border pb-5"
      >
      <div class="flex gap-4 items-center">

        <DropdownMenu>
          <DropdownMenuTrigger as-child  class="block sm:hidden">
          <Button variant="default" class="h-10 w-10 flex shadow-sm shadow-black/20 active:brightness-90 hover:brightness-95 duration-300 cursor-pointer">
            <span v-if="activeItem === 'account overview'">
              <component :is="items[0].icon"  class="text-[#3A3A3A]  size-6" />
            </span>
            <span v-else-if="activeItem === 'personal information'">
              <component :is="items[1].icon" class="text-[#3A3A3A]  size-6" />
            </span>
            <span v-else>
              <component :is="items[2].icon" class="text-[#3A3A3A] size-6" />
            </span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" class="w-screen/2">
          <DropdownMenuItem class="flex flex-col">
            <div v-for="item in items" class="sm:my-10 my-4 flex flex-col w-full">
              <a
              @click="handleSwitch(item.title.toLowerCase())"
              :class="[
                activeItem === item.title.toLowerCase()
                ? 'text-yellow-400  flex gap-5'
                : 'text-[#515151]  flex  gap-5',
              ]"
            >
            <component :is="item.icon" class="size-6" :class="activeItem === item.title.toLowerCase() ? 'text-yellow-400 dark:text-yellow-300' : 'text-[#515151]'" />
            <span class="text-xl">{{ item.title }}</span>
          </a>
        </div>
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
  <p class="text-xl sm:text-2xl font-bold">
    <span class="block sm:hidden">

      {{ activeItem === 'account overview' ? 'Account Overview' : activeItem === 'personal information' ? 'Personal Information' : 'Security' }}
    </span>
    <span class="hidden sm:block">Account Center</span>
  </p>
</div>
        
      </div>
      <div class="sm:w-1/2 w-9/10 h-3/4 flex sm:flex-row flex-col justify-between gap-5">
        <div class="w-1/3 border-r border-border sm:block hidden">
          <div v-for="item in items" class="sm:my-10 my-4">
            <a
              @click="handleSwitch(item.title.toLowerCase())"
              :class="[
                activeItem === item.title.toLowerCase()
                  ? 'text-yellow-300  flex gap-5 cursor-pointer'
                  : 'text-[#515151]  flex  gap-5 cursor-pointer',
              ]"
            >
              <component :is="item.icon" class="size-6" />
              <span class="text-xl">{{ item.title }}</span>
            </a>
          </div>
        </div>
        <div class="sm:w-2/3 w-full flex flex-col gap-5">
          <div v-if= "activeItem !== 'security'" class="w-full border border-border rounded-xl">
            <div class="flex justify-between border-b p-3 items-center">
              <p class="text-lg font-bold">Personal Information</p>
              <Button
                v-if="activeItem === 'account overview'"
                @click="handleSwitch('personal information')"
                class="bg-transparent p-0 hover:bg-transparent cursor-pointer shadow-none text-[#F8C600]"
                >Manage</Button
              >
              <Button
                v-if="activeItem === 'personal information' && !edit"
                @click="handleEdit"
                class="bg-transparent p-0 hover:bg-transparent cursor-pointer shadow-none text-[#F8C600]"
                >Edit</Button
              >
              <div v-if="edit" class="flex gap-5">
                <Button
                  @click="handleEdit"
                  class="bg-transparent p-0 hover:bg-transparent cursor-pointer shadow-none text-gray-500 dark:text-gray-300 underline"
                >
                  Cancel
                </Button>
                <Button
                  class="bg-transparent p-0 hover:bg-transparent cursor-pointer shadow-none text-[#F8C600]"
                >
                  Save
                </Button>
              </div>
            </div>
            <div>
              <Table v-if="activeItem === 'account overview'" class="my-5">
                <TableBody>
                  <TableRow class="flex justify-between px-5 hover:bg-transparent">
                    <TableCell class="h-[6vh] text-foreground text-center flex items-center"
                      >Username</TableCell
                    >
                    <TableCell class="text-foreground text-center w-1/2 flex items-center">
                      <Input
                        :value="auth.userInfo.userName"
                        placeholder="kenji"
                        class="text-right p-0 w-full border-0 shadow-none focus:outline-none"
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow class="flex justify-between px-5 hover:bg-transparent">
                    <TableCell class="h-[6vh] text-foreground text-center flex items-center"
                      >Birthdate</TableCell
                    >
                    <TableCell class="text-foreground text-center flex items-center">
                      {{
                        new Date(auth.userInfo.userDob).toLocaleString('en-US', {
                          year: 'numeric',
                          month: '2-digit',
                          day: '2-digit',
                        })
                      }}
                    </TableCell>
                  </TableRow>
                  <TableRow class="flex justify-between px-5 hover:bg-transparent">
                    <TableCell class="h-[6vh] text-foreground text-center flex items-center"
                      >Email Address</TableCell
                    >
                    <TableCell class="text-foreground text-center w-1/2 flex items-center">
                      <Input
                        :value="auth.userInfo.userEmail"
                        placeholder="kenji"
                        class="text-right p-0 w-full border-0 shadow-none focus:outline-none"
                      />
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              <Table v-if="activeItem === 'personal information'" class="my-5">
                <TableBody>
                  <TableRow class="flex justify-between px-5 hover:bg-transparent">
                    <TableCell class="h-[6vh] text-foreground flex flex-col sm:w-1/2 w-full justify-center-safe "
                    :class="edit ? 'h-[8vh]' : 'text-gray-400'"
                      >Username
                      <Input
                        :disabled="!edit"
                        :value="auth.userInfo.userName"
                        placeholder="kenji"
                        class="p-0 shadow-none focus:outline-none text-left"
                        :class="edit ? ' border-1 px-2 rounded-lg h-full bg-popover text-popover-foreground' : 'text-gray-400'"
                    /></TableCell>
                  </TableRow>
                  <TableRow class="flex justify-between px-5 hover:bg-transparent">
                    <TableCell class="h-[6vh] text-foreground flex flex-col sm:w-1/2 w-full  justify-center-safe "
                    :class="edit ? 'h-[8vh]' : 'text-gray-400'"
                      >Birthdate

                      <Popover v-if="edit" >
                        <PopoverTrigger as-child>
                          <Button
                            variant="outline"
                            :class="
                              cn(
                                'w-[78vw] sm:w-full justify-start text-left font-normal',
                                !value && 'text-muted-foreground',
                              )
                            "
                          >
                            <component :is="CalendarDays" class="mr-2 h-4 w-4" />
                            {{
                              value ? df.format(value.toDate(getLocalTimeZone())) : 'Pick a date'
                            }}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent class="w-auto p-0">
                          <Calendar v-model="value" initial-focus />
                        </PopoverContent>
                      </Popover>
                      <div v-if="!edit">
                        {{
                          new Date(auth.userInfo.userDob).toLocaleString('en-US', {
                            year: 'numeric',
                            month: '2-digit',
                            day: '2-digit',
                          })
                        }}
                      </div>
                    </TableCell>
                  </TableRow>
                  <TableRow class="flex justify-between px-5 hover:bg-transparent">
                    <TableCell
                      class="h-[6vh] text-foreground flex flex-col justify-center-safe sm:w-1/2 w-full text-left"
                      :class="edit ? 'h-[8vh]' : 'text-gray-400'"
                      >Email Address

                      <Input
                        :disabled="!edit"
                        :value="auth.userInfo.userEmail"
                        placeholder="kenji"
                        class="text-left p-0 w-full border-0 shadow-none focus:outline-none"
                        :class="edit ? ' border-1 px-2 rounded-lg h-full bg-popover text-popover-foreground' : 'text-gray-400'"
                      />
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </div>
          <div class="w-full border border-border rounded-xl">
            <div class="flex justify-between border-b p-3 items-center">
              <p class="text-lg font-bold">
                {{ activeItem === 'account overview' || activeItem === 'security' ? 'Manage Password' : 'Delete Account' }}
              </p>
              <Button
                v-if="activeItem === 'account overview'"
                @click="handleSwitch('security')"
                class="bg-transparent p-0 hover:bg-transparent cursor-pointer shadow-none text-[#F8C600]"
                >Manage</Button
              >
              <Button
                v-if="activeItem === 'security' && !managePasswordEdit"
                @click="handlePasswordEdit"
                class="bg-transparent p-0 hover:bg-transparent cursor-pointer shadow-none text-[#F8C600]"
              >
                Edit
              </Button>

              <Button
                v-if="activeItem === 'personal information'"
                class="bg-transparent p-0 hover:bg-transparent cursor-pointer shadow-none text-red-600"
                >Delete</Button
              >
              <div v-if="managePasswordEdit" class="flex gap-5">

              <Button
                @click="handlePasswordEdit"
                class="bg-transparent p-0 hover:bg-transparent cursor-pointer shadow-none dark:text-gray-300 text-gray-500 underline"
              >
                Cancel
              </Button>
              <Button
                class="bg-transparent p-0 hover:bg-transparent cursor-pointer shadow-none text-[#F8C600]"
              >
                Save
              </Button>
              </div>
            </div>
            <div>
              <Table v-if="activeItem === 'account overview' || activeItem === 'security'" class="my-5">
                <TableBody>
                  <TableRow class="flex justify-between px-5 hover:bg-transparent">
                    <TableCell class="h-[6vh] text-foreground text-center flex items-center">
                      Password
                    </TableCell>
                    <TableCell
                      class="text-foreground text-center w-2/3 sm:w-1/2 flex items-center justify-end"
                    >
                      <span class="text-gray-400" v-if="!managePasswordEdit">*********</span>
                      <div v-else class="flex justify-end items-center px-2 w-full shadow-none focus:outline-none border rounded-lg h-full bg-popover text-popover-foreground">

                      <Input
                      :type="showOldPassword ? 'text': 'password'"
                      class="text-right w-full focus:outline-none px-3"
                      placeholder="Old Password"
                      />
                      <component v-if="!showOldPassword" @click="TogglePassword('old')" :is="EyeClosed" class=" text-[#3A3A3A] cursor-pointer"/>
                      <component v-else @click="TogglePassword('old')" :is="Eye" class=" text-[#3A3A3A] cursor-pointer"/>
                    </div>
                    </TableCell>
                  </TableRow>
                  <TableRow
                    v-if="managePasswordEdit"
                    class="flex justify-between px-5 hover:bg-transparent"
                  >
                    <TableCell
                      class="h-[6vh] text-foreground text-center flex items-center"
                    ></TableCell>
                    <TableCell
                      class="text-foreground text-center w-2/3 sm:w-1/2 flex items-center justify-end"
                    >
                      <div class="flex justify-end items-center px-2 w-full shadow-none focus:outline-none border rounded-lg h-full bg-popover text-popover-foreground">

                      <Input
                      :type="showNewPassword ? 'text': 'password'"
                      class="text-right w-full focus:outline-none px-3"
                      placeholder="New Password"
                      />
                      <component v-if="!showNewPassword" @click="TogglePassword('new')" :is="EyeClosed" class=" text-[#3A3A3A] cursor-pointer"/>
                      <component v-else @click="TogglePassword('new')" :is="Eye" class=" text-[#3A3A3A] cursor-pointer"/>
                    </div>
                    </TableCell>
                  </TableRow>
                  <TableRow
                    v-if="managePasswordEdit"
                    class="flex justify-between px-5 hover:bg-transparent"
                  >
                    <TableCell
                      class="h-[6vh] text-foreground text-center flex items-center"
                    ></TableCell>
                    <TableCell
                      class="text-foreground text-center  w-2/3 sm:w-1/2 flex items-center justify-end"
                    >
                      <div class="flex justify-end items-center px-2 w-full shadow-none focus:outline-none border rounded-lg h-full bg-popover text-popover-foreground">

                      <Input
                      :type="showConfirmPassword ? 'text': 'password'"
                      class="text-right w-full focus:outline-none px-3"
                      placeholder="Confirm Password"
                      />
                      <component v-if="!showConfirmPassword" @click="TogglePassword('confirm')" :is="EyeClosed" class=" text-[#3A3A3A] cursor-pointer"/>
                      <component v-else @click="TogglePassword('confirm')" :is="Eye" class=" text-[#3A3A3A] cursor-pointer"/>
                    </div>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              <Table v-if="activeItem === 'personal information'">
                <TableBody>
                  <TableRow class="flex justify-between px-5 hover:bg-transparent my-5">
                    <TableCell class="h-[6vh] w-full text-foreground text-center flex items-center"
                      >
                      <p class="text-wrap text-justify">
                      If you delete your account, we will be unable to restore your account once
                      this process is complete. Please proceed with caution.
                      </p>
                      </TableCell
                    >
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- footer -->
    <div></div>
  </div>
</template>
