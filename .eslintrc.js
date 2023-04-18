module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
    es6: true,
  },
  extends: [
    'eslint:recommended',
  ],
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 12,
    ecmaFeatures: {
      jsx: true,
    },
  },
  rules: {
    'no-useless-escape': 0,
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
  },
}
