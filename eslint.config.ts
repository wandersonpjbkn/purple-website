import { globalIgnores } from 'eslint/config'
import { defineConfigWithVueTs, vueTsConfigs } from '@vue/eslint-config-typescript'
import pluginVue from 'eslint-plugin-vue'
import skipFormatting from '@vue/eslint-config-prettier/skip-formatting'

// To allow more languages other than `ts` in `.vue` files, uncomment the following lines:
// import { configureVueProject } from '@vue/eslint-config-typescript'
// configureVueProject({ scriptLangs: ['ts', 'tsx'] })
// More info at https://github.com/vuejs/eslint-config-typescript/#advanced-setup

// import.meta.env.VITE_ENV === 'production'

export default defineConfigWithVueTs(
  {
    name: 'app/files-to-lint',
    files: ['**/*.{ts,mts,tsx,vue}'],
  },

  pluginVue.configs['flat/recommended'],
  vueTsConfigs.recommended,

  {
    name: 'app/vite-config-overrides',
    files: ['vite.config.{js,ts,mjs,mts}'],
    rules: {
      'import/no-extraneous-dependencies': 'off',
    },
  },

  {
    name: 'app/rules',
    rules: {
      // Vue specific rules
      'vue/no-v-html': 'off',

      // Console and debugging
      'no-console': 'off',
      'no-debugger': 'warn',

      // Bitwise and syntax
      // ...

      // Naming conventions
      // ...

      // Function and parameter rules
      // ...

      // Loop and flow control
      'no-await-in-loop': 'off',
      'no-continue': 'off',
      'no-nested-ternary': 'off',
      'no-plusplus': [
        'error',
        {
          allowForLoopAfterthoughts: true,
        },
      ],

      // Global and require
      'no-restricted-globals': 'off',
      'global-require': 'off',

      // Operators and templates
      'template-curly-spacing': 'off',

      // Import/Export rules
      'import/prefer-default-export': 'off',

      // TypeScript specific overrides
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
    },
  },

  globalIgnores([
    '**/dist/**',
    '**/dist-ssr/**',
    '**/dev-dist/**',
    '**/coverage/**',
    '**/src/components/_**/*',
    '**/src/views/_**/*',
  ]),

  skipFormatting,
)
