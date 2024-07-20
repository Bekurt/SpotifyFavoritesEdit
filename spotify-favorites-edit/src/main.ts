import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.config.errorHandler = (err) => console.log('UNCOUGHT ERROR', err)

app.mount('#app')

const CHALLENGE_LENGTH = 64

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
