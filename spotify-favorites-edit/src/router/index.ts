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
            children: [
                {
                    path: 'home',
                    name: 'home',
                    component: () => import('@/views/HomeView.vue'),
                    beforeEnter: () => useAuthStore().$reset(),
                },
                {
                    path: 'login',
                    name: 'login',
                    component: () => import('@/views/LoginView.vue'),
                    beforeEnter: () => useAuthStore().$reset(),
                },
                {
                    path: 'control-panel',
                    name: 'control-panel',
                    component: () => import('@/views/ControlPanelView.vue'),
                    beforeEnter: requireAuth,
                },
            ],
        },
    ],
})

export default router

function requireAuth() {
    return useAuthStore().isAuthenticated ? true : { name: 'login' }
}
