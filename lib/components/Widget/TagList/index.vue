<template>
  <Collection :items="value" v-slot="{ item, id }">
    <slot :item="item" :id="id" />
  </Collection>
</template>

<script lang="ts">
export type TagListInjection<T> = {
  add: (item: T) => void
}
</script>

<script lang="ts" setup generic="T">
import { inject } from 'vue'
import type { WidgetInjection } from '~/components'
import { Collection } from '~/components'

defineOptions({ name: 'TagList' })
const { value, cardinality } = inject<WidgetInjection<T, 'many'>>('widget')
if (!value) {
  throw new Error('TagList must be used inside a Widget component')
}
if (cardinality !== 'many') {
  throw new Error('TagList must be used inside a multi-value widget.')
}
</script>