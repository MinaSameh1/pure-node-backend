module.exports = {
  env: {
    es2021: true,
    node: true,
  },
  extends: ['eslint:recommended', 'plugin:prettier/recommended'],
  des: [
    {
      env: {
        node: true,
      },
      files: ['.eslintrc.{js,cjs}'],
      parserOptions: {
        sourceType: 'script',
      },
    },
  ],
  plugins: ['prettier'],
  rules: {},
}
