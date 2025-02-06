import useInput from "./useInput"
import type { Cardinality, TCardinality } from "."
import type { InputProps, InputEmits, InputOptions, Emit, Input } from "./useInput"
import { type Ref, ref } from "vue"

export type InputTextProps<C extends Cardinality = "single"> = InputProps<TCardinality<string, C>> & { cardinality?: C }
export type InputTextEmits<C extends Cardinality = "single"> = InputEmits<TCardinality<string, C>>
export type InputTextOptions<C extends Cardinality = "single"> = InputOptions<C extends "single" ? "" : []>

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

export function useInputText<C extends Cardinality = "single">(props: InputTextProps<C>, emits: Emit<InputTextEmits<C>>, options?: Partial<InputTextOptions<C>>): C extends "single" ? InputText : InputTextArray {
  const cardinality = props.cardinality ?? "single"
  const { emptyValue } = {
    emptyValue: cardinality === "many" ? [] as string[] : "",
    ...options,
  }
  
  const input = useInput<TCardinality<string, C>>(props, emits, { emptyValue } as InputOptions<TCardinality<string, C>>)
  
  return (cardinality === "single"
    ? useInputString(input as Input<string>)
    : useInputStringList(input as Input<string[]>)) as C extends "single" ? InputText : InputTextArray
}
