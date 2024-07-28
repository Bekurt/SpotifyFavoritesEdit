<script setup lang="tsx">
import { generateAuthorizationLink, generateCodeChallenge, generateCodeVerifier, useTokenStore } from '@/stores/token'
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const { getAccessToken } = useTokenStore()

const route = useRoute()
const authCode = computed(() => (Array.isArray(route.query.code) ? route.query.code[0] : route.query.code))
const error = computed(() => (Array.isArray(route.query.error) ? route.query.error[0] : route.query.error))

if (!authCode.value && !error.value) {
    const codeVerifier = generateCodeVerifier()
    window.sessionStorage.setItem('code_verifier', codeVerifier)

    generateCodeChallenge(codeVerifier).then((url) => {
        window.location.href = generateAuthorizationLink(url)
    })
} else if (authCode.value) {
    getAccessToken(authCode.value, window.sessionStorage.getItem('code_verifier') as string)
}
</script>

<template>
    <main class="flex h-screen w-full flex-col items-center justify-center gap-10 bg-neutral-900">
        <h1 v-if="error" class="text-4xl font-extrabold text-white">Errore di autenticazione</h1>
        <RouterLink
            v-if="error"
            :to="{ name: 'home' }"
            class="rounded-3xl bg-neutral-600 px-8 py-2 text-xl font-semibold text-green-600"
        >
            Esci
        </RouterLink>
    </main>
</template>
