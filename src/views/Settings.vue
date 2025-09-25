<script lang="ts" setup>
import SideBar from '@/components/SideBar.vue'
// import Button from '@/components/ui/button/Button.vue'
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
import { Bell } from 'lucide-vue-next'
import { ref, reactive } from 'vue'
import {Eye, EyeClosed, CalendarDays} from 'lucide-vue-next'
import { useAuthStore } from '@/stores/auth'

import {Popover, PopoverContent, PopoverTrigger} from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'

import type { DateValue } from '@internationalized/date'
import { DateFormatter, getLocalTimeZone } from '@internationalized/date'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'


const auth = useAuthStore();
const df = new DateFormatter('en-US', {
  dateStyle: 'long',
})

const userName = ref(auth.userInfo.userName)
const userDob = ref(auth.userInfo.userDob)
const userEmail = ref(auth.userInfo.userEmail)

const userPassword = reactive({
  oldPassword: "",
  newPassword: "",
  confirmPassword: ""
})

const value = ref<DateValue>()

const manage = ref(false)
const update = ref(false)
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

const handleEdit = (from:string) => {
  if (from === 'manage') {
    manage.value = !manage.value
  }
  if (from === 'update') {
    update.value = !update.value
  }
}

const handleCancel = () =>{
  userName.value = auth.userInfo.userName
  userDob.value = auth.userInfo.userDob
  userEmail.value = auth.userInfo.userEmail
  manage.value = false;
}

const handleSave = async() =>{
  const updates : any = {};                            
  if(!!value.value) userDob.value = new Date(value.value?.toDate(getLocalTimeZone())).toISOString();
  updates.userName = userName.value;  
  updates.userEmail = userEmail.value;  
  updates.userDob = userDob.value;  
  const success = await auth.update(updates);
  if(!success) return
  userName.value = auth.userInfo.userName
  userDob.value = auth.userInfo.userDob
  userEmail.value = auth.userInfo.userEmail
  manage.value = false;
}

const handlePasswordCancel = () =>{
  userPassword.oldPassword = '';
  userPassword.newPassword = '';
  userPassword.confirmPassword = '';
  update.value = false;
  showOldPassword.value = false
  showNewPassword.value = false
  showConfirmPassword.value = false
}

const handlePasswordSave = async() =>{
  console.log("old",userPassword.oldPassword)
  console.log("new",userPassword.newPassword)
  console.log("confirm",userPassword.confirmPassword)
  
  const success = await auth.update(userPassword);
  if(!success) return; 
  userPassword.oldPassword = '';
  userPassword.newPassword = '';
  userPassword.confirmPassword = '';
  update.value = false;
  showOldPassword.value = false
  showNewPassword.value = false
  showConfirmPassword.value = false
}



</script>

