<template>
  <Layout>
    <template v-slot:content>
      <div class="pt-3 text-dark main">
        <div class="mb-2">
          <div class="card">
            <h5 class="card-header">員工查詢</h5>
            <div class="card-body">
              <form @submit.prevent.stop="fetchMembers">
                <div class="form-group row mb-2">
                  <span class="col-form-label col-auto">查詢時間</span>
                  <div class="input-group col-9">
                    <button class="btn btn-secondary mr-3" @click.prevent="handleToday">今日</button>
                    <button class="btn btn-secondary mr-3" @click.prevent="handleYesterday">昨日</button>
                    <button class="btn btn-secondary mr-3" @click.prevent="handleThisWeek">本週</button>
                    <button class="btn btn-secondary mr-3" @click.prevent="handleLastWeek">上週</button>
                    <button class="btn btn-secondary mr-3" @click.prevent="handleThisMonth">本月</button>
                    <button class="btn btn-secondary mr-3" @click.prevent="handleLastMonth">上月</button>
                  </div>
                </div>

                <div class="form-group row mb-2">
                  <span class="col-form-label col-auto">日期區間</span>
                  <div class="input-group col-9">
                    <label class="sr-only" for="startDateTime"></label>
                    <input type="datetime-local" class="form-control" id="startDateTime" v-model="filterDetail.startDate">
                    <div class="input-group-prepend input-group-append">
                      <label class="input-group-text">-</label>
                    </div>
                    <label class="sr-only" for="endDateTime"></label>
                    <input type="dateTime-local" class="form-control" id="endDateTime" v-model="filterDetail.endDate">
                  </div>
                </div>

                <div class="form-group row mb-2">
                  <label for="memberInfo" class="col-form-label col-auto">帳號/姓名</label>
                  <div class="col-auto">
                    <input type="text" class="form-control" v-model="filterDetail.info">
                  </div>
                  <label for="memberInfo" class="col-form-label col-auto">員工群組</label>
                  <div class="col-auto">
                    <select class="form-control" v-model="filterDetail.group">
                      <option :value="null">全部</option>
                      <option :value="option.id" v-for="option in groupOptions" :key="option.id">{{ option.name }}
                      </option>
                    </select>
                  </div>
                </div>

                <div class="form-group">

                </div>
                <div class="form-group row mb-2 align-items-center">
                  <span class="col-form-label col-auto">狀態</span>
                  <div class="col-auto">
                    <div class="form-check form-check-inline">
                      <input class="form-check-input" type="radio" name="pointState" id="all"
                        v-model="filterDetail.pointState" value="all">
                      <label class="form-check-label" for="all">全部</label>
                    </div>

                    <div class="form-check form-check-inline">
                      <input class="form-check-input" type="radio" name="pointState" id="add"
                        v-model="filterDetail.pointState" value="add">
                      <label class="form-check-label" for="add">補點</label>
                    </div>

                    <div class="form-check form-check-inline">
                      <input class="form-check-input" type="radio" name="pointState" id="minus"
                        v-model="filterDetail.pointState" value="minus">
                      <label class="form-check-label" for="minus">扣點</label>
                    </div>
                  </div>
                </div>
                <div class="form-group">
                  <div class="mr-2"></div>
                  <div class="col-9">
                    <button class="btn btn-primary">查詢</button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>


        <div class="card">
          <h5 class="card-header">點數紀錄</h5>
          <div class="card-body p-0">

            <AdminPagination />

          </div>
        </div>
        <div class="table-box">
          <table class="table">
            <thead class="thead-dark">
              <tr>
                <th class="text-nowrap" scope="col">編號</th>
                <th class="text-nowrap" scope="col">員工帳號</th>
                <th class="text-nowrap" scope="col">姓名</th>
                <th class="text-nowrap" scope="col">狀態</th>
                <th class="text-nowrap" scope="col">群組</th>
                <th class="text-nowrap" scope="col">點數紀錄</th>
                <th class="text-nowrap" scope="col">主錢包餘額</th>
                <th class="text-nowrap" scope="col">異動時間</th>
                <th class="text-nowrap" scope="col">事由</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="log in pointLogs" :key="log.id">
                <th scope="row">{{ log.id }}</th>
                <td>{{ log.username }}</td>
                <td>{{ log.nickname }}</td>
                <td>{{ log.isActive }}</td>
                <td>{{ log.group }}</td>
                <td class="flex" :class="{ 'text-success': log.edit_point > 0, 'text-danger': log.edit_point < 0 }">

                  <span v-if="log.edit_point > 0">+</span>
                  {{ log.edit_point }}
                </td>
                <td>{{ log.balance }}</td>
                <td>
                  <div>
                    {{ formatDate(log.createdAt) }}
                  </div>
                  <div>
                    {{ formatTime(log.createdAt) }}
                  </div>
                </td>
                <td scope="row">{{ contentSubString(log.cause) }}</td>
              </tr>
              <tr>
                <td colspan="3"></td>
                <td colspan="2" class="text-center">總計</td>
                <td class="flex" :class="{ 'text-success': totalPoints > 0, 'text-danger': totalPoints < 0 }">
                  <span v-if="totalPoints > 0">+</span>
                  {{ totalPoints }}
                </td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </template>
  </Layout>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import Layout from '../../components/admin/Layout.vue'
