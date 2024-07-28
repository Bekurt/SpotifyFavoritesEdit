import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import axios from 'axios'
import router from '@/router'
import { addQueryParams, apiRequest, type Method } from '@/api_interface/axios_interface'

const emptyToken: Token = {
    access_token: '',
    token_type: '',
    scope: '',
    expires_in: 0,
    refresh_token: '',
}

// Spotify-specific access privileges
const scopes = [
    'user-read-playback-position',
    'user-top-read',
    'user-read-recently-played',
    'playlist-read-private',
    'playlist-read-collaborative',
    'playlist-modify-private',
    'playlist-modify-public',
]

const CHALLENGE_LENGTH = 64

export const useTokenStore = defineStore('token', () => {
    const accessToken = ref<Token>(emptyToken)
    const isAuthenticated = computed(() => !!accessToken.value.access_token)
    let refreshPromise: Promise<void> | null = null

    /**
     * Custom implementation of pinia $reset method (mandatory)
     */
    function $reset(): void {
        accessToken.value = emptyToken
        refreshPromise = null
    }

    /**
     * Step 2 of spotify authentication flow. Request an access token
     *
     * @param code found in url query after a successful redirect from user permissions
     * @param codeVerifier code generated in the first step, should be retrieved from session storage
     * @returns Promise of type Token
     */
    function getAccessToken(code: string, codeVerifier: string): void {
        const payload = {
            grant_type: 'authorization_code',
            code: code,
            redirect_uri: import.meta.env.VITE_SPOTIFY_REDIRECT_URI,
            scope: scopes.reduce((acc, scopeItem) => `${acc} ${scopeItem}`, ''),
            client_id: import.meta.env.VITE_SPOTIFY_ID,
            code_verifier: codeVerifier,
        }
        const config = {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        }

        apiRequest<Token>('post', '/api/token', payload, config).then((res) => {
            accessToken.value = res
            axios.defaults.headers.common = {
                Authorization: `${res.token_type} ${res.access_token}`,
            }
            router.push({ name: 'control-panel' })
        })
    }

    /**
     * Gets a new access token
     * @returns An empty promise to signal every failed request that the refresh was successful
     */
    function refreshToken(): Promise<void> {
        if (!refreshPromise) {
            refreshPromise = new Promise((resolve) => {
                refreshAccessToken(accessToken.value.refresh_token)
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
                    .finally(() => (refreshPromise = null))
            })
        }
        return refreshPromise
    }

    /**
     * Completamente analoga ad "apiRequest", ma se il server restituisce un 401 per via del token scaduto
     * esegue il refresh del token e ripete la richiesta fallita.
     * */
    function apiRequestWithRefresh<Datatype>(method: Method, url: string, payload?: Object, config?: Object) {
        return new Promise((resolve, reject) => {
            apiRequest<Datatype>(method, url, payload, config)
                .then((res) => resolve(res))
                .catch((err: any) => {
                    if (err.response?.status === 401 && err.response?.data?.code === 'token_not_valid') {
                        refreshToken().then(() =>
                            apiRequest<Datatype>(method, url, payload, config)
                                .then((res: Datatype) => res)
                                .catch((err: any) => reject(err))
                        )
                    } else reject(err)
                })
        })
    }

    return { accessToken, isAuthenticated, refreshPromise, $reset, getAccessToken, refreshToken, apiRequestWithRefresh }
})

export interface Token {
    access_token: string //	An access token that can be provided in subsequent calls, for example to Spotify Web API services.
    token_type: string //	How the access token may be used: always "Bearer".
    scope: string // A space-separated list of scopes which have been granted for this access_token
    expires_in: number //	The time period (in seconds) for which the access token is valid.
    refresh_token: string //	See refreshing tokens.
}

/**
 * Request a new access token if the old one is expired
 *
 * @param refreshToken refresh token found in the original access token response
 */
function refreshAccessToken(refreshToken: string): Promise<Token> {
    const payload = {
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
        client_id: import.meta.env.VITE_SPOTIFY_ID,
    }
    const config = {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
    }
    return apiRequest<Token>('post', '/api/token', payload, config)
}

/**
 * Step 1 of spotify authentication flow: requests user authorization
 *
 * @param clientId app id
 * @param codeChallenge code for validation
 * @returns response from spotify api
 */
export function generateAuthorizationLink(codeChallenge: string): string {
    const queryParams = {
        client_id: import.meta.env.VITE_SPOTIFY_ID,
        response_type: 'code',
        redirect_uri: import.meta.env.VITE_SPOTIFY_REDIRECT_URI,
        scope: scopes.reduce((acc, scopeItem) => `${acc} ${scopeItem}`, ''),
        code_challenge_method: 'S256',
        code_challenge: codeChallenge,
    }

    const completeUrl = addQueryParams('/authorize', queryParams)
    return completeUrl
}

/** Generate a random string
 * see https://developer.spotify.com/documentation/web-api/tutorials/code-pkce-flow
 *
 * @returns a random string
 */
export function generateCodeVerifier() {
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    const values = crypto.getRandomValues(new Uint8Array(CHALLENGE_LENGTH))
    return values.reduce((acc, x) => acc + possible[x % possible.length], '')
}

/**
 * Encodes a string with SHA-256 encryption
 * see https://developer.spotify.com/documentation/web-api/tutorials/code-pkce-flow
 *
 * @param stringToEncode string to encode
 * @returns encoded string
 */
async function sha256(stringToEncode: string) {
    const encoder = new TextEncoder()
    const data = encoder.encode(stringToEncode)
    return window.crypto.subtle.digest('SHA-256', data)
}

/**
 * Generates a code for spotify authentication process
 * see https://developer.spotify.com/documentation/web-api/tutorials/code-pkce-flow
 *
 * @returns string Promise with a verified code
 */
export async function generateCodeChallenge(codeVerifier: string) {
    const hashed = await sha256(codeVerifier)
    return btoa(String.fromCharCode(...new Uint8Array(hashed)))
        .replace(/=/g, '')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
}
