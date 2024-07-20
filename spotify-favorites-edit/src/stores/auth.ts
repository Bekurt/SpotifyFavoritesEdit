import { defineStore } from 'pinia'
import axios, { type AxiosResponse } from 'axios'
import router from '@/router'
import { computed, ref } from 'vue'

export const useAuthStore = defineStore('authentication', () => {
    const isAuthenticated = computed(() => true)

    function $reset() {}

    return { isAuthenticated, $reset }
})
