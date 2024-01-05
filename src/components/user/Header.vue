<template>
  <div class="w-full md:h-[100px] h-[70px] border-b flex items-center px-4 md:px-[67px]">
    <UserMobileMenu />
    <img
      src="@/assets/logo.svg"
      alt="logo"
      class="cursor-pointer"
      @click="() => router.push('/')"
    >
    <!-- :class="route.path === '/' ? 'block' : 'hidden md:block'" -->
    <span
      v-if="isLogin"
      class="md:hidden text-base text-primary"
    >{{ title }}
    </span>
    <div class="ml-10 hidden md:block">
      <UserSearchInput />
    </div>

    <div class="ml-auto flex gap-5">
      <!-- show when not login -->
      <div
        class="hidden md:flex gap-5"
        v-if="route.path !== '/login' && !isLogin"
      >
        <!-- login -->
        <CustomButton
          text="登入"
          @click="() => router.push('/login')"
        />
        <!-- register -->
        <CustomButton
          text="註冊"
          secondary
          @click="connectCustomService"
        />
        <span
          class="text-gray-400 my-auto cursor-pointer whitespace-nowrap"
          @click="connectCustomService"
        >
          業主專區
        </span>
      </div>
      <!-- show when login -->
      <div
        v-if="isLogin"
        class="flex gap-4"
      >
        <!-- point -->
        <div
          class="bg-gray-100 p-2 px-3 gap-2 rounded-lg flex cursor-pointer"
          @click="router.push('/point')"
        >
          <img
            src="@/assets/wallet.svg"
            alt="wallet"
          >
          <span class="text-primary">${{ main_point }}</span>

        </div>
        <!-- profile -->
        <img
          src="@/assets/avatar.svg"
          alt="avatar"
          class="w-7 cursor-pointer  hidden md:block"
          @click="router.push('/profile')"
        >
      </div>
      <!-- announcement -->
      <span
        v-if="route.path !== '/login'"
        class="text-gray-400 my-auto cursor-pointer whitespace-nowrap hidden md:block -ml-2"
        @click="router.push('/announcement')"
      >
        公告欄
      </span>
      <!-- logout -->
      <span
        v-if="isLogin"
        class="text-gray-400 my-auto cursor-pointer whitespace-nowrap hidden md:block"
        @click="logout"
      >
        登出
      </span>
    </div>
  </div>
</template>

<script setup >
import fetchWithToken from '@utils/fetchFn'

const connectCustomService = inject('connectCustomService')

const router = useRouter()
const route = useRoute()
const title = computed(() => route.path === '/point' ? '錢包'
  : route.path === '/profile' ? '個人資料'
    : route.path === '/announcement' ? '最新公告' : '')

const token = localStorage.getItem('token')
const isLogin = !!token

const main_point = ref(0)
onMounted(async () => {
  if (isLogin) {
    const data = await fetchWithToken('/api/users/me?fields[0]=main_point')
    main_point.value = data.main_point
  }
})

const logout = () => {
  localStorage.setItem('token', '')
  router.replace('/login')
}
</script>