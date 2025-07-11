<template>
  <template v-for="(item, key) in items" :key="key">
    <CollectionItem :item="item" :id="key">
      <slot :item="item" :id="key" />
    </CollectionItem>
  </template>
</template>

<script lang="ts">
import { type Cardinality } from '~/components'
import CollectionItem from './CollectionItem.vue'
export type CollectionProps<T> = { items: Record<string, T> }
export type CollectionInjection<T> = CollectionProps<T>
</script>

<script lang="ts" setup generic="T, C extends Cardinality = 'one'">
import { provide } from 'vue'

defineOptions({ name: 'Collection' })
const props = defineProps<CollectionProps<T>>()

provide<CollectionInjection<T>>('collection', {
  items: props.items,
})
</script>