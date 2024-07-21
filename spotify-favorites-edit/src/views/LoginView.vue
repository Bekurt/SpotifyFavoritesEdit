<script setup lang="tsx">
import { requestUserAuthorization } from '@/api_interface/authorizations_api'
import { generateCodeChallenge, generateCodeVerifier } from '@/main'
import { useAuthStore } from '@/stores/auth'
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const router = useRouter()
const route = useRoute()
const authCode = computed(() => (Array.isArray(route.query.code) ? route.query.code[0] : route.query.code))

if (!authCode.value) {
    const codeVerifier = generateCodeVerifier()
    window.sessionStorage.setItem('code_verifier', codeVerifier)

    generateCodeChallenge(codeVerifier).then((url) => {
        window.location.href = requestUserAuthorization(url)
    })
} else {
    useAuthStore().getToken(authCode.value, window.sessionStorage.getItem('code_verifier') as string)
}
</script>

<template>
    <div>RENDERED</div>
</template>
