import eslint from "@eslint/js"
import teslint from "typescript-eslint"
import vue from "eslint-plugin-vue"
import tailwindcss from "eslint-plugin-tailwindcss"

export default teslint.config(
  eslint.configs.recommended,
  ...teslint.configs.strict,
  ...teslint.configs.stylistic,
  ...vue.configs["flat/recommended"],
  ...tailwindcss.configs["flat/recommended"],
  {
    ignores: [
      `dist/**/*`,
    ],
  },
  { 
    files: [
      `src/**/*.{ts,vue}`,
    ],
    languageOptions: {
      parserOptions: {
        parser: teslint.parser,
        project: [
          `./tsconfig.app.json`,
          `./tsconfig.node.json`,
        ],
        extraFileExtensions: [`.vue`],
        sourceType: `module`,
      },
    },
    plugins: {
      'typescript-eslint': teslint.plugin,
    },
    rules: {
      '@typescript-eslint/no-unused-vars': `warn`,
      "@typescript-eslint/consistent-type-imports": `warn`,
      "vue/multi-word-component-names": `off`,
    }
  },
  {
    files: [
      `src/components/*.vue`,
    ],
    rules: {
      "vue/multi-word-component-names": `error`,
    },
  },
  {
    rules: {
      "tailwindcss/no-custom-classname": [
        `warn`,
        {
          config: `./tailwind.config.js`,
          classRegex: `^twa-*$`,
          whitelist: [`placeholder`],
        },
      ],
    }
  }
)
