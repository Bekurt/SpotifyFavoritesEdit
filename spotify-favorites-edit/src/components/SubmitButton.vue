<script setup lang="tsx">
const { spinnerStrokeWidth } = defineProps<{
    loading: boolean
    spinnerClass: string
    spinnerStrokeWidth: `${number}${'px' | 'rem' | 'em'}`
}>()

const spinner = () => {
    return <div class="loader-animation" style={{ padding: spinnerStrokeWidth }}></div>
}
</script>

<template>
    <button
        type="submit"
        :disabled="loading"
        class="disabled:flex disabled:items-center disabled:justify-center disabled:p-3 disabled:brightness-75"
    >
        <spinner v-if="loading" :class="spinnerClass" class="mx-auto" />
        <slot v-else></slot>
    </button>
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
