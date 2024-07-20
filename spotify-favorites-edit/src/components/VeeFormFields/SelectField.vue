<script setup lang="ts">
/**
 * Campo Select per form creati con vee-validate, con label e messaggio di errore già implementati
 * Sfrutta il componente ListBox dalla libreria vee-validate
 *
 * Props:
 * - name: nome del campo. Al submit del form, questo campo compare tra i valori con questo nome
 * - optionList: lista delle opzioni. display viene visualizzato, value viene mandato al form
 * - classes: classi dei vari elementi html per una completa personalizzazione.
 *
 * Il componente può essere usato sia dentro un <Form> di vee-validate, sia utilizzando useForm()
 * */

import { ErrorMessage, useField } from 'vee-validate'
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/vue'
import ChevronIcon from '@/assets/icons/ChevronIcon.vue'

defineOptions({ inheritAttrs: false })
const { name } = defineProps<{
  name: string
  optionsList: { value: string; display: string }[]
  classes?: {
    wrapper?: string
    label?: string
    options?: { active: string; inactive: string; baseline: string }
    error?: string
    icon?: string
  }
}>()

const { value } = useField<string>(() => name)
</script>

<template>
  <div :class="classes?.wrapper">
    <label :for="name" :class="classes?.label">
      <slot></slot>
    </label>
    <Listbox v-model="value" :name="name" v-slot="{ open }">
      <div class="relative">
        <ListboxButton v-bind="$attrs" class="relative">
          <span class="block truncate text-left">{{
            optionsList.find((option) => option.value === value)?.display
          }}</span>
          <span class="pointer-events-none absolute inset-y-0 right-2 flex items-center">
            <ChevronIcon :type="open ? 'up' : 'down'" :class="classes?.icon" aria-hidden="true" />
          </span>
        </ListboxButton>

        <transition
          leave-active-class="transition duration-100 ease-in"
          leave-from-class="opacity-100"
          leave-to-class="opacity-0"
        >
          <ListboxOptions
            class="absolute mt-0.5 max-h-60 w-full overflow-auto rounded-md bg-white text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm"
          >
            <ListboxOption
              v-slot="{ active, selected }"
              v-for="(option, idx) in optionsList"
              :key="name + idx"
              :value="option.value"
              as="template"
            >
              <li
                :class="[
                  active ? classes?.options?.active : classes?.options?.inactive,
                  classes?.options?.baseline,
                  'relative cursor-default select-none'
                ]"
              >
                <span :class="[selected ? 'font-medium' : 'font-normal', 'block truncate']">{{ option.display }}</span>
              </li>
            </ListboxOption>
          </ListboxOptions>
        </transition>
      </div>
    </Listbox>
    <ErrorMessage :name="name" class="whitespace-pre-wrap text-red-500" :class="classes?.error" />
  </div>
</template>

<style scoped></style>
