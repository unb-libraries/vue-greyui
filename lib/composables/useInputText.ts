import { computed } from "vue"
import type { InputProps, InputEmits } from "."

export type InputTextProps = InputProps<string>
export type InputTextEmits = InputEmits<string>

export function useInputText(props: InputTextProps, emits: <T extends keyof InputTextEmits>(evt: T, ...args: InputTextEmits[T]) => void) {
  const value = computed({
    get: () => props.modelValue,
    set: (newValue: string) => emits(`update:modelValue`, newValue)
  })

  const onInput = (event: Event) => {
    value.value = (event.target as HTMLInputElement).value
  }
  
  const update = (newValue?: string) => value.value = newValue
  const clear = () => update()

  return {
    value,
    onInput,
    clear,
    update,
  }
}
