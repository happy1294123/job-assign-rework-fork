<template>
  <div class="pt-3 text-dark">
    <div class="row row-cols-2 mb-2">
      <div class="col-6">
        <div class="card">
          <h5 class="card-header">新增銀行資料</h5>
          <div class="card-body">
            <form @submit.stop.prevent="addBank">
              <div class="form-group row mb-2">
                <label for="bankName" class="col-sm-3 col-form-label">銀行名稱</label>
                <div class="col-9">
                  <select class="form-control" name="bankName" id="bankName" v-model="bankDetail.bank_name">
                    <option v-for="bank in taiwanBankList" :key="bank.code" :value="`${bank.name}(${bank.code})`">{{bank.name}}({{ bank.code }})</option>
                  </select>
                </div>
              </div>

              <div class="form-group row mb-2">
                <label for="bankBranchName" class="col-sm-3 col-form-label">分行名稱</label>
                <div class="col-sm-9">
                  <input type="text" class="form-control" id="bankBranchName" v-model="bankDetail.branch_name">
                </div>
              </div>

              <div class="form-group row mb-2">
                <label for="bankAccountName" class="col-sm-3 col-form-label">銀行戶名</label>
                <div class="col-sm-9">
                  <input type="text" class="form-control" id="bankAccountName" v-model="bankDetail.account_name">
                </div>
              </div>

              <div class="form-group row mb-2">
                <label for="bankAccount" class="col-sm-3 col-form-label">銀行帳號</label>
                <div class="col-sm-9">
                  <input type="number" class="form-control" id="bankAccount" v-model="bankDetail.account">
                </div>
              </div>
              <div class="form-group row">
                <div class="col-sm-3"></div>
                <div class="col-sm-9">
                  <button type="submit" class="btn btn-primary">提交</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
      <div class="col-6">
        <div class="card">
          <h5 class="card-header">銀行列表</h5>
          <div class="card-body p-0">
            <table class="table table-borderless">
              <tbody class="h-[300px]">
                <tr v-for="bank in bankList" :key="bank.id">
                  <th>{{ bank.bank_name }}</th>
                  <td>{{ bank.account}}</td>
                  <td>{{ bank.account_name}}</td>
                  <td>
                    <button class="btn btn-warning" @click.stop.prevent="removeBank(bank.id)">刪除</button>
                  </td>
                </tr>
                <div v-if="bankList.length === 0" class="text-gray-400 text-sm flex justify-center my-[100px]">
                  沒有銀行列表
                </div>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
    <div class="row row-cols-2">
      <div class="col-6 mb-10">
        <div class="card">
          <h5 class="card-header">虛擬錢包位址(TRC通道) USDT</h5>
          <div class="card-body">
            <form @submit.stop.prevent="addCryptoAddress">
              <div class="form-group">
                <label for="cryptoAddress" class="sr-only">虛擬錢包位址</label>
                <input type="text" class="form-control mb-2" id="cryptoAddress" v-model="cryptoAddress">
                <button type="submit" class="btn btn-primary">提交</button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <div class="col-6  mb-10">
        <div class="card">
          <h5 class="card-header">錢包列表</h5>
          <div class="card-body p-0">
            <table class="table table-borderless">
              <tbody>
                <tr v-for="address in cryptoAddressList" :key="address.id">
                  <th>{{ address.address }}</th>
                  <td>
                    <button class="btn btn-warning" @click.stop.prevent="removeCryptoAddress(address.id)">刪除</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import taiwanBankList from '@/assets/json/taiwanBankList.json'
import { useToast } from 'vue-toast-notification'
const $toast = useToast()

defineProps({
  bankList: {
    type: Array,
    default: () => [],
  },
  cryptoAddressList: {
    type: Array,
    default: () => [],
  }
})

const bankDetail = reactive({
  bank_name: '中央銀行國庫局(000)',
  branch_name: '',
  account: '',
  account_name: '',
})
const cryptoAddress = ref('')
const emit = defineEmits(['addBank', 'addCryptoAddress', 'removeBank', 'removeCryptoAddress'])
const addBank = () => {
  const { branch_name, account, account_name} = bankDetail
  if (!branch_name || !account || !account_name) {
    $toast.error('欄位不得為空', {
      class: 'toast-default'
    })
    return
  }
  emit('addBank', {...bankDetail})
  return
}

const addCryptoAddress = () => {
  if (!confirm('確定要新增虛擬錢包位址？')) return
  cryptoAddress.value = cryptoAddress.value.trim()
  if (!cryptoAddress.value) {
    console.log('虛擬錢包位址欄位不得為空')
    return
  }
  emit('addCryptoAddress', cryptoAddress.value)
}

const removeBank = (bankId) => {
  emit('removeBank', bankId)
}

const removeCryptoAddress = (addressId) => {
  emit('removeCryptoAddress', addressId)
}
</script>