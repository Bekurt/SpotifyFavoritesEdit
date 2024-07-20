<script setup lang="ts">
/**
 * Campo TextArea per form creati con vee-validate, con label e messaggio di errore già implementati
 *
 * Props:
 * - name: nome del campo. Al submit del form, questo campo compare tra i valori con questo nome
 * - classes: classi dei vari elementi html per una completa personalizzazione.
 *
 * Tutti gli attributi assegnati al componente verranno ereditati dal <Field>
 *
 * Il componente può essere usato sia dentro un <Form> di vee-validate, sia utilizzando useForm()
 * */
import { ErrorMessage, Field, useField } from 'vee-validate'

defineOptions({ inheritAttrs: false })
const { name } = defineProps<{
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
    <Field as="textarea" :name="name" :id="name" v-bind="$attrs" />
    <ErrorMessage :name="name" class="whitespace-pre-wrap text-red-500" :class="classes?.error" />
  </div>
</template>

<style scoped></style>
