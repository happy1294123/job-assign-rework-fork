<template>
  <Modal ref="createProductModal">
    <template v-slot:modalTitle>
      新增商品
    </template>
    <template v-slot:modalBody>
      <CreateProductForm
        @confirmForm="createProduct"
        :isSubmitBtnLoading="isSubmitBtnLoading"
      >
      </CreateProductForm>
    </template>
  </Modal>
  <Modal ref="editProductModal">
    <template v-slot:modalTitle>
      修改商品
    </template>
    <template v-slot:modalBody>
      <CreateProductForm
        :product-info="chosenProduct"
        :isSubmitBtnLoading="isSubmitBtnLoading"
        @confirmForm="editProduct"
      >
      </CreateProductForm>
    </template>
  </Modal>
  <Layout>
    <template v-slot:content>
      <div class="main">
        <div class="search">
          <button
            type="button"
            class="btn btn-primary float-left mr-1"
            @click.prevent="createProductModal.modalOpen()"
          >
            <i class="iconfont">&#xe665;</i>新增
          </button>
        </div>
        <div class="table-box">
          <table class="table">
            <thead>
              <tr>
                <th scope="col">編號</th>
                <th scope="col">商品名稱</th>
                <th scope="col">創建日期</th>
                <th scope="col">發布狀態</th>
                <th scope="col">訂單狀態</th>
                <th scope="col">功能</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="product in products"
                :key="product.id"
              >
                <th scope="row">
                  {{ product.id }}
                </th>
                <td>
                  {{ product.name }}
                </td>
                <td>
                  <div v-if="product.createdAt">
                    <div>
                      {{ formatDate(product.createdAt) }}
                    </div>
                    <div>
                      {{ formatTime(product.createdAt) }}
                    </div>
                  </div>
                </td>
                <td>
                  <span
                    class="badge-success badge-pill rounded-lg"
                    v-if="product.isDisplay"
                  >顯示</span>
                  <span
                    class="badge-danger badge-pill rounded-lg"
                    v-else
                  >隱藏</span>
                </td>
                <td>
                  {{ product.status === 'fill' ? '額滿' : product.status === 'fillable' ? '未額滿' : product.status ===
                    'custom' ? '自訂連結' : undefined
                  }}
                </td>
                <td>
                  <button
                    class="btn btn-primary mr-1"
                    @click="chooseProduct(product)"
                  >修改</button>
                  <button
                    class="btn btn-danger"
                    @click="removeProduct(product.id, product.image.data.id)"
                  >刪除</button>
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
import CreateProductForm from '../../components/admin/form/CreateProductForm.vue'
import fetchWithToken, { fetchUploadFileWithToken } from '@utils/fetchFn.js'
import { formatDate, formatTime } from '@utils/formatDateTime'
import { useToast } from 'vue-toast-notification'
const $toast = useToast()

const products = ref([])
const createProductModal = ref(null)
const editProductModal = ref(null)
const chosenProduct = reactive({
  id: 0,
  name: '',
  isDisplay: false,
  status: 'fill',
  url: '',
  image: ''
})

const fetchProducts = async () => {
  const { data } = await fetchWithToken('/api/products?populate[image][fields]=url&sort[createdAt]=desc')
  products.value = data.map((item) => ({
    id: item.id,
    ...item.attributes,
  }))
}

const chooseProduct = (product) => {
  const { id, name, isDisplay, url, image, status, order } = product
  // console.log(product)
  Object.assign(chosenProduct, {
    id,
    name,
    status,
    isDisplay,
    url,
    image: image.data.attributes.url,
    order
  })
  editProductModal.value.modalOpen()
}

const isSubmitBtnLoading = ref(false)
const createProduct = async (formDetail) => {
  if (formDetail.files.length === 0) {
    console.log('請上傳圖片')
    $toast.error('請上傳圖片')
    return
  }
  isSubmitBtnLoading.value = true
  $toast.info('商品上傳中...', {
    class: 'toast-default'
  })
  const formData = new FormData()
  formData.append('files', formDetail.files[0])

  const file = await fetchUploadFileWithToken('/api/upload', formData)

  console.log(formDetail)
  console.log(file)


  if (!file) {
    console.log('image upload error')
    return
  }

  delete formDetail['files']

  const postBody = {
    data: {
      ...formDetail,
      image: file[0].id,
    },
  }

  const { data } = await fetchWithToken('/api/products', 'POST', postBody)
  if (!data) {
    console.log('create product error')
    isSubmitBtnLoading.value = false
    return
  }

  products.value.push({
    id: data.id,
    ...data.attributes,
  })

  createProductModal.value.modalClose()
  $toast.success('新增商品成功', {
    class: 'toast-default'
  })
  isSubmitBtnLoading.value = false
  await fetchProducts()
}

const editProduct = async (formDetail) => {
  isSubmitBtnLoading.value = true
  $toast.info('商品修改中...', {
    class: 'toast-default'
  })
  const formData = new FormData()
  formData.append('files', formDetail.files[0])

  const file = await fetchUploadFileWithToken('/api/upload', formData)

  if (!file) {
    console.log('image upload error')
    return
  }

  delete formDetail['files']

  const putBody = {
    data: {
      ...formDetail,
      image: file[0]?.id || chooseProduct.image
    },
  }
  const { data } = await fetchWithToken(`/api/products/${chosenProduct.id}`, 'PUT', putBody)
  if (!data) {
    console.log('edit product error')
    return
  }

  products.value = products.value.map((product) => {
    if (product.id === data.id) {
      return {
        id: data.id,
        ...data.attributes,
      }
    }
    return product
  })

  editProductModal.value.modalClose()
  $toast.success('修改商品成功', {
    class: 'toast-default'
  })
  isSubmitBtnLoading.value = false
  await fetchProducts()
}

const removeProduct = async (productId, imageId) => {
  if (!confirm('確定要刪除此商品?')) return
  const { data } = await fetchWithToken(`/api/products/${productId}`, 'DELETE')
  if (!data) {
    console.log('delete product error')
    return
  }
  products.value = products.value.filter((product) => product.id !== productId)
  await fetchWithToken(`/api/upload/files/${imageId}`, 'DELETE')
}

fetchProducts()
</script>