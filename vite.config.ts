import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'
import type { ViteUserConfig } from "vitest/config"

// https://vitejs.dev/config/
export default defineConfig(({ command}): ViteUserConfig => ({
  plugins: [
    vue(),
    dts({
      outDir: "dist/types",
      include: ["lib/**/*.ts"],
      exclude: ["lib/**/__tests__/**/*"],
      tsconfigPath: resolve(__dirname, "lib/tsconfig.json"),
    }),
  ],
  publicDir: command === `build` ? false : undefined,
  build: {
    lib: {
      // Could also be a dictionary or array of multiple entry points
      entry: {
        components: resolve(__dirname, "lib/components/index.ts"),
        composables: resolve(__dirname, "lib/composables/index.ts"),
        directives: resolve(__dirname, "lib/directives/index.ts"),
        utils: resolve(__dirname, "lib/utils/index.ts"),
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
