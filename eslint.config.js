const js = require('@eslint/js');
const tseslint = require('typescript-eslint');
const eslintConfigPrettier = require('eslint-config-prettier');

module.exports = [
  js.configs.recommended,
  ...tseslint.configs.recommended,
  eslintConfigPrettier,
  {
    files: ['**/*.{js,ts,tsx}'],
    ignores: [
      'node_modules/**',
      'dist/**',
      'build/**',
      '*.d.ts',
      'coverage/**',
      '.husky/**',
      'libs/*/dist/**',
      'apps/*/dist/**',
      '**/*.spec.ts',
      '**/*.test.ts',
      '**/jest.config.ts',
      '**/jest-e2e.json',
    ],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      parser: tseslint.parser,
      parserOptions: {
        tsconfigRootDir: __dirname,
      },
    },
    plugins: {
      '@typescript-eslint': tseslint.plugin,
    },
    rules: {
      // TypeScript specific rules
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-require-imports': 'off', // Allow require in config files

      // General JavaScript/TypeScript rules
      'prefer-const': 'error',
      'no-var': 'error',
      'no-console': 'warn',
      eqeqeq: ['error', 'always'],
      'no-duplicate-imports': 'error',
      'prefer-arrow-callback': 'warn',
      'prefer-template': 'error',
      'object-shorthand': 'error',

      // NestJS specific rules - relaxed
      'max-classes-per-file': 'off', // Allow multiple classes per file for DTOs
      'class-methods-use-this': 'off',

      // Code quality - relaxed but still enforced
      complexity: ['warn', 20],
      'max-depth': ['warn', 5],
      'max-nested-callbacks': ['warn', 4],
      'max-params': ['warn', 6],

      // Disabled rules that are too strict for existing codebase
      'no-unused-vars': 'off', // Using TypeScript version instead
    },
  },
  // Specific configuration for config files
  {
    files: ['*.config.js', 'eslint.config.js', 'commitlint.config.js'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        module: 'readonly',
        require: 'readonly',
        __dirname: 'readonly',
        exports: 'writable',
      },
    },
    rules: {
      '@typescript-eslint/no-require-imports': 'off',
      'no-undef': 'off',
    },
  },
];
