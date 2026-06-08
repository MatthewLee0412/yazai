import { ref } from 'vue'

const visible = ref(false)
const message = ref('')
let timer = null

export function useToast() {
  function show(msg) {
    message.value = msg
    visible.value = true
    clearTimeout(timer)
    timer = setTimeout(() => { visible.value = false }, 2200)
  }

  return { visible, message, show }
}
