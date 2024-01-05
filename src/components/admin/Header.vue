<template>
  <Modal ref="editPasswordModal">
    <template v-slot:modalTitle>
      修改密碼
    </template>
    <template v-slot:modalBody>
      <form
        class="flex"
        @submit.prevent="handleEditPassword"
      >
        <input
          type="password"
          class="form-control"
          v-model="newPassword"
        >
        <button
          type="submit"
          class="btn btn-primary whitespace-nowrap w-[123px]"
        ><span v-if="isLoading">
            <LoadingIcon />
          </span>
          <span v-else>
            重設管理者登入密碼
          </span></button>
      </form>
      <div class="text-red-400 text-sm">
        {{ error }}
      </div>
    </template>
  </Modal>
  <header>
    <div class="dropdown float-right flex">
      <button
        class="btn  btn-sm  d-flex items-center"
        type="button"
        id="dropdownMenu2"
        data-toggle="dropdown"
        aria-haspopup="true"
        aria-expanded="false"
        @click="handleClickAdminName"
      >
        <svg
          width="20"
          height="1em"
          viewBox="0 0 16 16"
          class="bi bi-emoji-smile-fill rounded-circle"
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill-rule="evenodd"
            d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zM7 6.5C7 7.328 6.552 8 6 8s-1-.672-1-1.5S5.448 5 6 5s1 .672 1 1.5zM4.285 9.567a.5.5 0 0 1 .683.183A3.498 3.498 0 0 0 8 11.5a3.498 3.498 0 0 0 3.032-1.75.5.5 0 1 1 .866.5A4.498 4.498 0 0 1 8 12.5a4.498 4.498 0 0 1-3.898-2.25.5.5 0 0 1 .183-.683zM10 8c.552 0 1-.672 1-1.5S10.552 5 10 5s-1 .672-1 1.5S9.448 8 10 8z"
          />
        </svg>
        <!--可以使用图片,大小20,class='rounded-circle'-->
        {{ nickname }}
      </button>
      <a
        class="dropdown-item cursor-pointer"
        @click.stop.prevent="logout"
      >登出</a>
    </div>
  </header>
</template>

<script setup>
import { onMounted, onUnmounted, watch } from 'vue'
import fetchWithToken from '@utils/fetchFn'
import Modal from '@/components/admin/Modal.vue'
import { useToast } from 'vue-toast-notification'
import { countIdleLogout, removeCountIdleLogout } from '@utils/countIdleLogout'

const nickname = ref('')

const router = useRouter()
const token = localStorage.getItem('token')
if (!token) {
  router.replace('/login')
}

const logout = () => {
  localStorage.setItem('token', '')
  location.href = '/admin'
}

onMounted(async () => {
  const data = await fetchWithToken('/api/users/me')
  nickname.value = data.nickname
  if (data.isAdmin !== true) {
    router.replace('/')
    alert('無管理者權限')
  }
  // not use 10 mins, auto logout 
  countIdleLogout()
})

onUnmounted(() => removeCountIdleLogout)

const editPasswordModal = ref(null)
const handleClickAdminName = () => {
  editPasswordModal.value.modalOpen()
}


// edit password
const $toast = useToast()
const newPassword = ref('')
watch(newPassword, () => {
  error.value = ''
})
const isLoading = ref(false)
const error = ref('')
const handleEditPassword = async () => {
  if (newPassword.value === '') {
    error.value = '請輸入密碼'
    return
  }
  if (newPassword.value.length < 6) {
    error.value = '密碼至少6位元'
    return
  }
  if (!confirm('確定要修改密碼嗎？')) return
  isLoading.value = true

  const adminId = localStorage.getItem('adminId')
  if (!adminId) {
    error.value = '發生錯誤'
    isLoading.value = false
    return
  }

  const data = await fetchWithToken(`/api/users/${adminId}`, 'PUT', {
    password: newPassword.value
  })

  if (data.id) {
    $toast.success('密碼修改成功', {
      class: 'toast-default'
    })
  } else {
    $toast.success('密碼修改失敗', {
      class: 'toast-default'
    })
  }

  editPasswordModal.value.modalClose()
  newPassword.value = ''
  isLoading.value = false
}
</script>