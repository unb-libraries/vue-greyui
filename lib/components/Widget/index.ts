// Widget
export {
  default as Widget,
  type TModel,
  type TWidget,
  type WidgetProps,
  type WidgetEmits,
  type WidgetInjection,
  type WidgetInterface,
} from './index.vue'
export { default as WidgetClear } from './Clear.vue'
export { default as WidgetIncrement } from './Increment.vue'

export * from './TagList'
export * from './Options'

// Input
export * from './Input'

// Widget Checkbox

// Widget Number

// Widget Select

export type Cardinality = 'one' | 'many'
export type Literal = string | number | boolean

