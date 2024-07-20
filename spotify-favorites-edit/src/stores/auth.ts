import { defineStore } from 'pinia'
import axios, { type AxiosResponse } from 'axios'
import router from '@/router'
import { computed, ref } from 'vue'
import { generateCodeChallenge } from '@/main'

export const useAuthStore = defineStore('authentication', () => {
    const isAuthenticated = computed(() => false)

    function $reset() {}

    return { isAuthenticated, $reset }
})
