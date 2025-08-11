<template>
  <Collection
    :items="options"
    v-slot="{ item, id }"
  >
    <Widget
      as-child
      :id="`${name}[${id}]`"
      :name="name"
      :model-value="isSelected(id)"
      @update:model-value="onSelect(id, $event)"
      v-slot="{ id, value: selected }"
    >
      <slot :option="item" :key="id" :id="id" :selected="selected.value" />
    </Widget>
  </Collection>
</template>

<script lang="ts" setup generic="T, C extends Cardinality">
import { inject, watch } from 'vue'
import type { Cardinality, TWidget, WidgetInjection, WidgetOptionsInjection } from '~/components'
import { Collection, Widget } from '~/components'

defineOptions({ name: 'WidgetOptionsCollection' })
const { options } = inject<WidgetOptionsInjection<T, C>>('widget-options')
const { value: selection, cardinality, name } = inject<WidgetInjection<string, C>>('widget')
if (!selection) {
  throw new Error('WidgetOptions must be used within a Widget context')
}
if (cardinality === 'many') {
  var { add, remove } = inject<WidgetInjection<string, 'many'>>('widget')
}

function isSelected(key: string): boolean {
  if (cardinality === 'one') {
    return selection.value === key
  } else {
    return Object.values(selection.value).includes(key)
  }
}

function onSelect(key: string, selected: boolean) {
  if (cardinality === 'one') {
    selection.value = (selected ? key : undefined) as TWidget<string, C>
  } else if (selected) {
    add(key)
  } else {
    const modelKey = Object.entries(selection.value).find(([_, value]) => value === key)?.[0]
    if (modelKey) {
      remove(modelKey)
    }
  }
}
</script>