<template>
  <button type="button" @click.stop="remove(id)">
    <slot>Remove</slot>
  </button>
</template>

<script lang="ts" setup generic="T">
import { inject } from 'vue'
import type { WidgetInjection } from '../index.vue'
import { CollectionItemInjection } from '~/components'

const { remove } = inject<WidgetInjection<T, 'many'>>('widget')
if (!remove) {
  throw new Error('TagList must be used inside a Widget component')
}

const { id } = inject<CollectionItemInjection<T>>('collection-item')
</script>