import fetchWithToken from '@utils/fetchFn.js'
import { formatDate, formatTime } from '@utils/formatDateTime'
import { formatISO, endOfYesterday, startOfYesterday, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns'

const filterDetail = reactive({
  startDate: formatISO(new Date()).slice(0, 10) + 'T00:00',
  endDate: formatISO(new Date()).slice(0, 10) + 'T23:59',
  info: '',
  group: null,
  pointState: 'all',
})
const pointLogs = ref([])
const groupOptions = ref([])

const fetchGroupOptions = async () => {
  const { data } = await fetchWithToken('/api/groups?fields[0]=name&fields[1]=isDefault')
  groupOptions.value = data.map((group) => ({
    id: group.id,
    name: group.attributes.name,
    isDefault: group.attributes.isDefault
  }))

  filterDetail.group = groupOptions.value.find(group => group.isDefault)?.id || 0
}

const pagination = inject('pagination')
const fetchMembers = async () => {
  let queryString = ''
  if (filterDetail.startDate) {
    console.log('start')
    queryString += `&filters[$and][0][createdAt][$gt]=${filterDetail.startDate}`
  }

  if (filterDetail.startDate && filterDetail.endDate) {
    queryString += `&filters[$and][1][createdAt][$lt]=${filterDetail.endDate}`
  }

  if (filterDetail.info) {
    queryString += `&filters[$or][2][user][username][$contains]=${filterDetail.info}&filters[$or][3][user][nickname][$contains]=${filterDetail.info}`
  }

  if (filterDetail.group) {
    queryString += `&filters[user][group][id][$eq]=${filterDetail.group}`
  }

  if (filterDetail.pointState === 'all') {
    queryString += '&filters[$and][4][edit_point][$lt|$gt]=0'
  } else if (filterDetail.pointState === 'add') {
    queryString += '&filters[$and][4][edit_point][$gt]=0'
  } else {
    queryString += '&filters[$and][4][edit_point][$lt]=0'
  }

  const { data, meta } = await fetchWithToken(`/api/point-logs?populate[0]=user&populate[1]=user.group${queryString}&filters[user][isAdmin]=false&sort[createdAt]=desc`)
  console.log(meta)
  Object.assign(pagination, meta.pagination)
  pointLogs.value = data.map((item) => ({
    id: item.id,
    username: item.attributes.user.data?.attributes.username || '查無此人',
    nickname: item.attributes.user.data?.attributes.nickname || '查無此人',
    isActive: item.attributes.user.data?.attributes.isActive || '查無此人',
    group: item.attributes.user.data?.attributes.group?.data.attributes.name || '查無群組',
    edit_point: item.attributes.edit_point,
    balance: item.attributes.balance,
    createdAt: item.attributes.createdAt,
    cause: item.attributes.cause,
  }))
}

const totalPoints = computed(() => {
  let total = 0
  pointLogs.value.forEach((log) => {
    total += log.edit_point
  })
  return total
})

const contentSubString = (content) => {
  if (content.length < 40) return content
  return content.substring(0, 40) + '...'
}

onMounted(() => {
  fetchGroupOptions()
  fetchMembers()
})


const handleToday = () => {
  filterDetail.startDate = formatISO(new Date()).slice(0, 10) + 'T00:00'
  filterDetail.endDate = formatISO(new Date()).slice(0, 10) + 'T23:59'
}

const handleYesterday = () => {
  filterDetail.startDate = formatISO(startOfYesterday()).slice(0, 10) + 'T00:00'
  filterDetail.endDate = formatISO(endOfYesterday()).slice(0, 10) + 'T23:59'
}

const handleThisWeek = () => {
  filterDetail.startDate = formatISO(startOfWeek(new Date())).slice(0, 10) + 'T00:00'
  filterDetail.endDate = formatISO(endOfWeek(new Date())).slice(0, 10) + 'T23:59'
}

const handleLastWeek = () => {
  const now = new Date()
  const lastWeek = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() - 7
  )
  filterDetail.startDate = formatISO(startOfWeek(lastWeek)).slice(0, 10) + 'T00:00'
  filterDetail.endDate = formatISO(endOfWeek(lastWeek)).slice(0, 10) + 'T23:59'
}

const handleThisMonth = () => {
  filterDetail.startDate = formatISO(startOfMonth(new Date())).slice(0, 10) + 'T00:00'
  filterDetail.endDate = formatISO(endOfMonth(new Date())).slice(0, 10) + 'T23:59'
}

const handleLastMonth = () => {
  const now = new Date()
  const lastMonth = new Date(
    now.getFullYear(),
    now.getMonth() - 1,
    now.getDate()
  )
  filterDetail.startDate = formatISO(startOfMonth(lastMonth)).slice(0, 10) + 'T00:00'
  filterDetail.endDate = formatISO(endOfMonth(lastMonth)).slice(0, 10) + 'T23:59'
}
</script>