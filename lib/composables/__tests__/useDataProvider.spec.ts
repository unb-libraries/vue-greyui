import { describe, expect, test } from 'vitest'
import { useDataProvider } from '../useDataProvider'

describe('useDataProvider', () => {
  const items = ["grey", ["dark-grey", "Dark grey"], { id: "light-grey", label: "Light grey" }]

  test("data", () => {
    const { data } = useDataProvider(items)
    expect(data.value).toEqual({
      grey: "grey",
      "dark-grey": ["dark-grey", "Dark grey"],
      "light-grey": { id: "light-grey", label: "Light grey" },
    })
  })
  
  describe("groups", () => {
    test("default group", () => {
      const { groups } = useDataProvider(items)
      expect(groups.value).toEqual({
        default: {
          grey: "grey",
          "dark-grey": ["dark-grey", "Dark grey"],
          "light-grey": { id: "light-grey", label: "Light grey" }
        }
      })
    })
    
    test("custom group", () => {
      const { groups } = useDataProvider(items, { group: (item) => typeof item === 'string' ? 'base' : 'shades' })
      expect(groups.value).toEqual({
        base: { grey: "grey" },
        shades: {
          "dark-grey": ["dark-grey", "Dark grey"],
          "light-grey": { id: "light-grey", label: "Light grey" }
        }
      })
    })
  })

  test("keys", () => {
    const { keys } = useDataProvider(items)
    expect(keys.value).toEqual(["grey", "dark-grey", "light-grey"])
  })

  test("values", () => {
    const { values } = useDataProvider(items)
    expect(values.value).toEqual(["grey", ["dark-grey", "Dark grey"], { id: "light-grey", label: "Light grey" }])
  })

  test("entries", () => {
    const { entries } = useDataProvider(items)
    expect(entries.value).toEqual([
      ["grey", "grey"],
      ["dark-grey", ["dark-grey", "Dark grey"]],
      ["light-grey", { id: "light-grey", label: "Light grey" }]
    ])
  })

  test('size', () => {
    const { size } = useDataProvider(items)
    expect(size.value).toBe(3)
  })

  test('set', () => {
    const { data, set } = useDataProvider(items)
    set(["almost black", "almost white"])
    expect(data.value).toEqual({
      "almost black": "almost black",
      "almost white": "almost white",
    })
  })

  test('add', () => {
    const { data, add } = useDataProvider(items)
    add("mid-grey")
    expect(data.value['mid-grey']).toEqual("mid-grey")
  })

  test("remove", () => {
    const { keys, remove } = useDataProvider(items)
    remove("dark-grey")
    expect(keys.value).toEqual(["grey", "light-grey"])
  })

  test('filter', () => {
    const { keys, filter } = useDataProvider(items)
    filter(item => !/.*-.*/.test(typeof item === 'string' ? item : item[0] ?? item['id']))
    expect(keys.value).toEqual(["grey"])
  })

  test('sort', () => {
    const { keys, sort } = useDataProvider(items)
    sort((a, b) => {
      const vA = a[0] ?? a['id'] ?? a
      const vB = b[0] ?? b['id'] ?? b
      return vA < vB ? -1 : vA > vB ? 1 : 0
    })
    expect(keys.value).toEqual(["dark-grey", "grey", "light-grey"])
  })
})