<template>
  <div class="min-h-screen w-full flex justify-end">
    <div class="flex flex-col p-4 md:p-6 lg:p-8 w-full md:w-5/6">
      <div class="md:p-10">

        <div class="flex justify-between mb-5 lg:mb-5">
          <p class="text-3xl font-bold">Account Settings</p>
        </div>
        <Separator class="text-[#DBDBE0] mb-6" />
        <div class="grid grid-cols-1 gap-6">
          <div class="w-full outline-1 dark:outline-gray-200/10 dark:bg-[#1e1e1e]/10 bg-[#e8e8e8]/10 rounded-2xl p-5">
            <Table>
              <TableHeader>
                <TableRow class="hover:bg-transparent">
                  <TableHead class="lg:text-2xl font-bold text-foreground">Personal Information</TableHead>
                  <TableHead
                    v-if="!manage"
                    @click="handleEdit('manage')"
                    class="font-bold flex justify-end lg:px-10"
                  >
                    <Button
                      class="bg-transparent p-0 hover:bg-transparent cursor-pointer shadow-none text-[#F8C600]"
                      >Manage</Button
                    >
                  </TableHead>
                  <TableHead
                    v-if="manage"
                    
                    class="font-bold text-[#F8C600] flex justify-end gap-2 lg:px-10"
                  >
                    <Button
                    @click="handleCancel"
                      class="bg-transparent text-foreground hover:bg-transparent cursor-pointer border border-[#F8C600]"
                      >Cancel</Button
                    >
                    <Button
                    @click="handleSave"
                    class="cursor-pointer">Save</Button>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow class="hover:bg-transparent">
                  <TableCell class="h-[6vh] text-foreground lg:px-10 lg:h-[8vh]">Username</TableCell>
                  <TableCell
                    :class="
                      manage ? 'text-foreground text-right lg:px-10 lg:h-[8vh]' : 'text-[#3A3A3A] text-right lg:px-10'
                    "
                  >
                    <input
                      :disabled="!manage"
                      class="w-full sm:w-full md:w-full lg:w-3/5 h-10 text-right focus:outline-none"
                      :class="manage ? ' border-1 px-2 rounded-lg bg-popover text-popover-foreground' : 'text-gray-400'"
                      v-model="userName"
                    />
                  </TableCell>
                </TableRow>
                <TableRow class="hover:bg-transparent">
                  <TableCell class="h-[6vh] text-foreground lg:px-10 lg:h-[8vh]">Birthdate</TableCell>
                  <TableCell
                    :class="
                      manage ? 'text-foreground text-right lg:px-10' : 'text-[#3A3A3A] text-right lg:px-10'
                    "
                  >
                    <Popover v-if="manage">
                        <PopoverTrigger as-child>
                          <Button
                            variant="outline"
                            :class="
                              cn(
                                'w-full sm:w-full md:w-full lg:w-3/5 justify-start text-left font-normal ',
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
                      <div v-if="!manage" class="text-gray-400">
                        {{
                          new Date(userDob).toLocaleString('en-US', {
                            year: 'numeric',
                            month: '2-digit',
                            day: '2-digit',
                          })
                        }}
                      </div>
                  </TableCell>
                </TableRow>
                <TableRow class="hover:bg-transparent">
                  <TableCell class="h-[6vh] text-foreground lg:px-10 lg:h-[8vh]">Email Address</TableCell>
                  <TableCell
                    :class="
                      manage ? 'text-foreground text-right lg:px-10 lg:h-[8vh]' : 'text-[#3A3A3A] text-right lg:px-10'
                    "
                  >
                    <input
                      :disabled="!manage"
                      class="w-full sm:w-full md:w-full lg:w-3/5 h-10 text-right focus:outline-none"
                      :class="manage ? ' border-1 px-2 rounded-lg bg-popover text-popover-foreground' : 'text-gray-400'"
                      v-model="userEmail"
                    />
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
          <div class="w-full outline-1 dark:outline-gray-200/10 dark:bg-[#1e1e1e]/10 bg-[#e8e8e8]/10 rounded-2xl p-5">
            <Table>
              <TableHeader>
                <TableRow class="hover:bg-transparent">
                  <TableHead class="lg:text-2xl font-bold text-foreground">Manage Password</TableHead>
                  <TableHead
                    v-if="!update"
                    @click="handleEdit('update')"
                    class="font-bold flex justify-end lg:px-10"
                  >
                    <Button
                      class="bg-transparent p-0 hover:bg-transparent cursor-pointer shadow-none text-[#F8C600]"
                      >Update</Button
                    >
                  </TableHead>
                  <TableHead
                    v-if="update"
                    
                    class="font-bold text-[#F8C600] flex justify-end gap-2 lg:px-10"
                  >
                    <Button
                    @click="handlePasswordCancel"
                      class="bg-transparent text-foreground hover:bg-transparent cursor-pointer border border-[#F8C600]"
                      >Cancel</Button
                    >
                    <Button
                    @click="handlePasswordSave"
                    class="cursor-pointer">Save</Button>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow class="hover:bg-transparent">
                  <TableCell class="h-[6vh] text-foreground lg:px-10 lg:h-[6vh]">Password</TableCell>
                  <TableCell
                  :class="
                      update ? 'text-foreground text-right lg:px-10 lg:h-[6vh] flex justify-end' : 'text-[#3A3A3A] text-right lg:px-10 lg:h-[6vh]'
                    "
                  >
                    <span class="text-gray-400" v-if="!update">*********</span>
                    <div v-else class="flex justify-end items-center px-2 w-full sm:w-full md:w-full lg:w-3/5 shadow-none focus:outline-none border rounded-lg h-full bg-popover text-popover-foreground">
                      
                      <input
                      v-model="userPassword.oldPassword"
                      :type="showOldPassword ? 'text': 'password'"
                      class=" h-10 text-right focus:outline-none px-3"
                      placeholder="Old Password"
                      />
                      <component v-if="!showOldPassword" @click="TogglePassword('old')" :is="EyeClosed" class=" text-[#3A3A3A]"/>
                      <component v-else @click="TogglePassword('old')" :is="Eye" class=" text-[#3A3A3A]"/>
                    </div>
                  </TableCell>
                </TableRow>
                <TableRow v-if="update" class="hover:bg-transparent">
                  <TableCell class="h-[6vh] text-foreground lg:px-10 lg:h-[6vh]"></TableCell>
                  <TableCell
                    :class="
                      update ? 'text-foreground text-right lg:px-10 lg:h-[6vh] flex justify-end' : 'text-[#3A3A3A] text-right lg:px-10 lg:h-[6vh]'
                    "
                  >
                    <div class="flex justify-end items-center px-2 w-full sm:w-full md:w-full lg:w-3/5 shadow-none focus:outline-none border rounded-lg h-full bg-popover text-popover-foreground">

                      <input
                      v-model="userPassword.newPassword"
                      :type="showNewPassword ? 'text': 'password'"
                      class="text-right focus:outline-none px-3 h-10"
                      placeholder="New Password"
                      />
                      <component v-if="!showNewPassword" @click="TogglePassword('new')" :is="EyeClosed" class=" text-[#3A3A3A]"/>
                      <component v-else @click="TogglePassword('new')" :is="Eye" class=" text-[#3A3A3A]"/>
                    </div>
                  </TableCell>
                </TableRow>
                <TableRow v-if="update" class="hover:bg-transparent">
                  <TableCell class="h-[6vh] text-foreground lg:px-10 lg:h-[6vh] w-1/2"></TableCell>
                  <TableCell
                    :class="
                      update ? 'text-foreground text-right lg:px-10  lg:h-[6vh] flex justify-end' : 'text-[#3A3A3A] text-right lg:px-10 lg:h-[6vh]'
                    "
                  >
                    <div class="flex justify-end items-center px-2 w-full sm:w-full md:w-full lg:w-3/5 shadow-none focus:outline-none border rounded-lg h-full bg-popover text-popover-foreground">

                      <input
                      v-model="userPassword.confirmPassword"
                      :type="showConfirmPassword ? 'text': 'password'"
                      class="text-right w-full focus:outline-none px-3 h-10"
                      placeholder="Confirm Password"
                      />
                      <component v-if="!showConfirmPassword" @click="TogglePassword('confirm')" :is="EyeClosed" class=" text-[#3A3A3A]"/>
                      <component v-else @click="TogglePassword('confirm')" :is="Eye" class=" text-[#3A3A3A]"/>
                    </div>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
