<script setup lang="tsx">
import { requestUserAuthorization } from '@/api_interface/authorizations_api'
import SubmitButton from '@/components/SubmitButton.vue'
import InputField from '@/components/VeeFormFields/InputField.vue'
import { generateCodeChallenge, generateCodeVerifier } from '@/main'
import { useForm } from 'vee-validate'

const { handleSubmit, isSubmitting } = useForm<{ client_id: string }>()

const submit = handleSubmit(async (values, actions) => {
    const codeVerifier = generateCodeVerifier()
    window.localStorage.setItem('code_verifier', codeVerifier)

    const codeChallenge = await generateCodeChallenge(codeVerifier)
    window.location.href = requestUserAuthorization(values.client_id, codeChallenge)
})
</script>

<template>
    <main class="h-screen w-full">
        <form @submit="submit" class="flex size-full items-center justify-center bg-gray-700">
            <InputField name="client_id" type="text">ID:</InputField>
            <!-- <InputField name="client_secret" type="text">Secret:</InputField> -->
            <SubmitButton spinner-class="fill-white" class="min-w-32 rounded-3xl bg-blue-500" :loading="isSubmitting">
                Vai
            </SubmitButton>
        </form>
    </main>
</template>
