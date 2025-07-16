<script lang="ts" setup>
import SideBar from '@/components/SideBar.vue'
import {Separator} from '@/components/ui/separator'
// import {Icon} from '@iconify/vue'
import {Bell} from 'lucide-vue-next'
</script>

<template>
    <div class="w-screen h-screen flex">
        <SideBar />
        <div class="w-5/6 h-full flex justify-center items-center">
            <div class="w-7/8 h-7/8">
                <div class="flex justify-between mb-10">
                    <p class="text-3xl">Welcome to dashboard, <b>Admin!</b></p>
                    <Bell/>
                </div>
                <Separator class="text-[#DBDBE0] -mb-18"/>
                <div class="w-full h-full flex flex-col gap-10 justify-end ">
                    <div class="w-full h-2/5 outline-1 rounded-2xl">

                    </div>
                    <div class="w-full h-2/5 outline-1 rounded-2xl">

                    </div>
                </div>
            </div>
        </div>
    </div>
</template>