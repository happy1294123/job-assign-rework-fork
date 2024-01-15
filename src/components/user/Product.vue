<template>
  <div
    class="w-max-[300px] h-max-[350px] aspect-auto overflow-clip rounded-lg flex flex-col justify-between cursor-pointer shadow-xl border p-3"
    @click="handleClick"
  >
    <div>
      <div>
        <img
          v-if="imageUrl"
          :src="imageUrl"
          alt="product img"
          class="w-full aspect-auto"
        >
        <img
          v-else
          src="@/assets/default-image.png"
          alt=""
        >
      </div>
    </div>
    <div class="flex flex-col mt-3 gap-2">
      <span class="font-extralight text-center">{{ props.product.attributes.name }}</span>
      <button
        :class="`bg-secondary text-white px-4 py-1.5 !rounded-lg text-sm whitespace-nowrap`"
        :disabled="isLoading"
      >
        <span >
          開始訂單
        </span>
    </button>
    </div>
  </div>
</template>

<script setup>
// import CustomButton from '@/components/CustomButton.vue'
import { inject } from 'vue'
import { useRouter } from 'vue-router'
const connectCustomService = inject('connectCustomService')

const props = defineProps(['product'])

const imageUrl = props.product.attributes.image.data?.attributes.url
const router = useRouter()
const handleClick = () => {
  const token = localStorage.getItem('token')
  if (!token) {
    router.replace('/login')
    return
  }

  if (props.product.attributes.url) {
    window.open(props.product.attributes.url)
  } else if (props.product.attributes.status === 'fill') {
    connectCustomService('已報名，目前訂單額滿中')
  } else if (props.product.attributes.status === 'fillable') {
    connectCustomService('已報名，請待客服人員通知')
  } else {
    connectCustomService()
  }
}
</script>