<template>
  <Primitive v-if="selected || value" :as="as">
    <slot />
  </Primitive>
</template>

<script lang="ts" setup>
import { inject } from 'vue'
import { WidgetInjection, type Cardinality, Primitive, type PrimitiveProps } from '~/components'

defineOptions({ name: 'ContentPoolItem' })
const props = defineProps<PrimitiveProps & {
  selected?: boolean
}>()

const { value } = inject<WidgetInjection<boolean, Cardinality>>('widget')
if (props.selected === undefined && !value) {
  throw new Error('Must provide "selected" prop or use within a ContentPoolOptions component.')
}
</script>