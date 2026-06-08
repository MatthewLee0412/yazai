<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { NAV_ITEMS } from '@/utils/constants'

const route = useRoute()
const router = useRouter()

const activeName = computed(() => route.name)

function navigate(item) {
  router.push(item.path)
}
</script>

<template>
  <aside class="sidebar">
    <div class="brand">
      <div class="brand-mark">BB</div>
      <div>
        <h1>宝宝健康档案</h1>
        <p>新生儿信息管理</p>
      </div>
    </div>
    <nav class="nav-list" aria-label="主导航">
      <button
        v-for="item in NAV_ITEMS"
        :key="item.name"
        class="nav-item"
        :class="{ 'is-active': activeName === item.name }"
        @click="navigate(item)"
      >
        {{ item.label }}
      </button>
    </nav>
  </aside>
</template>
