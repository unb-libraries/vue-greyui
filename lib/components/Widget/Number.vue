<template>
  <widget-base
    ref="widget"
    :layout="layout"
    :model-value="value"
    :decimals="decimals"
    :empty-value="emptyValue"
    :validators="validators"
    :auto-validate="false"
    @update:model-value="onUpdate"
  />
</template>

<script lang="ts" setup>
import { type Validator } from "~/composables"
import { computed, ref } from 'vue'
import type { IWidget, WidgetLayoutProps, StylableProps, WidgetLayoutEmits, WidgetEmits } from '~/components'
import { Widget as WidgetBase } from '~/components'

type WidgetNumberProps = {
  decimals?: number
  required?: boolean
  min?: number
  max?: number
}
export type WidgetNumberLayoutProps = StylableProps<WidgetLayoutProps<number> & WidgetNumberProps, WidgetLayoutEmits<number>>

const widget = ref<IWidget>()
const value = defineModel<number>()
const props = defineProps<WidgetNumberLayoutProps & WidgetNumberProps>()
defineEmits<WidgetEmits>()

const emptyValue = computed(() => Math.max(props.min ?? 0, 0))
const validators = computed(() => [
  props.required && ((value: number) => !isNaN(value) || 'Value is required.'),
].filter(Boolean) as Validator[])

function onUpdate(newValue?: number) {
  value.value = !newValue
    ? newValue
    : Math.min(Math.max(newValue, props.min ?? -Infinity), props.max ?? Infinity)
}

defineExpose({
  validate: widget.value?.validate,
})
</script>