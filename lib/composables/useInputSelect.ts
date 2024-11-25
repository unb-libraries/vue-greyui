import { watch } from "vue"
import useInput from "./useInput"
import { useInputOptionsProvider } from "./useInputOptionsProvider"
import type { Emit, InputEmits, InputProps, Input, InputOptions } from "./useInput"
import type { InputOptionsProvider, InputOptionsProviderOptions, Option, OptObject } from "./useInputOptionsProvider"

type Cardinality = "single" | "many"
type TData<C extends Cardinality = "single"> = C extends "single" ? string : string[]

export interface InputSelectProps<O extends Option = Option, C extends Cardinality = "single", S = string> extends InputProps<TData<C>> {
  options: O[]
  id?: InputOptionsProviderOptions<O, S>["id"] | (O extends Option<infer T> ? keyof T : undefined)
  label?: InputOptionsProviderOptions<O, S>["label"] | (O extends Option<infer T> ? keyof T : undefined)
}
export interface InputSelectEmits<S = string, C extends Cardinality = "single"> extends InputEmits<TData<C>> {
  select: C extends "single" ? [current?: [string, S], previous?: [string, S]] : [selected: [string, S][], unselected: [string, S][], current: [string, S][]]
}

export interface InputSelectOptions<C extends Cardinality = "single"> extends InputOptions<C extends "single" ? "" : []> {
  cardinality: C
}

export interface InputSelect<C extends Cardinality = "single", S = string> extends Input<TData<C>> {
  isSelected: (option: string) => boolean
  provider: InputOptionsProvider<S>
  select: (option: string) => void
  toggle: (option: string) => void
  unselect: (option: string) => void
}

export function useInputSelect <O extends Option = Option<Record<string, string>>, C extends Cardinality = "single", S = string>(props: InputSelectProps<O, C, S>, emits: Emit<InputSelectEmits<S, C>>, options?: Partial<Omit<InputSelectOptions<C>, "id" | "label">>): InputSelect<C, S> {
  const { cardinality, emptyValue, ...config } = {
    cardinality: Array.isArray(props.modelValue) || (Array.isArray(options?.emptyValue) && !options.emptyValue.length) ? "many" : "single",
    emptyValue: Array.isArray(props.modelValue) || options?.cardinality === "many" ? [] as string[] : "",
    ...options ?? {}
  } as InputSelectOptions<C>

  const { value: selection, ...input } = useInput(props, emits, { emptyValue, ...config })
  const provider = useInputOptionsProvider<S, O>(props.options, {
    id: (item) => typeof props.id === "function"
      ? props.id(item as OptObject<O>) : props.id && item[props.id]
        ? `${item[props.id]}` : undefined,
    label: (item) => {
      if (typeof props.label === "function" && !["string", "array"].includes(typeof item)) {
        return props.label(item)
      } else if (props.label) {
        return (typeof item === "string"
          ? item : Array.isArray(item)
            ? item[1] : props.label && `${item[props.label as keyof typeof item]}`) as S
      }
    }
  })

  function isSelected(option: string) {
    return cardinality === "many" && (selection.value ?? []).includes(option) || selection.value === option
  }

  function select(option: string) {
    const [value] = provider.options.value.find(([id]) => id === option)
    if (value && !isSelected(option)) {
      selection.value = (cardinality === "many"
        ? provider.options.value
            .filter(([id]) => (selection.value as TData<"many">).includes(id) || value === id)
            .map(([id]) => id)
        : value
      ) as TData<C>
    }
  }

  function unselect(option: string) {
    if (Array.isArray(selection.value) && selection.value.includes(option)) {
      selection.value = (selection.value ?? []).filter((value) => value !== option) as TData<C>
    } else if (selection.value === option) {
      input.clear()
    }
  }

  function toOption(value: string): [string, S] {
    return provider.options.value.find(([id]) => id === value)
  }

  type TArgs = C extends "single" ? [[string, S] | undefined, [string, S] | undefined] : [[string, S][], [string, S][], [string, S][]]
  watch(selection, (newSelection, prevSelection) => {
    if (Array.isArray(newSelection) && Array.isArray(prevSelection)) {
      const added = newSelection.filter((value) => !prevSelection.includes(value))
      const removed = prevSelection.filter((value) => !newSelection.includes(value))
      emits("select", ...[added.map(toOption), removed.map(toOption), newSelection.map(toOption)] as TArgs)
    } else if (!Array.isArray(newSelection) && !Array.isArray(prevSelection)) {
      emits("select", ...[toOption(newSelection), toOption(prevSelection)] as TArgs)
    }
  })

  return {
    value: selection,
    provider,
    isSelected,
    select,
    toggle: (option: string) => isSelected(option) ? unselect(option) : select(option),
    unselect,
    ...input,
  }
}
