<template>
  <div>
    <form @submit.stop.prevent="confirmForm">
      <div class="form-group">
        <label for="productName">商品名稱: </label>
        <input
          type="text"
          class="form-control"
          id="productName"
          v-model="formDetail.name"
        >
      </div>
      <div class="form-group">
        <label for="productIsDisplay">發布狀態: </label>
        <select
          id="productIsDisplay"
          v-model="formDetail.isDisplay"
        >
          <option :value="true">顯示</option>
          <option :value="false">隱藏</option>
        </select>
      </div>
      <div class="form-group">
        <label for="productIsDisplay">訂單狀態: </label>
        <select
          id="productStatus"
          v-model="formDetail.status"
        >
          <option value="fill">額滿</option>
          <option value="fillable">未額滿</option>
          <option value="custom">自訂連結</option>
        </select>
      </div>
      <div class="form-group">
        <label for="productUrl">訂單連結: </label>
        <input
          type="text"
          class="form-control"
          id="productUrl"
          v-model="formDetail.url"
        >
      </div>
      <div class="form-group">
        <label for="productImgUpload">上傳圖片: </label>
        <small>(建議大小300px*300px，不超過1.5MB)</small>
        <div class="w-50">
          <img
            :src="productImgPreview"
            alt=""
            class="object-contain"
            style="max-width: 300px; max-height: 300px"
          >
        </div>
        <input
          type="file"
          id="productImgUpload"
          ref="uploadInput"
          @change="previewFile"
        >
        <!-- <button @click.prevent.stop="upload">上傳</button> -->
      </div>
      <button
        class="ml-10 mb-10"
        disabled
        v-if="isSubmitBtnLoading"
      >
        <FadeLoader color="#000" />
      </button>
      <button
        v-else
        type="submit"
        class="btn btn-primary"
      >確認</button>
    </form>
  </div>
</template>

<script setup>
import { reactive, onMounted } from 'vue'
import { useToast } from 'vue-toast-notification'
import { FadeLoader } from 'vue3-spinner'
const $toast = useToast()

const props = defineProps({
  productInfo: {
    type: Object,
    default: () => ({
      name: '',
      isDisplay: true,
      status: 'fill',
      url: '',
      files: [],
    })
  },
  isSubmitBtnLoading: {
    type: Boolean,
  }
})
const emit = defineEmits(['confirmForm'])

onMounted(() => {
  Object.assign(formDetail, { ...props.productInfo })
})

const formDetail = reactive({
  name: '',
  isDisplay: true,
  status: 'fill',
  url: '',
  files: [],
})
const productImgPreview = ref(props.productInfo.image)

const previewFile = (event) => {
  const files = event.target.files
  formDetail.files = files
  if (files.length === 0) {
    productImgPreview.value = ''
  } else {
    const imageURL = window.URL.createObjectURL(files[0])
    productImgPreview.value = imageURL
  }
}

const confirmForm = () => {
  const { name } = formDetail
  if (!name) {
    console.log('商品名稱不得為空')
    $toast.error('商品名稱不得為空')
    return
  }
  emit('confirmForm', { ...formDetail })
}
</script>