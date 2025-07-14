<template>
  <Widget
    :as="as"
    :as-child="false"
    :model-value="modelValue"
    :style="{ position: 'relative', overflow: 'visible' }"
    :data-state="state"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <slot />
  </Widget>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { Widget, type WidgetProps } from '~/components'

export type TogglableProps = Omit<WidgetProps<boolean, 'one'>, 'asChild'>

defineOptions({ name: 'Togglable' })
const open = defineModel<boolean>({ required: false })
defineProps<TogglableProps>()

const state = computed(() => open.value ? 'open' : 'closed')
</script>