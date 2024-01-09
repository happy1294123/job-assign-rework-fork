<template>
  <UserLayout>
    <div class="flex justify-center mt-[40px]">
      <form @submit.prevent>
        <div :class="fieldGroupClass">
          <label for="username" class="text-primary">帳號</label>
          <input type="text" id="username" :class="inputClass" v-model="formData.username" disabled>
        </div>
        <div :class="fieldGroupClass">
          <label for="nickname" class="text-primary">姓名</label>
          <input type="text" id="nickname" :class="inputClass" v-model="formData.nickname" disabled>
        </div>
        <div :class="fieldGroupClass">
          <label for="phone" class="text-primary">電話</label>
          <input type="text" id="phone" :class="inputClass" v-model="formData.phone" disabled>
        </div>
        <div class="pt-2">
          <span class="text-sm mt-10 text-[#9B9B9B]">若需修改個人資料請洽客服人員</span>
        </div>
      </form>
    </div>
    <div class="flex justify-evenly mt-8">
      <div class="mr-10 w-[280px]">
        <CustomButton text="修改登入密碼" @click="handleShowEditPasswordModel" />
      </div>
    </div>
  </UserLayout>

  <div class="container mx-auto" @scroll.prevent @click="visibleEditPassword = false">
    <div class="flex justify-center">
      <div v-show="visibleEditPassword" class="
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
        ">
        <div :class="editPasswordFormData.isSuccess ? 'w-[180px]' : 'w-[380px]'"
          class="p-6 mx-4 bg-white rounded-md shadow-xl z-50" @click.stop>
          <div v-if="editPasswordFormData.isSuccess">
            <h3 class="text-2xl text-center">修改成功 </h3>
            <CustomButton @click="() => visibleEditPassword = false" text="知道了" class="flex mt-6 mx-auto" />
          </div>
          <div v-else>
            <div class="flex items-center justify-between">
              <h3 class="text-2xl">修改登入密碼</h3>
            </div>
            <div class="mt-4">
              <form @submit.prevent="handleEditPassword">
                <div :class="fieldGroupClass">
                  <label for="old-password" class="text-primary">舊密碼</label>
                  <input type="password" id="old-password" :class="inputClass" v-model="editPasswordFormData.oldPassword">
                  <span v-if="editPasswordFormData.oldPasswordError" class="text-red-400 -mb-6 ml-1">{{
                    editPasswordFormData.oldPasswordError }}</span>
                </div>
                <div :class="fieldGroupClass">
                  <label for="new-password" class="text-primary">新密碼</label>
                  <input type="password" id="new-password" :class="inputClass" v-model="editPasswordFormData.newPassword">
                  <span v-if="editPasswordFormData.newPasswordError" class="text-red-400 -mb-6 ml-1">{{
                    editPasswordFormData.newPasswordError }}</span>
                </div>
                <div :class="fieldGroupClass">
                  <label for="check-password" class="text-primary">確認新密碼</label>
                  <input type="password" id="check-password" :class="inputClass"
                    v-model="editPasswordFormData.checkNewPassword">
                  <span v-if="editPasswordFormData.checkNewPasswordError" class="text-red-400 -mb-6 ml-1">{{
                    editPasswordFormData.checkNewPasswordError }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="mt-auto cursor-pointer text-gray-400" @click="visibleEditPassword = false">
                    取消
                  </span>
                  <div class="flex gap-3">
                    <span class="ml-auto mt-auto text-red-400">
                      {{ editPasswordFormData.error }}
                    </span>
                    <CustomButton text="修改密碼" class="float-right mt-6 w-[100px] h-9"
                      :isLoading="editPasswordFormData.isLoading" />
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, watch } from 'vue'
import fetchWithToken from '../../utils/fetchFn'

const fieldGroupClass = 'flex flex-col mt-8 justify-center'
const inputClass = 'border rounded-md w-[330px] outline-primary h-10 px-2 mt-2 text-gray-400'

const formData = reactive({
  username: '',
  password: '',
  nickname: '',
  phone: '',
})

onMounted(async () => {
  const data = await fetchWithToken('/api/users/me?fields[0]=username&fields[1]=nickname&fields[2]=phone')
  formData.username = data.username
  formData.nickname = data.nickname
  formData.phone = data.phone
})

// edit password

const initPasswordFormData = {
  oldPassword: '',
  oldPasswordError: '',
  newPassword: '',
  newPasswordError: '',
  checkNewPassword: '',
  checkNewPasswordError: '',
  error: '',
  isLoading: false,
  hasError: false,
  isSuccess: false
}
const editPasswordFormData = reactive({ ...initPasswordFormData })

const visibleEditPassword = ref(false)
const handleShowEditPasswordModel = () => {
  Object.assign(editPasswordFormData, initPasswordFormData)
  visibleEditPassword.value = true
}

watch(() => editPasswordFormData.oldPassword, () => {
  editPasswordFormData.oldPasswordError = ''
})

watch(() => editPasswordFormData.newPassword, () => {
  editPasswordFormData.newPasswordError = ''
})

watch(() => editPasswordFormData.checkNewPassword, () => {
  editPasswordFormData.checkNewPasswordError = ''
})

const handleEditPassword = async () => {
  // validate
  editPasswordFormData.hasError = false
  validateInput('oldPassword')
  validateInput('newPassword')
  validateInput('checkNewPassword')
  if (editPasswordFormData.newPassword !== editPasswordFormData.checkNewPassword) {
    editPasswordFormData.error = '新密碼和確認新密碼不一致'
    editPasswordFormData.hasError = true
  }
  if (editPasswordFormData.hasError) {
    return
  }
  editPasswordFormData.error = ''

  // send request
  editPasswordFormData.isLoading = true
  const data = await fetchWithToken('/api/auth/change-password', 'post', {
    currentPassword: editPasswordFormData.oldPassword,
    password: editPasswordFormData.newPassword,
    passwordConfirmation: editPasswordFormData.checkNewPassword
  })
  if (data?.error?.message === 'The provided current password is invalid') {
    editPasswordFormData.error = '舊密碼錯誤，請重試'
    editPasswordFormData.isLoading = false
    return
  }
  editPasswordFormData.isSuccess = true
  editPasswordFormData.isLoading = false
}

const validateInput = (fieldName) => {
  if (!editPasswordFormData[fieldName]) {
    editPasswordFormData[fieldName + 'Error'] = '欄位不得為空'
    editPasswordFormData.hasError = true
    return
  }

  if (editPasswordFormData[fieldName].length < 6) {
    editPasswordFormData[fieldName + 'Error'] = '至少6個字元'
    editPasswordFormData.hasError = true
    return
  }
}
</script>