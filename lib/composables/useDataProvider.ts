import { computed, isRef, ref, type Ref } from "vue"

export interface DataProvider<T> {
  data: Ref<Record<string, T>>
  groups: Ref<Record<string, Record<string, T>>>
  keys: Ref<string[]>
  values: Ref<T[]>
  entries: Ref<[string, T][]>
  size: Ref<number>
  set: (data: T[]) => void
  add: (value: T) => void
  remove: (value: T) => void
  filter: (fn: DataFilter<T>) => void
  sort: (fn: (a: T, b: T) => number) => void
}

export type DataFilter<T> = (item: T, k: string, entries: [string, T][]) => boolean
export type DataSorter<T> = (a: T, b: T) => number

interface DataProviderOptions<T> {
  key: T extends object ? ((entry: T) => string) : T
  group: T extends object ? ((entry: T) => string) : T
}

function Key<T = unknown>(options?: Partial<DataProviderOptions<T>>): (entry: T) => string {
  return (item: T) => {
    if (typeof options?.key === 'function') {
      return options.key(item)
    } else if (typeof options?.key === 'string' && typeof item === 'object') {
      return (item as Record<keyof T, unknown>)[options.key as keyof T] as string
    } else if (typeof item === 'object') {
      return 'id' in item
        ? (item as Record<string, unknown>).id as string
        : (item as Record<string, unknown>)[Object.keys(item)[0]] as string
    } else if (typeof item === 'string' || typeof item === 'number') {
      return item as string
    }
  }
}

function Group<T = unknown>(options?: Partial<DataProviderOptions<T>>): (entry: T) => string {
  return (item: T) => {
    if (typeof options?.group === 'function') {
      return options.group(item)
    } else if (typeof options?.group === 'string' && typeof item === 'object') {
      return (item as Record<keyof T, unknown>)[options.group as keyof T] ?? 'default' as string
    }
    return options?.group ?? 'default'
  }
}

export function useDataProvider<T>(data: T[] | Ref<T[]>, options?: Partial<DataProviderOptions<T>>): DataProvider<T> {
  const getKey = Key<T>(options)
  const getGroup = Group<T>(options)

  const items = isRef(data) ? data : ref<T[]>(data)
  const filter = ref<DataFilter<T>>()
  const sort = ref<DataSorter<T>>()
  const map = computed<Record<string, T>>(() => {
    let data = Object.fromEntries(items.value.map(item => [getKey(item as T), item])) as Record<string, T>
    if (filter.value) data = Object.fromEntries(Object.entries(data).filter(([key, item], _, entries) => filter.value(item as T, key, entries)))
    if (sort.value) data = Object.fromEntries(Object
      .values(data)
      .sort(sort.value)
      .map(item => [getKey(item as T), item]))
    return data
  })
  
  return {
    data: map,
    keys: computed(() => Object.keys(map.value)),
    groups: computed(() => Object.entries(map.value)
      .reduce((acc, [key, item]) => {
        const group = getGroup(item)
        if (!acc[group]) acc[group] = {}
        acc[group][key] = item
        return acc
      }, {} as Record<string, Record<string, T>>)),
    values: computed(() => Object.values(map.value)),
    entries: computed(() => Object.entries(map.value)),
    size: computed(() => Object.keys(map.value).length),
    add: (item: T) => { items.value = [...items.value as T[], item] },
    remove: (item: T) => {
      const itemKey = getKey(item)
      items.value = Object.values(map.value).filter((item) => getKey(item) !== itemKey)
    },
    filter: (fn) => filter.value = fn as DataFilter<T>,
    set: (newData: T[]) => items.value = newData,
    sort: (fn) => sort.value = fn,
  }
}
