import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import axios from 'axios'
import { getAccessToken, refreshAccessToken } from '@/api_interface/authorizations_api'
import router from '@/router'

export const useAuthStore = defineStore('authentication', () => {
    const accessToken = ref<Token>()
    const isAuthenticated = computed(() => !!accessToken?.value?.access_token)
    let refreshPromise: Promise<void> | null = null

    /**
     * Custom implementation of pinia $reset method (mandatory)
     */
    function $reset(): void {
        accessToken.value = undefined
        refreshPromise = null
    }

    /**
     * Retrieves the access token and sets axios headers accordingly
     * @param code same as getAccessToken
     * @param codeVerifier same as getAccessToken
     */
    function getToken(code: string, codeVerifier: string): void {
        getAccessToken(code, codeVerifier)
            .then((res) => {
                accessToken.value = res
                axios.defaults.headers.common = {
                    Authorization: `${res.token_type} ${res.access_token}`,
                }
            })
            .catch((err) => console.error(err))
    }

    /**
     * Gets a new access token
     * @returns An empty promise to signal every failed request that the refresh was successful
     */
    function refreshToken(): Promise<void> | null {
        if (!refreshPromise && accessToken.value?.refresh_token) {
            refreshPromise = new Promise((resolve) => {
                refreshAccessToken(accessToken.value?.refresh_token as string)
                    .then((res) => {
                        accessToken.value = res
                        axios.defaults.headers.common = {
                            Authorization: `${res.token_type} ${res.access_token}`,
                        }
                        resolve()
                    })
                    .catch(() => {
                        $reset()
                        router.push({ name: 'login' })
                    })
            })
        }
        return refreshPromise
    }

    return { accessToken, isAuthenticated, refreshPromise, $reset, getToken, refreshToken }
})

export interface Token {
    access_token: string //	An access token that can be provided in subsequent calls, for example to Spotify Web API services.
    token_type: string //	How the access token may be used: always "Bearer".
    scope: string // A space-separated list of scopes which have been granted for this access_token
    expires_in: number //	The time period (in seconds) for which the access token is valid.
    refresh_token: string //	See refreshing tokens.
}
