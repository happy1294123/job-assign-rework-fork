<template>
  <div
    class="w-max-[300px] h-max-[300px] aspect-square rounded-lg overflow-hidden flex justify-center items-end cursor-pointer"
    @click="handleClick"
  >
    <img
      v-if="imageUrl"
      :src="imageUrl"
      alt="product img"
      class="object-cover w-full h-full"
    >
    <img
      v-else
      src="@/assets/default-image.png"
      alt=""
    >
    <div class="absolute flex flex-col gap-3 mb-10">
      <span class="text-white font-extralight text-center">{{ props.product.attributes.name }}</span>
      <CustomButton
        text="開始訂單"
        secondary
      />
    </div>
  </div>
</template>

<script setup>
import CustomButton from '@/components/CustomButton.vue'
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