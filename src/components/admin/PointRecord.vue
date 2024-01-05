<template>
  <div class="pt-3 text-dark">
    <div class="row mb-2">
      <div class="col-10">
        <div class="card">
          <h5 class="card-header">登入查詢</h5>
          <div class="card-body">
            <form>
              <div class="form-group row mb-2">
                <span class="col-form-label mr-2 col-2">查詢時間</span>
                <div class="input-group col-9">
                  <button
                    class="btn btn-secondary mr-3"
                    @click.prevent="handleToday"
                  >今日</button>
                  <button
                    class="btn btn-secondary mr-3"
                    @click.prevent="handleYesterday"
                  >昨日</button>
                  <button
                    class="btn btn-secondary mr-3"
                    @click.prevent="handleThisWeek"
                  >本週</button>
                  <button
                    class="btn btn-secondary mr-3"
                    @click.prevent="handleLastWeek"
                  >上週</button>
                  <button
                    class="btn btn-secondary mr-3"
                    @click.prevent="handleThisMonth"
                  >本月</button>
                  <button
                    class="btn btn-secondary mr-3"
                    @click.prevent="handleLastMonth"
                  >上月</button>
                </div>
              </div>
              <div class="form-group row mb-2">
                <span class="col-form-label mr-2 col-2">日期區間</span>
                <div class="input-group col-9">
                  <label
                    class="sr-only"
                    for="startDateTime"
                  ></label>
                  <input
                    type="datetime-local"
                    class="form-control"
                    id="startDateTime"
                    v-model="filterDetail.startDate"
                  >
                  <div class="input-group-prepend input-group-append">
                    <label class="input-group-text">-</label>
                  </div>
                  <label
                    class="sr-only"
                    for="endDateTime"
                  ></label>
                  <input
                    type="dateTime-local"
                    class="form-control"
                    id="endDateTime"
                    v-model="filterDetail.endDate"
                  >
                </div>
              </div>
              <div class="form-group row mb-2 align-items-center">
                <span class="col-form-label mr-2 col-2">狀態</span>
                <div class="col-9">
                  <div class="form-check form-check-inline">
                    <input
                      class="form-check-input"
                      type="radio"
                      v-model="filterDetail.pointState"
                      id="all"
                      value="all"
                    >
                    <label
                      class="form-check-label"
                      for="all"
                    >全部</label>
                  </div>

                  <div class="form-check form-check-inline">
                    <input
                      class="form-check-input"
                      type="radio"
                      v-model="filterDetail.pointState"
                      id="add"
                      value="add"
                    >
                    <label
                      class="form-check-label"
                      for="add"
                    >補點</label>
                  </div>

                  <div class="form-check form-check-inline">
                    <input
                      class="form-check-input"
                      type="radio"
                      v-model="filterDetail.pointState"
                      id="minus"
                      value="minus"
                    >
                    <label
                      class="form-check-label"
                      for="minus"
                    >扣點</label>
                  </div>
                </div>
              </div>
              <div class="form-group row">
                <div class="mr-2 col-2"></div>
                <div class="col-9">
                  <button
                    class="btn btn-primary"
                    @click.stop.prevent="filterPointLogInPeriod"
                  >查詢</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-10">
        <div class="card">
          <h5 class="card-header">主錢包紀錄</h5>
          <div class="card-body p-0">

            <AdminPagination />

            <div class="table-box">
              <table class="table">
                <thead class="thead-dark">
                  <tr>
                    <th scope="col">No.</th>
                    <th scope="col">補扣點時間</th>
                    <th scope="col">事由</th>
                    <th scope="col">點數紀錄</th>
                    <th scope="col">主錢包餘額</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="pointLog in userPointLogInPeriod"
                    :key="pointLog.id"
                  >
                    <th scope="row">{{ pointLog.id }}</th>
                    <td>
                      <div v-if="pointLog.createdAt">
                        <div>
                          {{ formatDate(pointLog.createdAt) }}
                        </div>
                        <div>
                          {{ formatTime(pointLog.createdAt) }}
                        </div>
                      </div>
                    </td>
                    <td>{{ pointLog.cause }}</td>
                    <td>{{ pointLog.edit_point }}</td>
                    <td>{{ pointLog.balance }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { inject, onMounted, reactive } from 'vue'
import { formatDate, formatTime } from '@utils/formatDateTime'
import { formatISO, endOfYesterday, startOfYesterday, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns'

defineProps({
  userPointLogInPeriod: {
    type: Array,
    default: () => []
  }
})
const emit = defineEmits(['filterPointLogInPeriod'])

const filterDetail = reactive({
  startDate: formatISO(new Date()).slice(0, 10) + 'T00:00',
  endDate: formatISO(new Date()).slice(0, 10) + 'T23:59',
  pointState: 'all',
})


const filterPointLogInPeriod = () => {
  emit('filterPointLogInPeriod', { ...filterDetail })
}
onMounted(filterPointLogInPeriod)
const pagination = inject('pagination')
watch(() => [pagination.page, pagination.pageSize], filterPointLogInPeriod)

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