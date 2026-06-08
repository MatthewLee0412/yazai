<script setup>
import { onMounted } from 'vue'
import { useGrowthStore } from '@/stores/growth'
import { useForm } from '@/composables/useForm'
import { useCollection } from '@/composables/useCollection'
import { useToast } from '@/composables/useToast'
import { formatDate, empty } from '@/utils/format'
import GrowthForm from '@/components/forms/GrowthForm.vue'
import DataTable from '@/components/shared/DataTable.vue'

const store = useGrowthStore()
const toast = useToast()
const { form, reset, loadForEdit, getPayload } = useForm({
  measuredAt: '', heightCm: '', weightKg: '', headCircumferenceCm: '', notes: ''
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
        <h3>成长记录</h3>
        <button class="ghost-btn" @click="reset">新增记录</button>
      </div>
      <GrowthForm :form="form" @save="onSubmit" @reset="reset" />
    </section>

    <section class="panel">
      <div class="panel-head">
        <h3>记录列表</h3>
      </div>
      <DataTable :headers="['日期', '身高(cm)', '体重(kg)', '头围(cm)', '备注', '操作']">
        <tr v-for="item in store.sortedByDate" :key="item.id">
          <td>{{ formatDate(item.measuredAt) }}</td>
          <td>{{ empty(item.heightCm) }}</td>
          <td>{{ empty(item.weightKg) }}</td>
          <td>{{ empty(item.headCircumferenceCm) }}</td>
          <td>{{ item.notes || '' }}</td>
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
