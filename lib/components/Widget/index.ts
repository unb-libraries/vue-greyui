import { default as Options } from '~/components/Widget/Options.vue'
export { default as Stylable, type StylableProps } from '~/components/Stylable.vue'
export { default as Modal } from '~/components/Modal.vue'

export type Validator<T = unknown> = (value: T) => true | string

// Widget
export { type Cardinality, type TData, type IWidget, type WidgetProps, type WidgetLayoutProps, type WidgetEmits, type WidgetLayoutEmits, default as Widget } from '~/components/Widget/index.vue'

// Widget Text
export type { WidgetTextProps, WidgetTextEmits, WidgetTextLayoutProps, WidgetTextLayoutEmits } from '~/components/Widget/Text.vue'
export { default as WidgetText } from '~/components/Widget/Text.vue'

// Widget Checkbox
export type { WidgetToggleProps, WidgetToggleEmits, WidgetToggleLayoutProps, WidgetToggleLayoutEmits } from '~/components/Widget/Toggle.vue'
export { default as WidgetToggle } from '~/components/Widget/Toggle.vue'

// Widget Number
export type { WidgetNumberProps, WidgetNumberEmits, WidgetNumberLayoutProps, WidgetNumberLayoutEmits } from '~/components/Widget/Number.vue'
export { default as WidgetNumber } from '~/components/Widget/Number.vue'

// Widget Select
export type { WidgetOptionsProps, WidgetOptionsEmits, WidgetOptionsLayoutProps, WidgetOptionsLayoutEmits } from '~/components/Widget/Options.vue'
export const Collection = Options
export const WidgetOptions = Options
