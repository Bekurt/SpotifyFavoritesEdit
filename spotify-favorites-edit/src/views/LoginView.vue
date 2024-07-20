<script setup lang="tsx">
import { requestUserAuthorization } from '@/api_interface/authorizations_api'
import { generateCodeChallenge, generateCodeVerifier } from '@/main'
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const authCode = computed(() => route.query.code)

if (!authCode.value) {
    const codeVerifier = generateCodeVerifier()
    window.localStorage.setItem('code_verifier', codeVerifier)

    generateCodeChallenge(codeVerifier).then((res) => {
        window.location.href = requestUserAuthorization(import.meta.env.VITE_SPOTIFY_ID, res)
    })
}
</script>

<template>
    <div>Route code is {{ authCode }}</div>
</template>
