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
                },
            ],
        },
    ],
})

export default router

function requireAuth() {
    return useAuthStore().isAuthenticated ? true : { name: 'login' }
}
