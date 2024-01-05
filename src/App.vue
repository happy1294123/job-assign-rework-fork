<template>
  <router-view />
  <Modal ref="modalRef" />
</template>

<script setup>
import { provide, reactive, ref } from 'vue'
import Modal from './components/Modal.vue'

const modalRef = ref(null)
provide('connectCustomService', (text) => {
  modalRef.value.open(text)
})


const initPagination = {
  page: 1,
  pageSize: 10,
  pageCount: 1,
  total: 0
}
const pagination = reactive(Object.assign({}, initPagination))
watch(() => pagination.pageSize, () => {
  pagination.pageCount = Math.ceil(pagination.total / pagination.pageSize)
  pagination.page = 1
})

provide('pagination', pagination)
provide('paginationEmitPage', (newPage) => pagination.page = newPage)
provide('paginationEmitPageSize', (newPageSize) => pagination.pageSize = newPageSize)

</script>


<style>
body {
  height: 100vh;
}

#app {
  height: 100%;
}
</style>
