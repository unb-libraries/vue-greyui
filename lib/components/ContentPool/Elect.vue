<template>
  <Primitive :as="as">
    <component :is="elect">
      <slot :tab="selected">
        <slot :name="content.get(selected).id" :tab="selected" />
      </slot>
    </component>
  </Primitive>
</template>

<script lang="ts" setup generic="T">
import { computed, inject } from 'vue'
import Content from './Content.vue'
import { Primitive, type PrimitiveProps, type WidgetInjection, type WidgetOptionsInjection } from '~/components'

defineOptions({ name: 'ContentPoolElect' })
defineProps<Pick<PrimitiveProps, 'as'>>()

const { options } = inject<WidgetOptionsInjection<T, 'one'>>('widget-options', { options: {} })
const { value: selected, cardinality } = inject<WidgetInjection<T, 'one'>>('widget')
if (cardinality !== 'one') {
  throw new Error('ContentPoolElect must be used within a single-value pool.')
}

const content = computed(() => new Map<T, { id: string, content: typeof Content }>(Object
  .entries(options)
  .map(([id, option]) => [option, { id, content: Content }])))
const elect = computed(() => content.value.get(selected.value).content)
</script>