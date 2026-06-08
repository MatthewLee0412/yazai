<script setup>
import { onMounted } from 'vue'
import { useVaccineStore } from '@/stores/vaccine'
import { useForm } from '@/composables/useForm'
import { useToast } from '@/composables/useToast'
import { formatDate, empty } from '@/utils/format'
import VaccineForm from '@/components/forms/VaccineForm.vue'
import DataTable from '@/components/shared/DataTable.vue'
import StatusBadge from '@/components/shared/StatusBadge.vue'

const store = useVaccineStore()
const toast = useToast()
const { form, reset, loadForEdit, getPayload } = useForm({
  templateId: '', vaccineName: '', ageLabel: '', doseLabel: '',
  plannedDate: '', vaccinatedDate: '', status: '未到期', location: '',
  batchNo: '', doctor: '', notes: ''
})

async function refresh() {
  await Promise.all([store.loadRecords(), store.loadTemplates()])
}

async function onSubmit() {
  const { payload, id } = getPayload()
  // Convert templateId to number
  if (payload.templateId) payload.templateId = Number(payload.templateId)

  if (id) {
    await store.update(id, payload)
    toast.show('记录已更新')
  } else {
    await store.create(payload)
    toast.show('记录已创建')
  }
  reset()
  await refresh()
}

async function onRemove(id) {
  if (!confirm('确认删除这条记录吗？')) return
  await store.remove(id)
  toast.show('记录已删除')
  await refresh()
}

function onEdit(item) {
  loadForEdit(item)
  toast.show('已载入编辑')
}

onMounted(() => refresh())
</script>

<template>
  <div class="view-grid">
    <section class="panel">
      <div class="panel-head">
        <h3>接种记录</h3>
        <button class="ghost-btn" @click="reset">新增接种</button>
      </div>
      <VaccineForm :form="form" @save="onSubmit" @reset="reset" />
    </section>

    <section class="panel">
      <div class="panel-head">
        <h3>宝宝接种进度</h3>
      </div>
      <DataTable :headers="['计划日期', '年龄', '疫苗', '针次', '状态', '接种日期', '地点', '备注', '操作']">
        <tr v-for="item in store.sortedRecords" :key="item.id">
          <td>{{ formatDate(item.plannedDate) }}</td>
          <td>{{ item.ageLabel || '' }}</td>
          <td>{{ item.vaccineName || '' }}</td>
          <td>{{ item.doseLabel || '' }}</td>
          <td><StatusBadge :status="item.status" /></td>
          <td>{{ formatDate(item.vaccinatedDate) }}</td>
          <td>{{ item.location || '' }}</td>
          <td>{{ item.notes || '' }}</td>
          <td>
            <div class="row-actions">
              <button class="text-btn" @click="onEdit(item)">编辑</button>
              <button class="danger-btn" @click="onRemove(item.id)">删除</button>
            </div>
          </td>
        </tr>
      </DataTable>
    </section>

    <section class="panel">
      <div class="panel-head">
        <h3>疫苗计划模板</h3>
        <span class="hint">参考图片初始化</span>
      </div>
      <DataTable :headers="['序号', '年龄', '疫苗名称', '针次', '方式', '进口', '免费', '参考费用', '预防', '注意事项']">
        <tr v-for="item in store.templates" :key="item.id">
          <td>{{ item.sequenceNo }}</td>
          <td>{{ item.ageLabel || '' }}</td>
          <td>{{ item.vaccineName || '' }}</td>
          <td>{{ item.doseLabel || '' }}</td>
          <td>{{ item.method || '' }}</td>
          <td>{{ item.importedOption || '' }}</td>
          <td>{{ item.freeOption || '' }}</td>
          <td>{{ item.referenceCost ?? '/' }}</td>
          <td>{{ item.prevents || '' }}</td>
          <td>{{ item.notes || '' }}</td>
        </tr>
      </DataTable>
    </section>
  </div>
</template>
