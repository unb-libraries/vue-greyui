import type { Component } from 'vue'

class LayoutLoaderSingleton {
  private layouts = new Map<string, Component>()
  private basePath = ''

  setLayoutBasePath(path: string) {
    this.basePath = path.replace(/\/+$/, '')
  }

  registerLayouts(newLayouts: Record<string, Component>) {
    Object.entries(newLayouts).forEach(([key, layout]) => {
      let path = key.startsWith(this.basePath) ? key.replace(this.basePath, '') : `${this.basePath}/${key}`
      path = path.replace(/^\/+/, '')
      path = path.endsWith('.vue') ? path : `${path}.vue`
      this.layouts.set(path.toLowerCase(), layout)
    })
  }
  
  loadLayout(nameOrLayout?: string | Component): Component {
    if (!nameOrLayout || typeof nameOrLayout === 'string') {
      const name = nameOrLayout as string ?? 'Default'
      const path = name.toLowerCase().replace(/^\/+/, '').replace(/\/+$/, '')
      const layout = this.layouts.get(path.endsWith('.vue') ? path : `${path}.vue`)
      if (layout) {
        return layout
      }
      // fallback: empty layout
      return {
        render() {
          return null
        }
      }
    } else {
      return nameOrLayout as Component
    }
  }
}

const globalAny = globalThis as any
if (!globalAny.__vue_greyui_layoutLoader) {
  globalAny.__vue_greyui_layoutLoader = new LayoutLoaderSingleton()
}
export const layoutLoader: LayoutLoaderSingleton = globalAny.__vue_greyui_layoutLoader
