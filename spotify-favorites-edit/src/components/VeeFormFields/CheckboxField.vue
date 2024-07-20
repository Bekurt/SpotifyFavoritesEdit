<script setup lang="ts">
/**
 * Campo Checkbox per form creati con vee-validate, con label e messaggio di errore già implementati
 *
 * Props:
 * - name: nome del campo. Al submit del form, questo campo compare tra i valori con questo nome
 * - value: valore del campo __quando selezionato__ (il campo viene creato _undefined_)
 * - classes: classi dei vari elementi html per una completa personalizzazione.
 *
 * N.B.
 * 1. Tutti gli attributi assegnati al componente verranno ereditati dalla checkbox
 * 2. Se più checkbox hanno lo stesso nome, il valore nel form sarà un array con i valori di tutte le box selezionate
 * 3. Se value="true", bisogna aggiungere uncheckedValue="false" (colpa di vee-validate)
 *
 * Il componente può essere usato sia dentro un <Form> di vee-validate, sia utilizzando useForm()
 * */

import { ErrorMessage, Field, useField } from 'vee-validate'

defineOptions({ inheritAttrs: false })
const { name } = defineProps<{
  value: string | boolean
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
    <label :for="`${name}-${value}`" :class="classes?.label">
      <slot></slot>
    </label>
    <Field as="input" type="checkbox" :id="`${name}-${value}`" :value="value" :name="name" v-bind="$attrs" />
    <ErrorMessage :name="name" class="whitespace-pre-wrap text-red-500" :class="classes?.error" />
  </div>
</template>

<style scoped></style>
