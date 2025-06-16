import { describe, expect, test } from 'vitest'
import { useDataProvider } from '../useDataProvider'

describe('useDataProvider', () => {
  const items = ["grey", ["dark-grey", "Dark grey"], { id: "light-grey", label: "Light grey" }]

  test("data", () => {
    const provider = useDataProvider(items)
    expect(provider.size.value).toBe(3)
    expect(provider.data.value).toEqual({
      [`${items[0]}`]: {id: items[0] },
      [`${items[1][0]}`]: { ...(items[1] as string[]), id: items[1][0] },
      [`${items[2]['id']}`]: { ...(items[2] as Record<string, string>), id: items[2]['id'] } })
  })

  describe("groups", () => {
    test("default group", () => {
      const provider = useDataProvider(["grey", "dark-grey", "light-grey"])
      expect(provider.groups.keys.value).toEqual(["default"])
    })
    
    test("custom group", () => {
      const provider = useDataProvider(items, { group: (item) => typeof item === 'string' ? 'base' : 'shades' })
      expect(provider.groups.keys.value).toEqual(["base", "shades"])
      expect(Object.values(provider.groups.data.value["base"]).map(({ id }) => id)).toEqual(["grey"])
      expect(Object.values(provider.groups.data.value["shades"]).map(({ id }) => id)).toEqual(["dark-grey", "light-grey"])
    })
  })
    
  test("add", () => {
    const provider = useDataProvider(items)
    provider.add("mid-grey")
    expect(provider.size.value).toBe(4)
    expect(provider.data.value['mid-grey']).toEqual({ id: "mid-grey" })
  })
  
  test("filter", () => {
    const provider = useDataProvider(items)
    provider.filter(item => !/.*-.*/.test(typeof item === 'string' ? item : item[0] ?? item['id']))
    expect(provider.size.value).toBe(1)
  })
  
  test("remove", () => {
    const provider = useDataProvider([...items, "mid-grey"])
    provider.remove(0)
    expect(provider.size.value).toBe(3)
    expect(provider.keys.value.at(0)).toEqual("dark-grey")
    
    provider.remove(-1)
    expect(provider.size.value).toBe(2)
    expect(provider.keys.value.at(-1)).toBe("light-grey")
    
    provider.remove(1)
    expect(provider.size.value).toBe(1)
    expect(provider.keys.value.at(-1)).toBe("dark-grey")
    
    provider.remove(1)
    expect(provider.size.value).toBe(1)
  })
  
  test("set", () => {
    const provider = useDataProvider(items)
    provider.set(["almost black", "almost white"])
    expect(provider.data.value).toEqual({ "almost black": { id: "almost black" }, "almost white": { id: "almost white" } })
  })
  
  test("sort", () => {
    const provider = useDataProvider(items)
    provider.sort(({ id: a }, { id: b }) => a < b ? -1 : a > b ? 1 : 0)
    expect(provider.keys.value).toEqual(["dark-grey", "grey", "light-grey"])
  })
})
