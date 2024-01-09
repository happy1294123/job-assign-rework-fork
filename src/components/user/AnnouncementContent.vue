<template>
  <div class="mt-6 cursor-pointer" @click="handleRedirectAnnouncementDetail">
    <h1 class="text-2xl m-2">{{ announcement.attributes.title }}</h1>
    <div class="p-2 border-b">
      {{ simpleContent }}
      <div class="flex justify-end m-2 text-gray-400">
        <span>{{ announcement.attributes.createdAt.slice(0, 10) }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps(['announcement'])
const simpleContent = computed(() => {
  const maxLength = 100
  const content = props.announcement.attributes.content
  if (content.length > maxLength) {
    return content.slice(0, maxLength) + ' ...'
  }
  return content
})

const router = useRouter()
const handleRedirectAnnouncementDetail = () => {
  router.push('/announcement/' + props.announcement.id)
}
</script>