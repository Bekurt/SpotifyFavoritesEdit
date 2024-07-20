import { useAuthStore } from '@/stores/auth'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/:pathMatcher(.*)',
            redirect: { name: 'home' },
        },
        {
            path: '/',
            name: 'home',
            component: () => import('@/views/HomeView.vue'),
            beforeEnter: requireAuth,
        },
        {
            path: '/login',
            name: 'login',
            component: () => import('@/views/LoginView.vue'),
            beforeEnter: () => useAuthStore().$reset(),
        },
    ],
})

export default router

function requireAuth() {
    return useAuthStore().isAuthenticated ?? { name: 'login' }
}
