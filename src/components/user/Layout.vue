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
    <UserFooter />
  </div>
</template>

<script setup>
import removeAdminCss from '@utils/removeAdminCss'
import { watchEffect } from 'vue'
watchEffect(() => {
  removeAdminCss()
})
</script>