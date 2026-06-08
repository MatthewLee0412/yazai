<script setup>
import { onMounted } from 'vue'
import { useInsuranceStore } from '@/stores/insurance'
import { useForm } from '@/composables/useForm'
import { useCollection } from '@/composables/useCollection'
import { useToast } from '@/composables/useToast'
import { formatDate, empty } from '@/utils/format'
import InsuranceForm from '@/components/forms/InsuranceForm.vue'
import DataTable from '@/components/shared/DataTable.vue'

const store = useInsuranceStore()
const toast = useToast()
const { form, reset, loadForEdit, getPayload } = useForm({
  company: '', policyName: '', policyNo: '', premium: '',
  effectiveDate: '', expiryDate: '', coverage: '', claimRecords: '', notes: ''
})
const { loading, refresh, save, remove } = useCollection(store, toast.show)

onMounted(() => refresh())

async function onSubmit() {
  await save(getPayload)
  reset()
}

function onEdit(item) {
  loadForEdit(item)
  toast.show('已载入编辑')
}
</script>

<template>
  <div class="view-grid">
    <section class="panel">
      <div class="panel-head">
        <h3>保险信息</h3>
        <button class="ghost-btn" @click="reset">新增保单</button>
      </div>
      <InsuranceForm :form="form" @save="onSubmit" @reset="reset" />
    </section>

    <section class="panel">
      <div class="panel-head">
        <h3>保单列表</h3>
      </div>
      <DataTable :headers="['公司', '保险名称', '保单号', '生效', '到期', '保费', '保障范围', '操作']">
        <tr v-for="item in store.sortedByExpiry" :key="item.id">
          <td>{{ item.company || '' }}</td>
          <td>{{ item.policyName || '' }}</td>
          <td>{{ item.policyNo || '' }}</td>
          <td>{{ formatDate(item.effectiveDate) }}</td>
          <td>{{ formatDate(item.expiryDate) }}</td>
          <td>{{ empty(item.premium) }}</td>
          <td>{{ item.coverage || '' }}</td>
          <td>
            <div class="row-actions">
              <button class="text-btn" @click="onEdit(item)">编辑</button>
              <button class="danger-btn" @click="remove(item.id)">删除</button>
            </div>
          </td>
        </tr>
      </DataTable>
    </section>
  </div>
</template>
