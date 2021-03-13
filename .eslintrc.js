module.exports = {
  extends: [
    // add more generic rulesets here, such as:
    // 'eslint:recommended',
    'plugin:vue/recommended'
  ],
  parserOptions: {
       parser: 'babel-eslint'
  },
  rules: {
    // override/add rules settings here, such as:
    'vue/no-unused-vars': 'off'
  }
}