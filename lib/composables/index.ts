export { useInputText, type InputTextProps, type InputTextEmits } from "./useInputText"

export interface InputProps<T = unknown> {
  modelValue: T
}

export interface InputEmits<T = unknown> {
  "update:modelValue": [value: T]
}