<script setup lang="ts">
/**
 * Campo Radio per form creati con vee-validate, con label e messaggio di errore già implementati
 *
 * Props:
 * - name: nome del campo. Al submit del form, questo campo compare tra i valori con questo nome
 * - value: valore del campo
 * - classes: classi dei vari elementi html per una completa personalizzazione.
 *
 * N.B.
 * 1. Tutti gli attributi assegnati al componente verranno ereditati dal radio
 * 2. Per il comportamento corretto del form, tutti i radio dello stesso gruppo DEVONO avere lo stesso nome
 *
 * Il componente può essere usato sia dentro un <Form> di vee-validate, sia utilizzando useForm()
 * */

import { ErrorMessage, Field, useField } from 'vee-validate'

defineOptions({ inheritAttrs: false })
const { name } = defineProps<{
  value: string | number | boolean
  name: string
  classes?: {
    wrapper?: string
    label?: string
    error?: string
  }
}>()

useField(() => name)
</script>

<template>
  <div :class="classes?.wrapper">
    <label :for="name + '-' + value" :class="classes?.label">
      <slot></slot>
    </label>
    <Field as="input" type="radio" :value="value" :name="name" :id="name + '-' + value" v-bind="$attrs" />
    <ErrorMessage :name="name" class="whitespace-pre-wrap text-red-500" :class="classes?.error" />
  </div>
</template>

<style scoped></style>
