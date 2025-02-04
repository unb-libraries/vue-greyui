import { describe, expect, test } from "vitest"
import { useInputOptionsProvider } from "../useInputOptionsProvider"
import type { Option, OptArr, OptObject } from "../useInputOptionsProvider"

describe('useInputOptionsProvider', () => {
  type Item = Option<{ id: string, uid: string, label: string, color: string }>
  const items: [string, OptArr, OptObject<Item>] = [
    "grey",
    ["darkgrey", "Dark grey"],
    {
      id: "lightgrey",
      uid: "rt56jk",
      label: "Light grey",
      color: "fafafa",
    }
  ]

  test("default ID / Label", () => {
    const { options } = useInputOptionsProvider(items)
    const [first, second, third] = items
    expect(options.value).toEqual([[first, first], second, [third.id, third.label]])
  })

  test("custom ID / Label", () => {
    const { options } = useInputOptionsProvider(items, {
      id: ({ uid }) => uid,
      label: (item) => {
        return typeof item === 'string'
          ? item
          : Array.isArray(item)
            ? item[1]
            : item.color
      }
    })
    const [first, second, third] = items
    expect(options.value).toEqual([[first, first], second, [third.uid, third.color]])
  })
})
