import { computed } from "vue"
import { type DataProvider, useDataProvider } from "./useDataProvider"

export type OptArr = [string, string]
export type Option<T extends Record<string, unknown> = Record<string, unknown>> = string | OptArr | T
export type OptObject<T extends Option> = Exclude<T, string | OptArr>

export interface InputOptionsProviderOptions<T extends Option, S> {
  id: (item: OptObject<T>) => string | undefined
  label: (item: T) => S | undefined
}

export type InputOptionsProvider<S> = Omit<DataProvider<Option>, "data"> & {
  options: DataProvider<[string, S]>["data"]
}

export function useInputOptionsProvider<S, T extends Option>(data: T[], options?: Partial<InputOptionsProviderOptions<T, S>>): InputOptionsProvider<S> {
  const { data: inputData, ...inputProvider } = useDataProvider<T>(data)
  const items = computed(() => inputData.value.map<[string, S]>((item: T): [string, S] => {
    if (typeof item === 'string') {
      return [item, options?.label?.(item) ?? item as S]
    } else if (Array.isArray(item)) {
      return [item[0], options?.label?.(item) ?? item[1] as S]
    } else {
      return [
        options?.id?.(item as OptObject<T>) ?? (item.id ? `${item.id}` : `${Object.values(item)[0]}`),
        options?.label?.(item) ?? ((item.label ? `${item.label}` : `${Object.values(item)[0]}`) as S)
      ]
    }
  }))

  return {
    options: items,
    ...inputProvider,
  }
}