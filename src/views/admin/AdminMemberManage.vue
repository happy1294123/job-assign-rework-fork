<template>
  <Modal ref="createMemberModal">
    <template v-slot:modalTitle>
      新增員工
    </template>
    <template v-slot:modalBody>
      <CreateMemberForm @confirmForm="createMember" :group-options="groupOptions">
      </CreateMemberForm>
    </template>
  </Modal>
  <Layout>
    <template v-slot:content>
      <div class="main">
        <div class="search">
          <div>
            <form class="float-left text-dark" @submit.prevent.stop="filterMembers">
              <div class="form-group">
                <label for="infoKeyWords">帳號/姓名/電話</label>
                <input v-model="filterDetail.info" type="text" class="form-control" id="infoKeyWords">
              </div>

              <div class="form-group">
                <label for="memberGroup">員工群組</label>
                <select id="memberGroup" v-model="filterDetail.group">
                  <option value="0">全部</option>
                  <option v-for="option in groupOptions" :key="option.id" :value="option.id">{{ option.name }}</option>
                </select>
              </div>

              <div class="form-group">
                <label for="memberState">員工狀態</label>
                <select id="memberState" v-model="filterDetail.isActive">
                  <option value="">全部</option>
                  <option value="true">啟用</option>
                  <option value="false">停用</option>
                </select>
              </div>

              <button type="submit" class="btn btn-primary">查詢</button>
            </form>
          </div>
          <!-- Button trigger modal -->
          <button type="button" class="btn btn-primary float-right mr-1" @click.prevent="createMemberModal.modalOpen()">
            <i class="iconfont">&#xe665;</i>新增
          </button>
        </div>

        <AdminPagination :page="pagination.page" :pageSize="pagination.pageSize" :pageCount="pagination.pageCount"
          :total="pagination.total" @changePage="(newPage) => pagination.page = newPage"
          @changePageSize="(newPageSize) => pagination.pageSize = newPageSize" />
        <div class="table-box">
          <table class="table">
            <thead>
              <tr>
                <th scope="col" class="text-nowrap">編號</th>
                <th scope="col" class="text-nowrap">員工帳號</th>
                <th scope="col" class="text-nowrap">姓名</th>
                <th scope="col" class="text-nowrap">電話</th>
                <th scope="col" class="text-nowrap">群組</th>
                <th scope="col" class="text-nowrap">主錢包餘額</th>
                <th scope="col" class="text-nowrap">註冊日期</th>
                <th scope="col" class="text-nowrap">最近登入IP</th>
                <th scope="col" class="text-nowrap">備註</th>
                <th scope="col" class="text-nowrap">功能</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="member in sliceMembers" :key="member.id"
                :style="{ backgroundColor: !member.isActive && 'lightgray' }">
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
                  {{ member.phone }}
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
                  <div class="text-nowrap" v-if="member.createdAt">
                    <div>
                      {{ formatDate(member.createdAt) }}
                    </div>
                    <div>
                      {{ formatTime(member.createdAt) }}
                    </div>
                  </div>
                </td>
                <td>
                  {{ member?.login_logs?.[0]?.ip }}
                </td>
                <td class="text-nowrap">
                  {{ member.note }}
                </td>
                <td class="flex gap-2">
                  <router-link :to="{ name: 'AdminMember', params: { memberId: member.id } }"
                    class="btn btn-primary text-nowrap">
                    修改
                  </router-link>
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
import Layout from '../../components/admin/Layout.vue'
import Modal from '../../components/admin/Modal.vue'
import CreateMemberForm from '../../components/admin/form/CreateMemberForm.vue'
import { ref, reactive, computed, onMounted } from 'vue'
import getFilterQuery from '@utils/getFilterQuery'
import fetchWithToken, { fetchWithoutToken } from '@utils/fetchFn'
import { formatDate, formatTime } from '@utils/formatDateTime'
import qs from 'qs'
import { useToast } from 'vue-toast-notification'
const $toast = useToast()

const members = ref([])
const groupOptions = ref([])
const createMemberModal = ref(null)

const pagination = inject('pagination')
const sliceMembers = computed(() => members.value.slice(pagination.pageSize * (pagination.page - 1), pagination.page * pagination.pageSize))

const filterDetail = reactive({
  info: '',
  group: 0,
  isActive: '',
})

onMounted(async () => {
  const { data } = await fetchWithToken('/api/groups?fields[0]=name&fields[1]=isDefault')
  groupOptions.value = data.map((group) => ({
    id: group.id,
    name: group.attributes.name,
    isDefault: group.attributes.isDefault,
  }))
})

const route = useRoute()

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

const fetchMembers = async (query) => {
  const { filterQuery } = getFilterQuery(query)
  // pagination.total = await fetchWithToken(`/api/users/count?${countFilterQuery}`)
  members.value = await fetchWithToken(`/api/users?${queryString}${filterQuery}`)
  pagination.total = members.value.length
}
onMounted(() => {
  fetchMembers(route.query)
})

const createMember = async (formDetail) => {
  const { username, password, nickname, phone, group, lineId: line_id, note } = formDetail
  const postBody = {
    username,
    password,
    nickname,
    phone: String(phone),
    group,
    line_id,
    note,
  }

  const data = await fetchWithoutToken('/api/auth/local/register', 'POST', postBody)
  if (data.error && data.error.message === 'Email or Username are already taken') {
    $toast.error('員工帳號已重複', {
      class: 'toast-default'
    })
    return
  }
  if (data.error && data.error.message === 'This attribute must be unique') {
    $toast.error('員工姓名已重複', {
      class: 'toast-default'
    })
    return
  }

  if (data.user === undefined) {
    $toast.error('新增帳號錯誤', {
      class: 'toast-default'
    })
    return
  }

  const { id, createdAt, main_point } = data.user

  const selectedGroup = groupOptions.value.find((option) => option.id === group)

  members.value.unshift({
    username,
    nickname,
    phone,
    group: selectedGroup,
    main_point,
    id,
    createdAt,
    note,
    isActive: true
  })

  createMemberModal.value.modalClose()
  $toast.success('新增帳號成功', {
    class: 'toast-default'
  })
}

const filterMembers = () => {
  fetchMembers(filterDetail)
}
</script>