<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import AppSidebar from './AppSidebar.vue'
import AppTopbar from './AppTopbar.vue'

const route = useRoute()
const pageTitle = computed(() => route.meta.title || '总览')
</script>

<template>
  <div class="app-shell">
    <AppSidebar />
    <main class="main-panel">
      <AppTopbar :title="pageTitle" />
      <router-view />
    </main>
  </div>
</template>
