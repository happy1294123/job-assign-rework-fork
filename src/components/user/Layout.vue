<template>
  <div class="flex flex-col h-screen justify-between">
    <div>
      <UserHeader />
      <main class="px-4 md:px-[67px]">
        <div class="flex-1">
          <slot></slot>
        </div>
      </main>
    </div>
    <div class="h-10 w-full bottom-0 bg-[#5D6279] text-white flex justify-center items-center text-[10px] mt-10">
      2020 Dispatch Matching Platform 版權所有
    </div>
  </div>
</template>

<script setup>
import removeAdminCss from '@utils/removeAdminCss'
import { watchEffect } from 'vue'
watchEffect(() => {
  removeAdminCss()
})
</script>