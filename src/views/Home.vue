<template>
  <UserLayout>
    <div class="flex flex-col-reverse md:-mt-3">
      <div class="my-4 md:hidden">
        <UserSearchInput />
      </div>
      <UserMarquee />
    </div>
    <div class="grid grid-cols-2 md:grid-cols-4 gap-8 md:mt-[64px]">
      <template v-for="item in productList">
        <UserProduct v-if="item.id" :product="item" :key="item.id" />  
        <div v-else :key="item" class="w-max-[300px] h-max-[300px] aspect-square rounded-lg"></div>
      </template>

    </div>
    <div
      v-if="productList === null || productList.length === 0"
      class="text-gray-400 text-center"
    >沒有商品</div>
  </UserLayout>
</template>

<script setup>
import { fetchWithoutToken } from '@utils/fetchFn.js'
import { watch } from 'vue'

const route = useRoute()
const optionUrl = computed(() => route.query.search && `&filters[$and][1][name][$contains]=${route.query.search}`)

watch(() => route.query, () => getProducts(optionUrl.value))
const productList = ref(null)
const getProducts = async (optionUrl) => {
  const url = '/api/products?fields[0]=name&fields[1]=url&fields[2]=status&fields[3]=order&populate[image][fields]=url&filters[$and][0][isDisplay]=true' + optionUrl || ''
  const { data } = await fetchWithoutToken(url)
  productList.value = makeProductList(data, optionUrl)
}
getProducts()

const makeProductList = (data, optionUrl) => {
  // query mode just return
  if (optionUrl) {
    return data
  }
  // get empty array
  const maxInDataOrder = Math.max(...data.map(d => d.attributes.order)) 
  const maxLength = Math.max(data.length, maxInDataOrder)
  const productList = Array.from({ length: maxLength }, (_, i) => `fake${i}`)
  
  // set data that have order
  const orderList = data.filter(item => item.attributes.order > 0)
  orderList.forEach(item => {
    const order = item.attributes.order
    productList[order - 1] = item
  })

  // get unOrder list
  const unOrderList = data.filter(item => item.attributes.order === null)

  // set unOrder list to productList
  for (let index = 0; index < maxLength; index++) {
    if (typeof productList[index] === 'string' && unOrderList.length > 0) {
      productList[index] = unOrderList.shift()
    }
  }

  return productList
}

</script>