import { reactive, ref } from 'vue'

export function useForm(initialValues = {}) {
  const form = reactive({ ...initialValues })
  const editingId = ref(null)

  function reset() {
    Object.keys(form).forEach(key => { form[key] = initialValues[key] ?? '' })
    editingId.value = null
  }

  function loadForEdit(item) {
    Object.keys(form).forEach(key => { form[key] = item[key] ?? '' })
    editingId.value = item.id
  }

  function getPayload() {
    const payload = { ...form }
    Object.keys(payload).forEach(key => {
      if (payload[key] === '') payload[key] = null
      if (typeof initialValues[key] === 'number' && payload[key] !== null) {
        payload[key] = Number(payload[key])
      }
    })
    return { payload, id: editingId.value }
  }

  return { form, editingId, reset, loadForEdit, getPayload }
}
