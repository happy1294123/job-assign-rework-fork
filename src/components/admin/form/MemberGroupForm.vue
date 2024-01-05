<template>
  <div>
    <form @submit.stop.prevent="confirmForm">
      <div
        v-if="formDetail.id"
        class="form-group"
      >
        <label for="groupName">群組編號: </label>
        <span>{{ formDetail.id }}</span>
      </div>
      <div class="form-group">
        <label for="groupName">群組名稱: </label>
        <input
          v-model="formDetail.name"
          type="text"
          class="form-control"
          id="groupName"
        >
      </div>
      <div class="form-group">
        <label for="groupPointBaseLine">門檻點數設定: </label>
        <input
          v-model="formDetail.point_baseline"
          type="number"
          class="form-control"
          id="groupPointBaseLine"
        >
      </div>
      <div class="form-group">
        <label
          class="form-check-label mr-2"
          for="groupIsDefault"
        >預設群組</label>
        <input
          v-model="formDetail.isDefault"
          type="checkbox"
          id="groupIsDefault"
        >
      </div>
      <button
        type="submit"
        class="btn btn-primary"
      >Submit</button>
      <span class="text-red-400 text-sm mt-auto ml-2">
        {{ error }}
      </span>
    </form>
  </div>
</template>

<script setup>
import { reactive, watch } from 'vue'

const props = defineProps({
  chosenGroupDetail: {
    type: Object,
    default: () => ({
      id: 0,
      name: '',
      isDefault: false,
      point_baseline: 0,
    })
  },
  memberGroups: {
    type: Array,
    default: () => []
  }
})

onMounted(() => {
  Object.assign(formDetail, { ...props.chosenGroupDetail })
})

const formDetail = reactive({
  id: 0,
  name: '',
  isDefault: false,
  point_baseline: 0,
})

watch(() => formDetail.name, () => {
  error.value = ''
})



const emit = defineEmits(['confirmForm'])
const error = ref('')
const confirmForm = () => {
  const { id, name, isDefault, point_baseline } = formDetail
  if (!name) {
    error.value = '群組名稱不能為空'
    console.log('群組名稱不能為空')
    return
  }

  const sameNameGroup = props.memberGroups.find(group => group.name === name)
  if (sameNameGroup?.name === name && sameNameGroup?.id !== id) {
    error.value = '群組名稱已重複'
    console.log('群組名稱已重複')
    return
  }
  emit('confirmForm', {
    name,
    isDefault,
    point_baseline
  })
}
</script>