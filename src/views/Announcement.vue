<template>
  <UserLayout>
    <UserAnnouncementContent v-for="announcement in announcementList" :key="announcement.id"
      :announcement="announcement" />
  </UserLayout>
</template>

<script setup>
import { onMounted } from 'vue'

const announcementList = ref([])
onMounted(async () => {
  const baseUrl = import.meta.env.VITE_BACKEND_HOST
  const res = await fetch(baseUrl + '/api/announcements?filters[isActive]=t')
  const { data } = await res.json()
  announcementList.value = data
})
</script>