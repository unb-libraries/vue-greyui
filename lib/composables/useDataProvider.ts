import { computed, ref, type Ref } from "vue"

export type ProviderT<T> = T extends object ? { id: string } & T : { id: string }
export interface DataProvider<T = unknown> {
  data: Ref<Record<string, ProviderT<T>>>
  add: (item: T) => void
  keys: Ref<string[]>
  values: Ref<ProviderT<T>[]>
  entries: Ref<[string, ProviderT<T>][]>
  size: Ref<number>
  filter: (fn: DataFilter<T>) => void
  remove: (index: number) => void
  set: (items: T[]) => void
  sort: (fn: (a: ProviderT<T>, b: ProviderT<T>) => number) => void
}

export type DataFilter<T> = (item: ProviderT<T>, index: number, arr: ProviderT<T>[]) => boolean
export type DataSorter<T> = (a: ProviderT<T>, b: ProviderT<T>) => number

interface DataProviderOptions<T> {
  key: T extends object ? keyof T | ((item: T, index: number, items: T[]) => string) : T
}

export function useDataProvider<T = unknown>(data: T[], options?: Partial<DataProviderOptions<T>>): DataProvider<T> {
  const items = ref<T[]>(data)
  const filter = ref<DataFilter<T>>()
  const sort = ref<DataSorter<T>>()

  const getKey = (item: T, index: number, items: T[]) => {
    if (typeof options?.key === 'function') {
      return options.key(item, index, items)
    } else if (typeof options?.key === 'string' && typeof item === 'object') {
      return (item as Record<keyof T, unknown>)[options.key as keyof T] as string
    } else if (!options?.key && typeof item === 'object') {
      return 'id' in item
        ? (item as Record<string, unknown>).id as string
        : (item as Record<string, unknown>)[Object.keys(item)[0]] as string
    } else if (typeof item === 'string' || typeof item === 'number') {
      return item as string
    }
  }

  const map = computed<Record<string, ProviderT<T>>>(() => {
    let data = (items.value as T[])
      .filter(item => ![undefined, null].includes(item))
      .map((item, i, arr) => {
        const key = getKey(item, i, arr)
        return typeof item !== 'object' ? { id: String(item) } : { ...item, id: key }
      }) as ProviderT<T>[]
    if (filter.value) data = data.filter(filter.value)
    if (sort.value) data.sort(sort.value)
    return Object.fromEntries(data.map(item => [item.id, item]))
  })
  
  return {
    data: map,
    keys: computed(() => Object.keys(map.value)),
    values: computed(() => Object.values(map.value) as ProviderT<T>[]),
    entries: computed(() => Object.entries(map.value) as [string, ProviderT<T>][]),
    size: computed(() => Object.keys(map.value).length),
    add: (item) => items.value = [...items.value as T[], item],
    filter: (fn) => filter.value = fn as DataFilter<T>,
    remove: (index) => items.value =
      items.value.filter((_, i, arr) => index >= 0
        ? i !== index
        : i !== arr.length + index),
    set: (data) => items.value = data,
    sort: (fn) => sort.value = fn,
  }
}
