<template>
  <div class="pt-3 text-dark">
    <div class="row">
      <div class="col-sm-6">
        <div class="card">
          <h5 class="card-header">帳號資料</h5>
          <div class="card-body">
            <form @submit.stop.prevent="editMember">
              <div class="form-group row mb-2">
                <label for="memberUserName" class="col-sm-3 col-form-label">員工帳號</label>
                <div class="col-sm-9">
                  <input type="text" class="form-control" id="memberUserName" v-model="userInfoDetail.username" disabled>
                </div>
              </div>

              <div class="form-group row mb-2">
                <label for="memberNickName" class="col-sm-3 col-form-label">姓名</label>
                <div class="col-sm-9">
                  <input type="text" class="form-control" id="memberNickName" v-model="userInfoDetail.nickname">
                </div>
              </div>

              <div class="form-group row mb-2">
                <label for="memberPhone" class="col-sm-3 col-form-label">電話</label>
                <div class="col-sm-9">
                  <input type="number" class="form-control" id="memberPhone" v-model="userInfoDetail.phone">
                </div>
              </div>

              <div class="form-group row mb-2">
                <label for="memberGroup" class="col-sm-3 col-form-label">員工群組</label>
                <div class="col-sm-3">
                  <select class="form-control" name="memberGroup" id="memberGroup" v-model="userInfoDetail.group">
                    <option value="null">無</option>
                    <option :value="group.id" v-for="group in groupOptions" :key="group.id">{{ group.name }}</option>
                  </select>
                </div>
              </div>


              <div class="form-group row mb-2">
                <label for="memberState" class="col-sm-3 col-form-label">狀態</label>
                <div class="col-sm-3">
                  <select class="form-control" name="memberState" id="memberState" v-model="userInfoDetail.isActive">
                    <option value="true">啟動</option>
                    <option value="false">停用</option>
                  </select>
                </div>
              </div>

              <div class="form-group row mb-2">
                <label for="memberRegisterDate" class="col-sm-3 col-form-label">註冊日期</label>
                <div class="col-sm-9">
                  <input type="text" class="form-control" id="memberRegisterDate" disabled value="2023-12-16 12:00:02">
                </div>
              </div>

              <div class="form-group row mb-2">
                <label for="memberLineId" class="col-sm-3 col-form-label">LineId</label>
                <div class="col-sm-9">
                  <input type="text" class="form-control" id="memberLineId" v-model="userInfoDetail.line_id">
                </div>
              </div>

              <div class="form-group row mb-2">
                <label for="memberNote" class="col-sm-3 col-form-label">備註</label>
                <div class="col-sm-9">
                  <textarea type="text" class="form-control" id="memberNote" v-model="userInfoDetail.note">
                    
                  </textarea>
                </div>
              </div>

              <button type="submit" class="btn btn-primary">修改</button>
            </form>
          </div>
        </div>
      </div>
      <div class="col-sm-6">
        <div class="row row-cols-1 mb-2">
          <div class="card">
            <h5 class="card-header">錢包紀錄</h5>
            <div class="card-body">
              <form class="form-inline">
                <div class="form-group">
                  <label for="mainPoint" class="mr-2">主錢包點數</label>
                  <input type="text" class="form-control text-right" :value="userInfoDetail.main_point" id="mainPoint" disabled>
                </div>
              </form>
            </div>
          </div>
        </div>
        <div class="row row-cols-1 mb-2">
          <div class="card">
            <h5 class="card-header">點數資訊</h5>
            <div class="card-body">
              <form class="form-inline">
                <div class="form-group mb-2">
                  <label for="addPointTotal" class="mr-2">補點總和</label>
                  <input type="text" class="form-control text-right" :value="pointLog.add" id="addPointTotal" disabled>
                </div>
                <div class="form-group mb-2">
                  <label for="minusPointTotal" class="mr-2">扣點總和</label>
                  <input type="text" class="form-control text-right" :value="pointLog.minus" id="minusPointTotal" disabled>
                </div>
              </form>
            </div>
          </div>
        </div>
        <div class="row row-cols-1 mb-2">
          <div class="card">
            <h5 class="card-header">密碼管理</h5>
            <div class="card-body text-center">
              <form class="form-inline" @submit.prevent.stop="resetPassword">
                <input type="password" class="form-control" v-model="newPassword">
                <button type="submit" class="btn btn-primary">重設登入密碼</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useToast } from 'vue-toast-notification'
const $toast = useToast()

const props = defineProps({
  userInfo: {
    type: Object,
    default: () => ({
      createdAt: '',
      username: '',
      nickname: '',
      group: '',
      isActive: false,
      line_id: '',
      note: '',
    })
  },
  pointLog: {
    type: Object,
    default: () => ({
      add: 0,
      minus: 0,
    })
  },
  groupOptions: {
    type: Array,
    default: () => []
  }
})
const emit = defineEmits(['editMember', 'resetPassword'])
const userInfoDetail = reactive({})
const newPassword = ref('')

watch(props.userInfo, (newValue) => {
  Object.assign(userInfoDetail, newValue)
})

const editMember = () => {
  emit('editMember', userInfoDetail)
}

const resetPassword = () => {
  newPassword.value = newPassword.value.trim()
  if (!newPassword.value) {
    console.log('密碼欄位不得為空')
    $toast.error('密碼欄位不得為空', {
      class: 'toast-default'
    })
    return
  }
  if (newPassword.value.indexOf(' ') >= 0) {
    console.log('密碼欄位字元間不得有空白')
    $toast.error('密碼欄位字元間不得有空白', {
      class: 'toast-default'
    })
    return
  }
  if (newPassword.value.length < 6) {
    console.log('密碼須超過六個字元')
    $toast.error('密碼須超過六個字元', {
      class: 'toast-default'
    })
    return
  }
  emit('resetPassword', newPassword.value)
  newPassword.value = ''
}
</script>