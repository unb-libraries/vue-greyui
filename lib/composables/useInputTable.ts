import { useInputSelect } from "./useInputSelect"
import type { Emit } from "./useInput"
import type { Cardinality } from "."
import type { InputSelectEmits, InputSelectProps } from "./useInputSelect"

export type InputTableProps<T extends Record<string, unknown> = Record<string, unknown>, C extends Cardinality = "single", S = string> = T extends Record<infer L, infer D>
? {
  columns: L[]
  rows: InputSelectProps<Record<L, D>, C>[`options`]
  id?: keyof T | ((row: T) => string)
  label?: Record<keyof T, S | ((cell: T[keyof T]) => S)>
}
: InputTableProps<Record<string, string>, C, S>

export type InputTableEmits<T extends Record<string, unknown> = Record<string, unknown>, C extends Cardinality = "single"> = T extends Record<infer L, infer D>
? InputSelectEmits<Record<L, D>, C>
: InputSelectEmits<Record<string, string>, C>

export interface InputTableOptions<C extends Cardinality = "single"> {
  cardinality: C
}

export type InputTable<T extends Record<string, unknown> = Record<string, unknown>, C extends Cardinality = "single", S = T> = T extends Record<infer L, infer D>
? {
  columns: {
    id: L
    label: string
  }[]
  rows: ReturnType<typeof useInputSelect<Record<L, D>, C, S>>
}
: InputTable<Record<string, string>, C>

export function useInputTable<T extends Record<string, unknown> = Record<string, unknown>, C extends Cardinality = "single", S = string>(props: InputTableProps<T, C>, emits: Emit<InputTableEmits<T, C>>, options?: Partial<InputTableOptions<C>>): InputTable<T, C, S> {
  return {
    columns: props.columns.map((column) => ({
      id: column,
      label: column.at(0).toUpperCase() + column.slice(1).toLowerCase(),
    })),
    rows: useInputSelect<T, C, S>({
      options: props.rows as T[],
      id: (row) => typeof props.id === "function"
        ? props.id(row) : props.id && row[props.id]
          ? `${row[props.id]}` : `${row[Object.keys(row)[0]]}`,
      label: (row) => Object.fromEntries(
        Object.entries(row)
          .map(([column, cell]) => [
            column,
            typeof props.label?.[column] === "function"
              ? props.label[column](cell)
              : typeof props.label?.[column] === "string" && cell[props.label?.[column]]
                ? cell[props.label?.[column]] : cell
          ])) as S
    }, emits, { cardinality: "single" as C, ...options }),
  } as InputTable<T, C, S>
}
