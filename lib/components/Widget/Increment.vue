<template>
  <button
    type="button"
    tabindex="-1"
    @click.stop="value += step"
  >
    <slot>{{ step < 0 ? '-' : '+' }}</slot>
  </button>
</template>

<script lang="ts" setup>
import { inject } from 'vue'
import { WidgetInjection } from './index.vue'

withDefaults(defineProps<{
  step?: number
}>(), {
  step: 1,
});

const { value } = inject<WidgetInjection<number, 'one'>>('widget')
if (!value) {
  throw new Error('Increment must be used within a Widget component.');
}
</script>