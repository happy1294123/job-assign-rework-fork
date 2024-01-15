<template>
  <button
    :class="`${bgColor} text-white px-4 pb-1.5 pt-1 !rounded-full text-sm whitespace-nowrap`"
    :disabled="isLoading"
  >
    <span v-if="isLoading">
      <LoadingIcon />
    </span>
    <span v-else>
      {{ props.text }}
    </span>
  </button>
</template>

<script setup>
import { computed } from 'vue'
import LoadingIcon from './LoadingIcon.vue'

const props = defineProps(['text', 'secondary', 'isLoading'])

const bgColor = computed(() => props.secondary !== undefined ? 'bg-secondary' : 'bg-primary')
</script>