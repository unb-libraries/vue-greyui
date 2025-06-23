import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

// https://vitejs.dev/config/
export default defineConfig(({ command }) => ({
  plugins: [
    vue(),
    dts({
      outDir: "dist/types",
      entryRoot: "lib",
      include: ["lib/**/*.ts", "lib/**/*.vue"],
      exclude: ["lib/**/__tests__/**/*"],
      tsconfigPath: resolve(__dirname, "lib/tsconfig.json"),
    }),
  ],
  publicDir: command === `build` ? false : undefined,
  build: {
    lib: {
      // Could also be a dictionary or array of multiple entry points
      entry: {
        components: resolve(__dirname, "lib/components.ts"),
        composables: resolve(__dirname, "lib/composables.ts"),
        directives: resolve(__dirname, "lib/directives.ts"),
        utils: resolve(__dirname, "lib/utils.ts"),
      },
      name: 'GreyUI',
    },
    outDir: "dist/lib",
    emptyOutDir: true,
    rollupOptions: {
      // make sure to externalize deps that shouldn't be bundled
      // into your library
      external: ["vue"],
      output: {
        // Provide global variables to use in the UMD build
        // for externalized deps
        globals: {
          vue: "Vue",
        },
      },
    },
  },
  resolve: {
    alias: {
      "~": resolve("lib"),
    }
  },
  test: {
    environment: "happy-dom",
    reporters: ["default", "html"],
    coverage: {
      provider: "v8",
      include: ["lib/**/*.ts"],
      reporter: ["text", "html"],
      reportsDirectory: "./vitest/coverage",
    },
    include: ["lib/**/__tests__/*.{spec,test}.ts"],
  }
}))
