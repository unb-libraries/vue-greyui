<template>
  <Teleport v-if="open" :to="container ?? 'body'">
    <stylable-layout
      :layout="layout"
      @close="close"
    />
  </Teleport>
</template>

<script lang="ts" setup>
import { Stylable as StylableLayout } from '~/components'
import type { StylableProps } from '~/components'

const open = defineModel<boolean>('open')

defineProps<{
  container?: string
} & StylableProps<{}, {
  close: () => void
}>>()
const emits = defineEmits<{
  close: []
}>()

function close() {
  open.value = false
  emits('close')
}
</script>
