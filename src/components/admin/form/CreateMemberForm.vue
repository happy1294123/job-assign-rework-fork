<template>
  <div>
    <form @submit.stop.prevent="confirmForm">
      <div class="form-group">
        <label for="username">員工帳號:<span class="text-red-400 ">*</span></label>
        <input
          v-model="formDetail.username"
          type="text"
          class="form-control"
          id="username"
        >
      </div>
      <div class="form-group">
        <label for="password">登入密碼:<span class="text-red-400 ">*</span> </label>
        <input
          v-model="formDetail.password"
          type="password"
          class="form-control"
          id="password"
        >
      </div>
      <div class="form-group">
        <label for="nickname">員工姓名:<span class="text-red-400 ">*</span> </label>
        <input
          v-model="formDetail.nickname"
          type="text"
          class="form-control"
          id="nickname"
        >
      </div>
      <div class="form-group">
        <label for="phone">電話:<span class="text-red-400 ">*</span> </label>
        <input
          v-model="formDetail.phone"
          type="number"
          class="form-control"
          id="phone"
        >
      </div>
      <div class="form-group">
        <label for="group">員工群組:<span class="text-red-400 ">*</span> </label>
        <select
          v-model="formDetail.group"
          name="group"
          id="group"
        >
          <option
            value="0"
            disabled
          >無</option>
          <option
            v-for="group in groupOptions"
            :key="group.id"
            :value="group.id"
          >
            {{ group.name }}
          </option>
        </select>
      </div>
      <div class="form-group">
        <label for="lineId">LineID: </label>
        <input
          v-model="formDetail.lineId"
          type="text"
          class="form-control"
          id="lineId"
        >
      </div>
      <div class="form-group">
        <label for="note">備註: </label>
        <input
          v-model="formDetail.note"
          type="text"
          class="form-control"
          id="note"
        >
      </div>
      <button
        type="submit"
        class="btn btn-primary"
      >Submit</button>
    </form>
  </div>
</template>

<script setup>
import { useToast } from 'vue-toast-notification'
import { onMounted, reactive } from 'vue'
const $toast = useToast()

const props = defineProps({
  groupOptions: {
    type: Array,
    default: () => []
  }
})
const emit = defineEmits(['confirmForm'])

const formDetail = reactive({
  username: '',
  password: '',
  nickname: '',
  phone: '',
  group: 0,
  lineId: '',
  note: '',
})

onMounted(() => {
  formDetail.group = props.groupOptions.find(group => group.isDefault)?.id || 0
})

const confirmForm = () => {
  const { username, password, phone, group } = formDetail
  if (!username || !password || !phone || !group) {
    console.log('欄位不得為空')
    $toast.error('必填欄位不得為空', {
      class: 'toast-default'
    })
    return
  }
  emit('confirmForm', { ...formDetail })
}
</script>