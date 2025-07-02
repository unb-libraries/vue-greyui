import { HstVue } from '@histoire/plugin-vue'
import { defineConfig } from 'histoire'
import tailwindconfig from './tailwind.config'

export default defineConfig({
  plugins: [HstVue()],
  setupFile: 'histoire.setup.ts',
  theme: {
    colors: {
      gray: {
        700: tailwindconfig.theme.colors['base-darker-400'],
      },
    },
    logoHref: '/',
  },
  tree: {
    groups: [
      { id: 'widgets', title: 'Widgets' },
    ]
  }
})
