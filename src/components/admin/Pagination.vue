<template>
  <div class="flex justify-between">
    <div class="flex text-dark p-2">
      共
      <span class="mx-1">
        {{ pagination.total }}
      </span>
      筆資料，總頁數
      <span class="mx-1">
        {{ pagination.pageCount }}
      </span>
      頁
    </div>
    <div class="flex text-dark p-2">
      每頁筆數:
      <div>
        <select
          v-model="childPageSize"
          name="itemsCount"
          class="mx-1"
        >
          <option value="1"> 1 </option>
          <option value="10"> 10 </option>
          <option value="20"> 20 </option>
          <option value="50"> 50 </option>
        </select>
      </div>
      目前第:
      <div>
        <select
          name="chosenPage"
          class="mx-1"
          v-model="childPage"
        >
          <option
            v-for="number in pageNumber"
            :key="number"
            :value="number"
          >
            {{ number }}
          </option>
        </select>
      </div>
      頁
    </div>
  </div>
</template>

<script setup>
const pagination = inject('pagination')
const paginationEmitPage = inject('paginationEmitPage')
const paginationEmitPageSize = inject('paginationEmitPageSize')

const pageNumber = computed(() => Array.from({ length: pagination.pageCount }, (_, i) => i + 1))

const childPage = ref(pagination.page)
watch(childPage, (value) => {
  paginationEmitPage(value)
})

const childPageSize = ref(pagination.pageSize)
watch(childPageSize, (value => {
  paginationEmitPageSize(value)
}))
</script>