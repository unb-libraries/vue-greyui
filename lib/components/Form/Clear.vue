<template>
  <button
    type="button"
    @click="form.clear"
  >
    <slot />
  </button>
</template>

<script lang="ts" setup>
import { inject } from 'vue'
import { type FormInjection } from '~/components'

const form = inject<FormInjection>('form')
if (!form) {
  throw new Error('FormClear must be used within a Form component.')
}
</script>