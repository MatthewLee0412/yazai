import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  { path: '/', name: 'dashboard', component: () => import('@/views/DashboardView.vue'), meta: { title: '总览' } },
  { path: '/profile', name: 'profile', component: () => import('@/views/ProfileView.vue'), meta: { title: '宝宝档案' } },
  { path: '/growth', name: 'growth', component: () => import('@/views/GrowthView.vue'), meta: { title: '成长记录' } },
  { path: '/vaccine', name: 'vaccine', component: () => import('@/views/VaccineView.vue'), meta: { title: '疫苗管理' } },
  { path: '/medical', name: 'medical', component: () => import('@/views/MedicalView.vue'), meta: { title: '就医记录' } },
  { path: '/insurance', name: 'insurance', component: () => import('@/views/InsuranceView.vue'), meta: { title: '保险管理' } }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.afterEach((to) => {
  document.title = `${to.meta.title || '宝宝健康档案'} - 宝宝健康档案`
})

export default router
