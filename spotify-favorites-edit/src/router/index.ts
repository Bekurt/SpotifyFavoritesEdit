import { useTokenStore } from '@/stores/token'
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
                    beforeEnter: () => useTokenStore().$reset(),
                },
                {
                    path: 'login',
                    name: 'login',
                    component: () => import('@/views/LoginView.vue'),
                    beforeEnter: () => useTokenStore().$reset(),
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

const { isAuthenticated } = useTokenStore()

function requireAuth() {
    return isAuthenticated ? true : { name: 'login' }
}
