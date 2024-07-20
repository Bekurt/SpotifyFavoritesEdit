<script setup lang="tsx">
import { ref } from 'vue'

const counter = ref(0)
const Title = () => <h1>WELCOME BACK TSX: {counter.value}</h1>
</script>

<template>
    <Title @click="counter++" class="w-full bg-red-200 p-3" />
    <RouterLink :to="{ name: 'login' }">login</RouterLink>
</template>
