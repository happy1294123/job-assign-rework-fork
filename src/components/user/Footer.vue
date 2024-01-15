<template>
  <div class="h-10 w-full bottom-0 bg-[#5D6279] text-white flex flex-col mt-10">
    <div class="flex md:justify-center justify-evenly border">
      <div class="flex-1 border text-center cursor-pointer" v-for="link in footerLink" :key="link.text" @click="() => handleRedirect(link.url)">
        {{ link.text }}
      </div>
    </div>
    <div class="flex justify-center items-center text-[12px] text-center mt-1 bg-[#5D6279]">
      <span >
        2020 Dispatch Matching Platform 版權所有
      </span>
    </div>
  </div>
</template>

<script setup >

const footerLink = ref([
  {
    text: '關於我們',
    url: '/about'
  },
  {
    text: '合作企業',
    url: '/cooperate'
  },
  {
    text: '服務條款',
    url: '/service'
  },
  {
    text: '聯繫我們',
    url: '/contact'
  }
])

const router = useRouter()
const handleRedirect = (url) => {
  router.push(url)
}
</script>