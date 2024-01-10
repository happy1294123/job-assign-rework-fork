<template>
  <Modal ref="MainPointManipulateModal">
    <template v-slot:modalTitle>
      主錢包操作
    </template>
    <template v-slot:modalBody>
      <MainPointManipulateForm
        :chosen-member="chosenMember"
        @manipulateMainPoint="manipulateMainPoint"
      >
      </MainPointManipulateForm>
    </template>
  </Modal>
  <Layout>
    <template v-slot:content>
      <div class="main">
        <div class="search">
          <div>
            <form
              class="float-left text-dark"
              @submit.stop.prevent="fetchMembers"
            >
              <div class="form-group">
                <label for="infoKeyWords">帳號/姓名</label>
                <input
                  type="text"
                  class="form-control"
                  id="infoKeyWords"
                  v-model="filterDetail.info"
                >
              </div>

              <div class="form-group">
                <label for="memberGroup">員工群組</label>
                <select
                  id="memberGroup"
                  v-model="filterDetail.group"
                >
                  <option value="null">全部</option>
                  <option
                    :value="group.id"
                    v-for="group in groupOptions"
                    :key="group.id"
                  >{{ group.name }}</option>
                </select>
              </div>

              <button
                type="submit"
                class="btn btn-primary"
              >查詢</button>
            </form>
          </div>
        </div>

        <!-- <div>
          <div class="flex text-dark p-2">
            共
            <span>
              1
            </span>
            筆資料，總頁數
            <span>
              1
            </span>
            頁 每頁筆數:
            <div>
              <select name="itemsCount">
                <option value="10" selected>
                  10
                </option>
              </select>
            </div>
            目前第:
            <div>
              <select name="chosenPage">
              </select>
            </div>
            頁
          </div>
        </div> -->

        <div class="table-box">
          <table class="table">
            <thead>
              <tr>
                <th scope="col">編號</th>
                <th scope="col">員工帳號</th>
                <th scope="col">姓名</th>
                <th scope="col">狀態</th>
                <th scope="col">群組</th>
                <th scope="col">主錢包餘額</th>
                <th scope="col">註冊日期</th>
                <th scope="col">最近登入IP</th>
                <th scope="col">功能</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="member in members"
                :key="member.id"
              >
                <th scope="row">
                  {{ member.id }}
                </th>
                <td>
                  {{ member.username }}
                </td>
                <td>
                  {{ member.nickname }}
                </td>
                <td>
                  <span v-if="member.isActive">啟動</span>
                  <span v-else>停用</span>
                </td>
                <td>
                  <div v-if="member.group">
                    {{ member.group.name }}
                  </div>
                  <div v-else>
                    無
                  </div>
                </td>
                <td>
                  {{ member.main_point }}
                </td>
                <td>
                  <div>
                    {{ formatDate(member.createdAt) }}
                  </div>
                  <div>
                    {{ formatTime(member.createdAt) }}
                  </div>
                </td>
                <td>
                  {{ member?.login_logs?.[0]?.ip }}
                </td>
                <td>
                  <button
                    class="btn btn-primary"
                    @click.prevent="chooseMember(member)"
                  >加扣點</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </template>
  </Layout>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import Modal from '../../components/admin/Modal.vue'
import Layout from '../../components/admin/Layout.vue'
import MainPointManipulateForm from '../../components/admin/form/MainPointManipulateForm.vue'
import fetchWithToken from '@utils/fetchFn'
import getFilterQuery from '@utils/getFilterQuery'
import { formatDate, formatTime } from '@utils/formatDateTime'
import { useToast } from 'vue-toast-notification'
const $toast = useToast()
import qs from 'qs'

const groupOptions = ref([])
const members = ref([])
const filterDetail = reactive({
  info: '',
  group: null,
})
const pagination = reactive({
  page: 1,
  pageSize: 10,
  allCount: 0
})
const MainPointManipulateModal = ref(null)
const chosenMember = reactive({
  member: '',
  isActive: false,
  main_point: 0,
})

const queryString = qs.stringify({
  fields: ['username', 'nickname', 'phone', 'main_point', 'createdAt', 'note', 'isActive'],
  populate: {
    group: {
      fields: ['name']
    },
    login_logs: {
      sort: {
        createdAt: 'desc'
      },
      limit: 1,
      fields: ['ip']
    },
  },
  sort: {
    createdAt: 'desc'
  },
  filters: {
    isAdmin: false
  }
  // start: 2,
  // limit: 2
})

const fetchMembers = async () => {
  const { filterQuery, countFilterQuery } = getFilterQuery(filterDetail)
  pagination.allCount = await fetchWithToken(`/api/users/count?${countFilterQuery}`)
  members.value = await fetchWithToken(`/api/users?${queryString}${filterQuery}`)
}

const fetchGroupOptions = async () => {
  const { data } = await fetchWithToken('/api/groups?fields[0]=name&fields[1]=isDefault')
  groupOptions.value = data.map((group) => ({
    id: group.id,
    name: group.attributes.name,
  }))
}

const chooseMember = (member) => {
  Object.assign(chosenMember, {
    id: member.id,
    member: member.username + `(${member.nickname})`,
    isActive: member.isActive,
    main_point: member.main_point,
  })
  MainPointManipulateModal.value.modalOpen()
}

const manipulateMainPoint = async (formDetail) => {
  const balance = chosenMember.main_point + formDetail.edit_point
  const postBody = {
    data: {
      user: chosenMember.id,
      ...formDetail,
      balance
    }
  }
  await fetchWithToken('/api/point-logs', 'POST', postBody)
  const data = await fetchWithToken(`/api/users/${chosenMember.id}`, 'PUT', { main_point: balance })
  console.log(data)
  $toast.success('加扣點成功', {
    class: 'toast-default'
  })
  MainPointManipulateModal.value.modalClose()
  fetchMembers()
}

onMounted(() => {
  fetchGroupOptions()
  fetchMembers()
})
</script>