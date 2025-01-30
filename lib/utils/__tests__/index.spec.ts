import { describe, expect, test, vi } from "vitest"
import { getRenewableTimeout } from "../index"

describe("utils", () => {
  test("getRenewableTimeout", () => {
    const fn = vi.fn()
    vi.useFakeTimers()
    
    const timeout = getRenewableTimeout(fn, 1000)
    const start = Date.now()
    for (let i = 0; i < 5; i++) {
      timeout()
      vi.advanceTimersByTime(200)
    }
    vi.advanceTimersByTime(1000)
    const end = Date.now()

    expect(fn).toHaveBeenCalledTimes(1)
    expect(end - start).toBeGreaterThanOrEqual(2000)
  })
})
