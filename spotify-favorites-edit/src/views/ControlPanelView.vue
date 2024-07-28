<script setup lang="tsx">
import { getSavedTracks } from '@/api_interface/tracks_api'
import SpinnerIcon from '@/assets/icons/SpinnerIcon.vue'
import { ref } from 'vue'

const queryParams = ref({
    limit: 50,
    offset: 0,
})
const savedTracks = getSavedTracks(queryParams)
</script>

<template>
    <main class="flex min-h-screen w-full items-center justify-center bg-neutral-900">
        <SpinnerIcon v-if="savedTracks.isPending.value" class="size-8 bg-green-600" strokeWidth="0.5rem" />
        <ul v-else>
            <li v-for="track in savedTracks.data.value?.items"></li>
        </ul>
    </main>
</template>
