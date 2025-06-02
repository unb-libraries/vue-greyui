<template>
  <widget-base
    ref="widget"
    :layout="layout"
    :model-value="value"
    :cardinality="'one'"
    :required="required"
    :label="label"
    :empty-value="false"
    :auto-validate="true"
    @update:model-value="(newValue: boolean) => $emit('update:modelValue', newValue)"
  />
</template>

<script lang="ts" setup>
import type { Validator } from "~/composables"
import type { StylableProps, IWidget, WidgetLayoutProps, WidgetEmits, WidgetLayoutEmits } from '~/components'
import { Widget as WidgetBase } from '~/components'
import { computed, ref } from "vue"

type WidgetToggleProps = {
  label: string
  required?: boolean
}

export type WidgetToggleLayoutProps = StylableProps<WidgetLayoutProps<boolean, 'one'> & WidgetToggleProps, WidgetLayoutEmits<boolean, 'one'>>

const widget = ref<IWidget>()
const value = defineModel<boolean>()
const props = defineProps<WidgetToggleLayoutProps & WidgetToggleProps>()
defineEmits<WidgetEmits>()

const validators = computed(() => [
  props.required && ((value: boolean) => value === true || 'Value is required.'),
].filter(Boolean) as Validator[])

defineExpose({
  validate: widget.value?.validate,
})
</script>