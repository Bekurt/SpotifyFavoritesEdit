<script setup lang="tsx"></script>

<template>
    <main class="flex h-screen w-full flex-col items-center justify-center gap-10 bg-neutral-900">
        <h1 class="text-7xl font-extrabold text-green-600">Spotify Favorites Edit</h1>
        <RouterLink
            :to="{ name: 'login' }"
            class="rounded-3xl bg-neutral-600 px-8 py-2 text-3xl font-semibold text-white"
        >
            Vai al login
        </RouterLink>
    </main>
</template>
