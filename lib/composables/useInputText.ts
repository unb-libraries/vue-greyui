import useInput from "./useInput"
import type { InputProps, InputEmits, InputOptions, Emit, Input } from "./useInput"
import { type Ref, ref } from "vue"

export type TInputText<T extends boolean = false> = T extends true ? string[] : string
type M<T extends boolean = false> = TInputText<T>
export type InputTextProps<T extends string | string[] = string> = InputProps<T>
export type InputTextEmits<T extends string | string[] = string> = InputEmits<T>
export interface InputTextOptions<T extends boolean = false> extends InputOptions<T extends false ? "" : []> {
  multi: T
}

interface InputText extends ReturnType<typeof useInput<string>> {
  update: (newValue?: string) => void
}

interface InputTextArray extends ReturnType<typeof useInput<string[]>> {
  newValue: Ref<string>
  add: () => void
  remove: (index: number) => void
}

function useInputString(input: ReturnType<typeof useInput<string>>): InputText {
  const { value, ...inputString } = input
  return {
    ...inputString,
    value,
    update: (newValue?: string) => value.value = newValue,
  }
}

function useInputStringList(input: ReturnType<typeof useInput<string[]>>): InputTextArray {
  const { value, ...inputStringList } = input
  const newValue = ref<string>()
  return {
    ...inputStringList,
    value,
    newValue,
    add: () => value.value = [...value.value, newValue.value],
    remove: (index: number) => value.value = index >= 0
      ? value.value.filter((_, i) => i !== index)
      : value.value.slice(0, -1)
  }
}

export function useInputText<T extends boolean = false>(props: InputTextProps<M<T>>, emits: Emit<InputTextEmits<M<T>>>, options?: Partial<InputTextOptions<T>>): T extends false ? InputText : InputTextArray {
  const { emptyValue, multi } = {
    multi: false as T,
    emptyValue: options?.multi ? [] as string[] : "",
    ...options,
  }
  
  const input = useInput<M<T>>(props, emits, {
    emptyValue,
  } as InputOptions<M<T>>)
  
  return (!multi
    ? useInputString(input as Input<string>)
    : useInputStringList(input as Input<string[]>)) as T extends false? InputText : InputTextArray
}
