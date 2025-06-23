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
  resolve: {
    alias: {
      '~': resolve(__dirname, '../lib'),
      '@playground': resolve(__dirname, './src'),
    }
  }
})