<template>
  <UserLayout>
    <h1 class="text-2xl my-4 text-primary">
      聯繫我們
    </h1>
    <div class="flex justify-center">
      <form @submit.prevent="handleSubmit">
        <div :class="fieldGroupClass">
          <label for="username" class="text-primary">名稱</label>
          <input type="text" id="username" placeholder="請輸入名稱" :class="inputClass" v-model="formData.name">
          <!-- <span v-show="error.username" :class="errorClass">{{ error.username }}</span> -->
        </div>
        <div :class="fieldGroupClass">
          <label for="password" class="text-primary">Email</label>
          <input type="email" id="password" placeholder="請輸入email" :class="inputClass" v-model="formData.email">
          <!-- <span v-show="error.password" :class="errorClass">{{ error.password }}</span> -->
        </div>
        <div :class="fieldGroupClass">
          <label for="captcha" class="text-primary">主旨</label>
          <input type="text" id="captcha" placeholder="請輸入主旨" :class="inputClass">
          <!-- <span v-show="error.captcha" :class="errorClass">{{ error.captcha }}</span> -->
        </div>
        <div :class="fieldGroupClass">
          <label for="captcha" class="text-primary">內容</label>
          <textarea name="" id="content" cols="30" rows="10" class="border rounded-md w-[330px] outline-primary p-2 mt-2"></textarea>
          <input type="text" id="captcha"  >
          <!-- <span v-show="error.captcha" :class="errorClass">{{ error.captcha }}</span> -->
        </div>
        <div class="mt- flex justify-center mx-auto">
            <CustomButton text="送出" class="w-[160px]" />
          </div>
        <!-- <div class="flex items-end gap-1">
          <input type="text" id="random-field" disabled>
          <img src="@/assets/refresh.svg" alt="refresh" class="w-4 cursor-pointer" @click="generateCaptcha">
        </div>
        <div class="mt-[40px] flex justify-center mx-auto">
          <CustomButton text="登入" class="w-[160px]" :isLoading="isLoading" />
        </div>
        <span v-show="error.returnError" :class="errorClass" class="flex justify-center mt-2">{{ error.returnError
        }}</span> -->
      </form>
    </div>
  </UserLayout>
</template>

<script setup>
import { reactive } from 'vue'

const fieldGroupClass = 'flex flex-col mt-8 justify-center'
const inputClass = 'border rounded-md w-[330px] outline-primary h-10 px-2 mt-2'
// const errorClass = 'text-red-400'

const formData = reactive({
  name: '',
  email: '',
  title: '',
  content: '',
})
const handleSubmit = () => {
  console.log(formData)
}
</script>