<template>
  <Teleport v-if="modelValue" :to="container ?? 'body'">
    <Widget
      as-child
      v-bind="$attrs"
      :model-value="modelValue"
      @update:model-value="$emit('update:modelValue', $event)"
    >
      <div
        :style="{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
        }"
        @click.self="close"
      >
        <slot close />
      </div>
    </Widget>
  </Teleport>
</template>

<script lang="ts" setup>
import { Widget } from '~/components'

defineOptions({ name: 'Modal' })
const open = defineModel<boolean>({ default: false })
defineProps<{
  container?: string
}>()

function close() {
  open.value = false
}
</script>
