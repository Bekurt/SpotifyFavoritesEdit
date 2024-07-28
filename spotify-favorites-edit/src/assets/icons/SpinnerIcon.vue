<script setup lang="tsx">
defineProps<{ strokeWidth: `${number}${'px' | 'rem' | 'em'}` }>()
</script>

<template>
    <div class="loader-animation" :style="{ padding: strokeWidth }"></div>
</template>

<style scoped>
.loader-animation {
    aspect-ratio: 1;
    border-radius: 50%;
    --_m: conic-gradient(#0000 10%, #000), linear-gradient(#000 0 0) content-box;
    mask: var(--_m);
    -webkit-mask: var(--_m);
    -webkit-mask-composite: source-out;
    mask-composite: subtract;
    animation: l3 0.75s infinite linear;
}
@keyframes l3 {
    to {
        transform: rotate(1turn);
    }
}
</style>
