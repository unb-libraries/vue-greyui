import { computed, onMounted } from "vue"
import type { WritableComputedRef } from "vue"

export interface InputProps<T = unknown> {
  modelValue?: T
}

export interface InputEmits<T = unknown> {
  "update:modelValue": [value: T]
}

// @ts-expect-error Expect this to not work generically
export type Emit<T> = <K extends keyof T>(evt: K, ...args: T[K]) => void

export interface InputOptions<T = unknown> {
  emptyValue: T | undefined
}

export interface Input<T = unknown> {
  value: WritableComputedRef<T>
  clear: () => void
  unset: () => void
}

export default function useInput<T = unknown>(props: InputProps<T>, emits: Emit<InputEmits<T>>, options?: Partial<InputOptions<T>>): Input<T> {
  const { emptyValue }: InputOptions<T> = {
    emptyValue: undefined,
    ...options
  }

  let initial = props.modelValue
  onMounted(() => {
    initial = props.modelValue
  })

  const value = computed({
    get: () => props.modelValue ?? emptyValue,
    set: (newValue: T) => emits('update:modelValue', newValue)
  })
  
  return {
    value,
    clear: () => { if (value.value) value.value = emptyValue },
    unset: () => value.value = initial ? null : undefined,
  }
}
