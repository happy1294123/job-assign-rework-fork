<template>
  <Modal ref="createAnnouncementModal">
    <template v-slot:modalTitle>
      新增公告
    </template>
    <template v-slot:modalBody>
      <AnnouncementForm @confirmForm="createAnnouncement">
      </AnnouncementForm>
    </template>
  </Modal>
  <Modal ref="editAnnouncementModal">
    <template v-slot:modalTitle>
      修改公告
    </template>
    <template v-slot:modalBody>
      <AnnouncementForm :announcement-info="chosenAnnouncement" @confirmForm="editAnnouncement">
      </AnnouncementForm>
    </template>
  </Modal>
  <Layout>
    <template v-slot:content>
      <div class="main">
        <div class="search">
          <button type="button" class="btn btn-primary float-left mr-1"
            @click.prevent="createAnnouncementModal.modalOpen()">
            <i class="iconfont">&#xe665;</i>新增
          </button>
        </div>
        <div class="table-box">
          <table class="table">
            <thead>
              <tr>
                <th class="text-nowrap" scope="col">編號</th>
                <th class="text-nowrap" scope="col">公告標題</th>
                <th class="text-nowrap" scope="col">公告內文</th>
                <th class="text-nowrap" scope="col">公告狀態</th>
                <th class="text-nowrap" scope="col">跑馬燈顯示</th>
                <th class="text-nowrap" scope="col">功能</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="announcement in announcements" :key="announcement.id">
                <th scope="row">
                  {{ announcement.id }}
                </th>
                <td>
                  {{ announcement.title }}
                </td>
                <td>
                  {{ contentSubString(announcement.content) }}
                </td>
                <td>
                  <span class="badge-success badge-pill rounded-lg" v-if="announcement.isActive">啟用</span>
                  <span class="badge-danger badge-pill rounded-lg" v-else>停用</span>
                </td>
                <td>
                  <span class="badge-success badge-pill rounded-lg" v-if="announcement.isMarquee">啟用</span>
                  <span class="badge-danger badge-pill rounded-lg" v-else>停用</span>
                </td>
                <td class="flex gap-2">
                  <button class="text-nowrap btn btn-primary" @click="chooseAnnouncement(announcement)">修改</button>
                  <button class="text-nowrap btn btn-danger" @click="removeAnnouncement(announcement)">刪除</button>
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
import { ref } from 'vue'
import Layout from '../../components/admin/Layout.vue'
import Modal from '../../components/admin/Modal.vue'
import AnnouncementForm from '../../components/admin/form/AnnouncementForm.vue'
import fetchWithToken from '@utils/fetchFn.js'

const announcements = ref([])
const createAnnouncementModal = ref(null)
const editAnnouncementModal = ref(null)
const chosenAnnouncement = reactive({
  id: 0,
  title: '',
  content: '',
  isActive: false,
  isMarquee: false,
})

const fetchannouncements = async () => {
  const { data } = await fetchWithToken('/api/announcements?sort[createdAt]=desc')
  announcements.value = data.map((item) => ({
    id: item.id,
    ...item.attributes,
  }))
}


const createAnnouncement = async (formDetail) => {
  const postBody = {
    data: formDetail
  }
  const { data } = await fetchWithToken('/api/announcements', 'POST', postBody)
  if (!data) {
    console.log('create announcement error')
    return
  }
  console.log(data)
  announcements.value.push({
    id: data.id,
    ...data.attributes,
  })
  createAnnouncementModal.value.modalClose()
}
const chooseAnnouncement = (announcement) => {
  const { id, title, content, isActive, isMarquee } = announcement
  Object.assign(chosenAnnouncement, {
    id,
    title,
    content,
    isActive,
    isMarquee,
  })
  editAnnouncementModal.value.modalOpen()
}

const editAnnouncement = async (formDetail) => {
  const putBody = {
    data: formDetail
  }
  const { data } = await fetchWithToken(`/api/announcements/${chosenAnnouncement.id}`, 'PUT', putBody)
  if (!data) {
    console.log('edit announcement error')
    return
  }
  announcements.value = announcements.value.map((announcement) => {
    if (announcement.id === data.id) {
      return {
        id: data.id,
        ...data.attributes,
      }
    }
    return announcement
  })
  editAnnouncementModal.value.modalClose()
}

const removeAnnouncement = async (announcement) => {
  const { data } = await fetchWithToken(`/api/announcements/${announcement.id}`, 'DELETE')
  if (!data) {
    console.log('delete announcement error')
    return
  }

  announcements.value = announcements.value.filter((item) => item.id !== data.id)
}

const contentSubString = (content) => {
  if (content.length < 40) return content
  return content.substring(0, 40) + '...'
}

fetchannouncements()
</script>