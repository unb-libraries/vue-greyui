import type { Component } from 'vue'

interface LayoutOptions {
  name: string
  default: boolean
}

const layouts = new Map<Component, Record<string, Component>>()
export function getLayouts() {
  return layouts
}

export function registerLayout(layout: Component, component: Component, options?: Partial<LayoutOptions>) {
  const layoutName = options?.name || 'default'
  layouts.set(component, { ...getLayouts().get(component) || {}, [layoutName]: layout })
  if (options?.default) {
    registerLayout(layout, component, { name: 'default' })
  }
}

export function resolveLayout(component: Component, layoutName?: string) {
  const layout = getLayouts().get(component)?.[layoutName || 'default']
  if (layout) {
    return layout
  }
  throw new Error(`Layout "${layoutName || 'default'}" not found${ component.name && ` for component "${component.name}"` || '' }`)
}
