import { ref } from 'vue'

export function useCollection(store, toastFn) {
  const loading = ref(false)

  async function refresh() {
    loading.value = true
    try {
      await store.load()
    } finally {
      loading.value = false
    }
  }

  async function save(getPayloadFn) {
    const { payload, id } = getPayloadFn()
    if (id) {
      await store.update(id, payload)
      toastFn('记录已更新')
    } else {
      await store.create(payload)
      toastFn('记录已创建')
    }
    await refresh()
  }

  async function remove(id) {
    if (!confirm('确认删除这条记录吗？')) return
    await store.remove(id)
    toastFn('记录已删除')
    await refresh()
  }

  return { loading, refresh, save, remove }
}
