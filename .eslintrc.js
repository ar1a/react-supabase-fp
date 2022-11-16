/* eslint-disable functional/immutable-data */
/* eslint-disable functional/no-expression-statement */
module.exports = {
  env: {
    browser: true,
    node: true,
    es2020: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:functional/lite',
    'plugin:functional/stylitic',
    'plugin:functional/external-recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: 'module',
  },
  plugins: ['react', '@typescript-eslint', 'eslint-plugin-tsdoc', 'functional'],
  rules: {
    'tsdoc/syntax': 'warn',
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
};
