<script setup lang="ts">
/**
 * Campo Input per form creati con vee-validate, con label e messaggio di errore già implementati
 *
 * Props:
 * - name: nome del campo. Al submit del form, questo campo compare tra i valori con questo nome
 * - type: tipologia dell'input es. "numeric", "text", ecc... Per i tipi "checkbox", "radio", "select" e "textarea" vedere i componenti specifici
 * - classes: classi dei vari elementi html per una completa personalizzazione.
 *
 * Tutti gli attributi assegnati al componente verranno ereditati da <Field>
 * Il componente può essere usato sia dentro un <Form> di vee-validate, sia utilizzando useForm()
 * */

import { ErrorMessage, Field, useField } from 'vee-validate'

defineOptions({ inheritAttrs: false })
const { name } = defineProps<{
  type: string
  name: string
  classes?: {
    wrapper?: string
    label?: string
    error?: string
  }
}>()

//Necessario per useForm(), può mettere a disposizione funzioni e valori del campo, vedi la documentazione di vee-validate
useField(() => name)
</script>

<template>
  <div :class="classes?.wrapper">
    <label :for="name" :class="classes?.label">
      <slot></slot>
    </label>
    <Field as="input" :type="type" :name="name" :id="name" v-bind="$attrs" />
    <ErrorMessage :name="name" class="whitespace-pre-wrap text-red-500" :class="classes?.error" />
  </div>
</template>

<style scoped></style>
