import Options from './Widget/Options.vue'
export { default as Stylable, type StylableProps } from './Stylable.vue'
export { default as Modal } from './Modal.vue'

export type Validator<T = unknown> = (value: T) => true | string

// Widget
export type { Cardinality, TData, IWidget, WidgetProps, WidgetLayoutProps, WidgetEmits, WidgetLayoutEmits } from './Widget/index.vue'
export { default as Widget } from './Widget/index.vue'

// Widget Text
export type { WidgetTextProps, WidgetTextEmits, WidgetTextLayoutProps, WidgetTextLayoutEmits } from './Widget/Text.vue'
export { default as WidgetText } from './Widget/Text.vue'

// Widget Checkbox
export type { WidgetToggleProps, WidgetToggleEmits, WidgetToggleLayoutProps, WidgetToggleLayoutEmits } from './Widget/Toggle.vue'
export { default as WidgetToggle } from './Widget/Toggle.vue'

// Widget Number
export type { WidgetNumberProps, WidgetNumberEmits, WidgetNumberLayoutProps, WidgetNumberLayoutEmits } from './Widget/Number.vue'
export { default as WidgetNumber } from './Widget/Number.vue'

// Widget Select
export type { WidgetOptionsProps, WidgetOptionsEmits, WidgetOptionsLayoutProps, WidgetOptionsLayoutEmits } from './Widget/Options.vue'
export const Collection = Options
export const WidgetOptions = Options
