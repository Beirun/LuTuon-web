<script lang="ts" setup>
import SideBar from '@/components/SideBar.vue'
import Button from '@/components/ui/button/Button.vue'
import { Separator } from '@/components/ui/separator'
// import {Icon} from '@iconify/vue'
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
import { ref } from 'vue'
import {Eye, EyeClosed} from 'lucide-vue-next'

const manage = ref(false)
const update = ref(false)
const showPassword = ref(false)

const TogglePassword = () => {
  showPassword.value = !showPassword.value
}

const handleEdit = (from:string) => {
  if (from === 'manage') {
    manage.value = !manage.value
  }
  if (from === 'update') {
    update.value = !update.value
  }
}

const handleCancel= (from: string)=> {
  if (from === 'password') {
    update.value = false
    showPassword.value = false
  }
  if (from === 'manage') {
    manage.value = false
  }
    
}

const handleSave = (from:string)=> {
  if (from === 'password') {
    update.value = false
    showPassword.value = false
  }
  if (from === 'manage') {
    manage.value = false
  }
}



</script>

<template>
  <div class="w-screen h-screen flex lg:justify-end">
    <div class="lg:w-5/6 w-full md:w-full h-full flex justify-center items-center right-0">
      <div class="w-7/8 h-7/8">
        <p class="text-3xl font-bold">Account Settings</p>
        <Separator class="text-[#DBDBE0] mb-10 lg:mb-0 mt-5" />
        <div class="w-full h-full flex flex-col gap-10 lg:pt-10">
          <div class="w-full outline-1 rounded-2xl p-5">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead class="lg:text-2xl font-bold text-black">Personal Information</TableHead>
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
                    @click="handleCancel('manage')"
                      class="bg-transparent hover:bg-transparent cursor-pointer border border-[#F8C600]"
                      >Cancel</Button
                    >
                    <Button
                    @click="handleSave('manage')"
                    class="cursor-pointer">Save</Button>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell class="h-[6vh] text-[#3A3A3A] lg:px-10 lg:h-[10vh]">Username</TableCell>
                  <TableCell
                    :class="
                      manage ? 'text-black text-right lg:px-10' : 'text-[#3A3A3A] text-right lg:px-10'
                    "
                  >
                    <Input
                      :disabled="!manage"
                      class="w-1/2 text-right focus:outline-none"
                      :value="'kenji'"
                    />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell class="h-[6vh] text-black lg:px-10 lg:h-[10vh]">Birthdate</TableCell>
                  <TableCell
                    :class="
                      manage ? 'text-black text-right lg:px-10' : 'text-[#3A3A3A] text-right lg:px-10'
                    "
                  >
                    <Input
                      :disabled="!manage"
                      class="text-right focus:outline-none"
                      :value="'August 15, 2003'"
                    />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell class="h-[6vh] text-black lg:px-10 lg:h-[10vh]">Email Address</TableCell>
                  <TableCell
                    :class="
                      manage ? 'text-black text-right lg:px-10' : 'text-[#3A3A3A] text-right lg:px-10'
                    "
                  >
                    <Input
                      :disabled="!manage"
                      class="text-right w-full focus:outline-none"
                      :value="'kennethjamesbatuhan@gmail.com'"
                    />
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
          <div class="w-full outline-1 rounded-2xl p-5">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead class="lg:text-2xl font-bold text-black">Manage Password</TableHead>
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
                      @click="handleCancel('password')"
                      class="bg-transparent hover:bg-transparent cursor-pointer border border-[#F8C600]"
                      >Cancel</Button
                    >
                    <Button
                      @click="handleSave('password')"
                    class="cursor-pointer">Save</Button>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell class="h-[6vh] text-[#3A3A3A] lg:px-10 lg:h-[10vh]">Password</TableCell>
                  <TableCell
                    :class="
                      update ? 'text-black text-center lg:px-10 w-1/2' : 'text-[#3A3A3A] text-right lg:px-10'
                    "
                  >
                    <div class="relative">
                      <Input
                        tabindex="-1"
                        :placeholder="showPassword ? 'Password123' : '••••••••'"
                        id="password"
                        :type="showPassword ? 'text' : 'password'"
                        :class="update ? 'focus:outline-none text-center lg:pl-100 w-full' : 'focus:outline-none text-right w-full'"
                        :disabled="!update"
                      />
                      <EyeClosed
                        v-if="update"
                        class="size-5 absolute right-0 top-1/2 -translate-y-1/2 text-muted-foreground text-2xl"
                        :class="showPassword ? 'hidden' : ''"
                        @click="TogglePassword"
                      />
                      <Eye
                        v-if="update"
                        icon="radix-icons:eye-open"
                        class="size-5 absolute right-0 top-1/2 -translate-y-1/2 text-muted-foreground text-2xl"
                        :class="showPassword ? '' : 'hidden'"
                        @click="TogglePassword"
                      />
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
