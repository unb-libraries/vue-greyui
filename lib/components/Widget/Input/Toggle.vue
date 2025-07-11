<template>
  <button
    type="button"
    :id="id"
    :name="name"
    :data-state="state"
    @click="value = !value"
  >
    <slot :state="state">
      <slot v-if="state === 'on'" name="on">On</slot>
      <slot v-else name="off">Off</slot>
    </slot>
  </button>
</template>

<script lang="ts" setup>
import { computed, inject, watch } from 'vue'
import type { Cardinality, WidgetInjection } from '~/components'

defineOptions({ name: 'InputToggle' })
const { value, id, name } = inject<WidgetInjection<boolean, Cardinality>>('widget')
if (!value) {
  throw new Error('Toggle must be used within a Widget component.')
}


const state = computed<'on' | 'off'>(() => value.value ? 'on' : 'off')
watch(value, (newValue) => {
  console.log('Toggle state changed:', newValue, state.value)
})
</script>