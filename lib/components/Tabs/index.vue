<template>
  <WidgetOptions
    :model-value="modelValue"
    :options="tabs"
    :as="as"
    @update:model-value="$emit('update:modelValue', $event as T)"
  >
    <slot />
  </WidgetOptions>
</template>

<script lang="ts" setup generic="T">
import { WidgetOptions, type WidgetOptionsProps } from '~/components'

type TabsProps = Omit<WidgetOptionsProps<T, 'one'>, 'options'> & {
  tabs: WidgetOptionsProps<T, 'one'>['options']
}

defineOptions({ name: 'Tabs' })
defineModel<T>({ required: true })
defineProps<TabsProps>()
</script>