<script setup>
import { onMounted } from 'vue'
import { useMedicalStore } from '@/stores/medical'
import { useForm } from '@/composables/useForm'
import { useCollection } from '@/composables/useCollection'
import { useToast } from '@/composables/useToast'
import { formatDate, empty } from '@/utils/format'
import MedicalForm from '@/components/forms/MedicalForm.vue'
import DataTable from '@/components/shared/DataTable.vue'

const store = useMedicalStore()
const toast = useToast()
const { form, reset, loadForEdit, getPayload } = useForm({
  visitDate: '', hospital: '', department: '', doctor: '',
  symptoms: '', diagnosis: '', medication: '', cost: '',
  followUpDate: '', notes: ''
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
        <h3>就医记录</h3>
        <button class="ghost-btn" @click="reset">新增记录</button>
      </div>
      <MedicalForm :form="form" @save="onSubmit" @reset="reset" />
    </section>

    <section class="panel">
      <div class="panel-head">
        <h3>记录列表</h3>
      </div>
      <DataTable :headers="['日期', '医院', '科室', '症状', '诊断', '用药', '费用', '复诊', '操作']">
        <tr v-for="item in store.sortedByDate" :key="item.id">
          <td>{{ formatDate(item.visitDate) }}</td>
          <td>{{ item.hospital || '' }}</td>
          <td>{{ item.department || '' }}</td>
          <td>{{ item.symptoms || '' }}</td>
          <td>{{ item.diagnosis || '' }}</td>
          <td>{{ item.medication || '' }}</td>
          <td>{{ empty(item.cost) }}</td>
          <td>{{ formatDate(item.followUpDate) }}</td>
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
