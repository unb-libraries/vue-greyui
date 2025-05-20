<template>
  <widget-base
    ref="widget"
    :layout="layout"
    :model-value="value"
    :empty-value="''"
    :validators="validators"
    :auto-validate="false"
    @update:model-value="(newValue: string) => $emit('update:modelValue', newValue)"
  />
</template>

<script setup lang="ts">
import { IWidget, type StylableProps, Widget as WidgetBase, WidgetEmits, WidgetLayoutEmits, WidgetLayoutProps } from "~/components"
import { computed, ref } from "vue"

type WidgetTextProps = {
  required?: boolean
  pattern?: string
}
export type WidgetTextLayoutProps = StylableProps<WidgetLayoutProps<string> & WidgetTextProps, WidgetLayoutEmits<string>>

const widget = ref<IWidget>()
const value = defineModel<string>({ required: false })
const props = defineProps<WidgetTextLayoutProps & WidgetTextProps>()
defineEmits<WidgetEmits>()

const validators = computed(() => [
  props.required && ((str: string) => Boolean(str) || 'This field is required.'),
  props.pattern && ((str: string) => new RegExp(props.pattern!).test(str) || `Must match the pattern ${props.pattern}.`),
].filter(Boolean))

defineExpose({
  validate: widget.value?.validate,
})
</script>