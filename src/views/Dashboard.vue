<script lang="ts" setup>
import SideBar from '@/components/SideBar.vue'
import {Separator} from '@/components/ui/separator'
// import {Icon} from '@iconify/vue'
import {Bell} from 'lucide-vue-next'
import {ref} from 'vue'

</script>

<template>
    <div class="w-screen h-screen flex lg:justify-end">
        <div class="lg:w-5/6 w-full md:w-full h-full flex justify-center items-center right-0">
            <div class="w-7/8 h-7/8">
                <div class="flex justify-between mb-10 lg:mb-5">
                    <p class="text-3xl">Welcome to dashboard, <b>Admin!</b></p>
                    <Bell/>
                </div>
                <Separator class="text-[#DBDBE0] mb-10 lg:mb-0"/>
                <div class="w-full h-full flex flex-col gap-10 justify-end ">
                    <div class="w-full h-1/2 outline-1 rounded-2xl p-5">
                        <p class="lg:text-2xl font-bold">Registered Users</p>
                    </div>
                    <div class="w-full lg:h-2/5 h-full flex lg:flex-row flex-col gap-10 pb-10">
                        <div class="w-full lg:w-1/2 h-full outline-1 rounded-2xl p-5">
                             <p class="lg:text-2xl font-bold">Most Played Dish</p>
                        </div>
                        <div class="w-full lg:w-1/2 h-full outline-1 rounded-2xl p-5">
                            <p class="lg:text-2xl font-bold">Weekly Players</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>