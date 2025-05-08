import { describe, expect, test, vi } from 'vitest'
import { defineComponent } from 'vue'

const RenderlessComponent = defineComponent({
  props: {
    layout: {
      type: String,
      default: 'default'
    },
  },
})

const Light = defineComponent({
  template: `<div>Light grey</div>`
})

const Dark = defineComponent({
  template: `<div>Dark grey</div>`
})

describe('layout', () => {
  test('register', async () => {
    const { registerLayout, getLayouts } = await import('~/utils')
    registerLayout(Light, RenderlessComponent, { name: 'light', default: true })
    registerLayout(Dark, RenderlessComponent, { name: 'dark' })
    expect(getLayouts().get(RenderlessComponent)).toEqual({
      light: Light,
      dark: Dark,
      default: Light,
    })
  })
  
  test('resolve', async () => {
    const { resolveLayout } = await import('~/utils')
    vi.mock('~/utils/layout', async (importOriginal) => {
        return {
          ...await importOriginal(),
          getLayouts() {
            return new Map()
              .set(RenderlessComponent, {
                light: Light,
                dark: Dark,
                default: Light,
              })
          }
        }
      })

    expect(resolveLayout(RenderlessComponent)).toBe(Light)
    expect(resolveLayout(RenderlessComponent, 'light')).toBe(Light)
    expect(resolveLayout(RenderlessComponent, 'dark')).toBe(Dark)
    expect(() => resolveLayout(RenderlessComponent, 'unknown')).toThrowError()
  })
})