import useInput from "./useInput"
import type { Emit, InputEmits, InputProps } from "./useInput"

export type InputBooleanProps = InputProps<boolean>
export type InputBooleanEmits = InputEmits<boolean>
export interface InputBoolean extends Pick<ReturnType<typeof useInput<boolean>>, `value`> {
  toggle: () => void
}

export function useInputBoolean(props: InputBooleanProps, emits: Emit<InputBooleanEmits>): InputBoolean {
  const { value } = useInput<boolean>(props, emits)
  return {
    value,
    toggle: () => {
      value.value = !value.value
    },
  }
}