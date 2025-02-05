import { beforeEach, describe, expect, test } from "vitest"
import { useDataProvider, type DataProvider } from "../useDataProvider"

describe('useDataProvider', () => {
  const items = ["grey", "dark-grey", "mid-grey", "light-grey"]
  let provider: DataProvider<string>

  beforeEach(() => {
    provider = useDataProvider(items)
    expect(provider.data.value).toEqual(items)
  })

  test("add", () => {
    const item = "ultra-light-grey"
    provider.add(item)
    expect(provider.data.value).toHaveLength(5)
    expect(provider.data.value.at(-1)).toBe(item)
  })
  
  test("has", () => {
    expect(provider.has("grey")).toBe(true)
    expect(provider.has("black")).toBe(false)
  })

  test("filter", () => {
    provider.filter(item => !/.*-.*/.test(item))
    expect(provider.data.value).toHaveLength(1)
  })

  test("remove", () => {
    provider.remove(0)
    expect(provider.data.value).toHaveLength(3)
    expect(provider.data.value[0]).toEqual("dark-grey")
    
    provider.remove(-1)
    expect(provider.data.value).toHaveLength(2)
    expect(provider.data.value.at(-1)).toBe("mid-grey")

    provider.remove(1)
    expect(provider.data.value).toHaveLength(1)
    expect(provider.data.value.at(-1)).toBe("dark-grey")

    provider.remove(1)
    expect(provider.data.value).toHaveLength(1)
  })

  test("set", () => {
    const data = ["almost black", "almost white"]
    provider.set(data)
    expect(provider.data.value).toEqual(data)
  })

  test("sort", () => {
    provider.sort((a, b) => a < b ? -1 : a > b ? 1 : 0)
    expect(provider.data.value).toEqual(["dark-grey", "grey", "light-grey", "mid-grey"])
  })
})
