<template>
  <div class="bg-[#F1F1F1] text-[#89A5EE] rounded-lg h-10 w-full md:-mb-9 overflow-hidden">
    <div ref="marquee" class="flex items-center px-3 h-full -mr-[150px]">
      <div v-for="an in announcementList" :key="an.id" class="cursor-pointer whitespace-nowrap"
        :style="{ marginLeft: gsapX + 'px' }" @click="() => handleRedirectAnnouncementDetail(an.id)">
        {{ an.attributes.title }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { fetchWithoutToken } from '@utils/fetchFn.js'
import gsap from 'gsap'
import { computed } from 'vue'
const marquee = ref(null)

const announcementList = ref([])
const gsapX = computed(() => window.innerWidth + 100)
onMounted(async () => {
  const { data } = await fetchWithoutToken('/api/announcements?fields[0]=title&filters[$and][0][isActive][$eq]=t&filters[$and][1][isMarquee][$eq]=t')
  announcementList.value = data
  const totalTextLength = announcementList.value?.reduce((totalTextLength, item) => totalTextLength + item.attributes.title.length, 0)
  gsap.to(marquee.value, {
    x: -gsapX.value * (announcementList.value.length) - totalTextLength * 20,
    duration: gsapX.value / 70 * announcementList.value.length,
    repeat: -1,
    ease: 'none',
  })
})

const router = useRouter()
const handleRedirectAnnouncementDetail = (id) => {
  router.push('/announcement/' + id)
}
</script>