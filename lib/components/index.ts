import Options from './Widget/Options.vue'
export { default as Stylable, type StylableProps } from './Stylable.vue'
export { default as Modal } from './Modal.vue'

// Widget
export type { IWidget, WidgetProps, WidgetLayoutProps, WidgetEmits, WidgetLayoutEmits } from './Widget/index.vue'
export { default as Widget } from './Widget/index.vue'

// Widget Text
export type { WidgetTextLayoutProps } from './Widget/Text.vue'
export { default as WidgetText } from './Widget/Text.vue'

// Widget Checkbox
export type { WidgetToggleLayoutProps } from './Widget/Toggle.vue'
export { default as WidgetToggle } from './Widget/Toggle.vue'

// Widget Number
export type { WidgetNumberLayoutProps } from './Widget/Number.vue'
export { default as WidgetNumber } from './Widget/Number.vue'

// Widget Select
export type { WidgetOptionsProps, WidgetOptionsLayoutProps, WidgetOptionsLayoutEmits } from './Widget/Options.vue'
export const Collection = Options
export const WidgetOptions = Options
