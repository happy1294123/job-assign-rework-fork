<template>
  <Teleport to="body">
    <div
      class="container mx-auto"
      @scroll.prevent
    >
      <div class="flex justify-center">
        <div
          v-show="visible"
          class="
          absolute
          top-0
          bottom-0
          inset-0
          flex
          items-center
          justify-center
          overflow-auto
          bg-gray-700 bg-opacity-50 
          z-50
        "
          @click="visible = false"
        >
          <div
            class="w-[330px] h-[175px] p-6 mx-4 bg-white rounded-md shadow-xl -mt-10 z-50"
            @click.stop
          >
            <div class="flex items-center justify-between">
              <h3 class="text-2xl">請注意</h3>
            </div>
            <div class="mt-4">
              <p class="mb-4 text-sm text-gray-400">
                {{ text || '請洽客服人員' }}
              </p>
              <CustomButton
                text="我知道了"
                @click="visible = false"
                class="float-right"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import CustomButton from './CustomButton.vue'
import { ref } from 'vue'
const text = ref('')

const visible = ref(false)
const close = () => {
  visible.value = false
  text.value = ''
}
const open = (passText) => {
  if (typeof passText === 'string') {
    text.value = passText
  } else {
    text.value = ''
  }
  visible.value = true
}

defineExpose({ open, close })
</script>