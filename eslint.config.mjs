import eslint from '@eslint/js'
import tsParser from '@typescript-eslint/parser'
import tsPlugin from '@typescript-eslint/eslint-plugin'
import vue from 'eslint-plugin-vue'

const runtimeGlobals = {
  uni: 'readonly',
  getCurrentPages: 'readonly',
}

const typeScriptRules = {
  ...tsPlugin.configs.recommended.rules,
  // TypeScript 编译器负责全局类型名（如 RequestInit）的校验。
  'no-undef': 'off',
  '@typescript-eslint/no-explicit-any': 'off',
  'no-console': 'warn',
  'no-debugger': 'error',
  'no-unused-vars': 'off',
  '@typescript-eslint/no-unused-vars': [
    'warn',
    { argsIgnorePattern: '^_', varsIgnorePattern: '^_', caughtErrors: 'none' },
  ],
  'vue/multi-word-component-names': 'off',
  'vue/no-unused-vars': 'warn',
  'vue/html-self-closing': [
    'error',
    {
      html: { void: 'always', normal: 'never', component: 'always' },
      svg: 'always',
      math: 'always',
    },
  ],
  // Prettier 负责模板换行，避免与格式化器重复报错。
  'vue/max-attributes-per-line': 'off',
  'vue/html-closing-bracket-newline': 'off',
  'vue/html-indent': 'off',
  'vue/multiline-html-element-content-newline': 'off',
  'vue/singleline-html-element-content-newline': 'off',
}

export default [
  {
    ignores: ['dist/**', 'unpackage/**', 'node_modules/**', '.npm-cache/**'],
  },
  eslint.configs.recommended,
  ...vue.configs['flat/recommended'],
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parser: tsParser,
      globals: runtimeGlobals,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
    },
    rules: typeScriptRules,
  },
  {
    files: ['**/*.vue'],
    languageOptions: {
      globals: runtimeGlobals,
      parserOptions: {
        parser: tsParser,
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
    },
    rules: typeScriptRules,
  },
  {
    files: ['**/*.{js,mjs,cjs}'],
    rules: {
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
    },
  },
]
