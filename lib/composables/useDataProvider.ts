import { computed, ref, type Ref } from "vue"

export interface DataProvider<T = unknown> {
  data: Ref<T[]>
  add: (item: T) => void
  has: (item: T) => boolean
  filter: (fn: (item: T) => boolean) => void
  remove: (index: number) => void
  set: (items: T[]) => void
  sort: (fn: (a: T, b: T) => number) => void
}

type DataFilter<T> = (item: T, index: number, arr: T[]) => boolean
type DataSorter<T> = (a: T, b: T) => number

export function useDataProvider<T = unknown>(data: T[]): DataProvider<T> {
  const items = ref<T[]>(data)
  const filter = ref<DataFilter<T>>()
  const sort = ref<DataSorter<T>>()
  
  return {
    data: computed<T[]>(() => {
      let data = items.value as T[]
      if (filter.value) data = data.filter(filter.value)
      if (sort.value) data.sort(sort.value)
      return data
    }),
    add: (item) => items.value = [...items.value as T[], item],
    has: (item) => (items.value as T[]).includes(item),
    filter: (fn) => filter.value = fn,
    remove: (index) => items.value = items.value.filter((_, i, arr) => index >= 0 ? i !== index : i !== arr.length + index),
    set: (data) => items.value = data,
    sort: (fn) => sort.value = fn
  }
}
