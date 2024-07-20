<script setup lang="ts">
/**
 * Campo Input per form creati con vee-validate, con label e messaggio di errore già implementati
 * Contiene anche la gestione della visibilità della password
 *
 * Props:
 * - name: nome del campo. Al submit del form, questo campo compare tra i valori con questo nome
 * - classes: classi dei vari elementi html per una completa personalizzazione.
 *
 * Tutti gli attributi assegnati al componente verranno ereditati da <Field>
 * Il componente può essere usato sia dentro un <Form> di vee-validate, sia utilizzando useForm()
 * */

import { ErrorMessage, Field, useField } from 'vee-validate'
import ShowPasswordIcon from '@/assets/icons/ShowPasswordIcon.vue'
import { ref } from 'vue'

defineOptions({ inheritAttrs: false })
const { name } = defineProps<{
  name: string
  classes?: {
    wrapper?: string
    label?: string
    error?: string
    icon?: string
  }
}>()

const showPassword = ref(false)
//Necessario per useForm(), può mettere a disposizione funzioni e valori del campo, vedi la documentazione di vee-validate
const { value } = useField(() => name)
</script>

<template>
  <div :class="classes?.wrapper">
    <label :for="name" :class="classes?.label">
      <slot></slot>
    </label>
    <div class="relative">
      <Field as="input" :type="showPassword ? 'text' : 'password'" :name="name" :id="name" v-bind="$attrs" />
      <ShowPasswordIcon
        v-if="value"
        @click="showPassword = !showPassword"
        :status="showPassword"
        class="absolute inset-y-0 right-4 h-full fill-none"
        :class="classes?.icon"
      />
    </div>
    <ErrorMessage :name="name" class="whitespace-pre-wrap text-red-500" :class="classes?.error" />
  </div>
</template>

<style scoped></style>
