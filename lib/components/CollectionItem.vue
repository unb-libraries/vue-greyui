<template>
  <slot v-bind="injection" />
</template>

<script lang="ts">
export type CollectionItemInjection<T> = {
  item: T
  id: string
}
</script>

<script lang="ts" setup generic="T">
import { provide } from 'vue';

const props = defineProps<{
  item: T
  id: string
}>()

const injection: CollectionItemInjection<T> = {
  item: props.item,
  id: props.id,
}

provide<CollectionItemInjection<T>>('collection-item', injection)
</script>