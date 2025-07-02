import vue from '@vitejs/plugin-vue'
import autoprefixer from 'autoprefixer'
import { resolve } from 'path'
import tailwind from 'tailwindcss'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    vue(),
  ],
  css: {
    postcss: {
      plugins: [
        tailwind,
        autoprefixer,
      ],
    },
  },
  server: {
    fs: {
      allow: [
        // Allow serving files from the playground root
        resolve(__dirname),
        // Allow serving files from the project root
        resolve(__dirname, '../'),
        // Allow serving files from playground node_modules (should be default, but explicit is safe)
        resolve(__dirname, 'node_modules'),
        // Allow serving files from root node_modules
        resolve(__dirname, '../node_modules'),
      ],
    },
  },
  resolve: {
    alias: {
      '~': resolve(__dirname, '../lib'),
      '@playground': resolve(__dirname, './src'),
    }
  }
})