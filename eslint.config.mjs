import eslint from "@eslint/js"
import teslint from "typescript-eslint"
import vue from "eslint-plugin-vue"

export default teslint.config(
  eslint.configs.recommended,
  ...teslint.configs.strict,
  ...teslint.configs.stylistic,
  ...vue.configs["flat/recommended"],
  {
    ignores: [
      `dist/**/*`,
    ],
  },
  { 
    files: [
      `lib/**/*.ts`,
    ],
    languageOptions: {
      parserOptions: {
        parser: teslint.parser,
        project: [
          `./lib/tsconfig.json`,
          `./tsconfig.json`,
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
    }
  },
  {
    files: [
      `lib/**/__test__/*.{spec,test}.ts`,
    ],
    rules: {
      "@typescript-eslint/no-unused-vars": `off`,
      "@typescript-eslint/no-empty-function": `off`,
    }
  }
)
