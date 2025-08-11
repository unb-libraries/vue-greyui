<template>
  <WidgetOptions
    :model-value="modelValue"
    :cardinality="(cardinality as C)"
    :options="options"
    :as="as"
    @update:model-value="$emit('update:modelValue', $event as TModel<keyof WidgetOptionsProps<T, C>['options'], C>)"
  >
    <slot />
  </WidgetOptions>
</template>

<script lang="ts" setup generic="T, C extends Cardinality">
import { Cardinality, TModel, WidgetOptions, type WidgetOptionsProps } from '~/components'

defineOptions({ name: 'ContentPool' })
defineModel<TModel<keyof WidgetOptionsProps<T, C>['options'], C>>({ required: true })
defineProps<WidgetOptionsProps<T, C>>()
</script>