import useInput from './useInput'
import type { Cardinality, TCardinality } from "."
import type { DataProvider } from "./useDataProvider"
import type { Emit, Input, InputEmits, InputOptions, InputProps } from "./useInput"
export interface SelectionProps<T = unknown, C extends Cardinality = "single"> extends InputProps<TCardinality<T, C>> {
  provider: DataProvider<T>
}

export interface SelectionEmits<T = unknown, C extends Cardinality = "single"> extends InputEmits<TCardinality<T, C>> {
  select: [selected: TCardinality<T, C>, current: TCardinality<T, C>]
  deselect: [unselected: TCardinality<T, C>, current: TCardinality<T, C>]
}

export interface SelectionOptions<T = unknown, C extends Cardinality = "single"> extends InputOptions<TCardinality<T, C>> {
  cardinality: C
}

export interface Selection<T = unknown, C extends Cardinality = "single"> extends Input<TCardinality<T, C>> {
  select: (item: T) => void
  toggle: (item: T) => void
  deselect: C extends "many"
    ? (item: number | ((item: T, index: number, arr: T[]) => boolean) | T) => void
    : () => void
  isSelected: (item: T) => boolean
}

export function useInputSelect<T = unknown, C extends Cardinality = "single">(props: SelectionProps<T, C>, emits: Emit<SelectionEmits<T, C>>, options?: Partial<SelectionOptions<T, C>>): Selection<T, C> {
  const { cardinality, emptyValue } = { cardinality: options?.cardinality ?? "single", emptyValue: (options?.cardinality === "many" ? [] : options?.emptyValue) as TCardinality<T, C> }
  const { value, ...input } = useInput<TCardinality<T, C>>(props, emits, { emptyValue })

  function isSelected(item: T) {
    return cardinality === "many"
      ? ((value.value ?? []) as T[]).includes(item)
      : value.value === item
  }

  function select(item: T) {
    if (!isSelected(item) && props.provider.has(item)) {
      const newValue = (cardinality === "single"
        ? item as TCardinality<T, C>
        : [...(value.value ?? []) as T[], item]) as TCardinality<T, C>
      value.value = newValue
      emits("select", item as TCardinality<T, C>, newValue)
    }
  }

  function deselect(): void
  function deselect(indexOrFilterOrItem: number | ((item: T, index: number, arr: T[]) => boolean) | T): void
  function deselect(indexOrFilterOrItem?: number | ((item: T, index: number, arr: T[]) => boolean) | T): void {
    const item = (typeof indexOrFilterOrItem === "number"
      ? (value.value as T[])[indexOrFilterOrItem]
      : typeof indexOrFilterOrItem === "function"
        ? (value.value as T[]).find(indexOrFilterOrItem as (item: T, index: number, arr: T[]) => boolean)
        : indexOrFilterOrItem
          ? indexOrFilterOrItem
          : value.value) as T
    
    if (item) {
      const newValue = cardinality === "many"
        ? (value.value as T[]).filter((selected) => selected !== item) as TCardinality<T, C>
        : emptyValue as TCardinality<T, C>

      if (isSelected(item)) {
        value.value = newValue
      }

      emits("deselect", item as TCardinality<T, C>, newValue)
    }
  }

  function toggle(item: T) {
    return isSelected(item) ? deselect(item) : select(item)
  }

  return {
    value,
    select,
    toggle,
    deselect,
    isSelected,
    ...input,
  }
}
