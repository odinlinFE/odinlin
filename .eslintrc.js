/**
 * @desc 优先级: .eslintrc.js > .eslintrc.yaml > .eslintrc.yml > .eslintrc.json > .eslintrc > package.json
 *
 * @desc "off" 或 0 - 关闭规则
 * @desc "warn" 或 1 - 开启规则，使用警告级别的错误：warn (不会导致程序退出)
 * @desc "error" 或 2 - 开启规则，使用错误级别的错误：error (当被触发的时候，程序会退出)
 *
 * @desc Globals - 配置额外的全局变量("writable" 以允许重写变量，或 "readonly" 不允许重写变量)
 */
module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
  },
  extends: [
    '@antfu/eslint-config-vue',
    '@antfu/eslint-config-react',
  ],
  rules: {
    /**
     * @notice 下面标记注释是给terser这个压缩工具使用的
     * `\/* @__INLINE__ *\/` - forces a function to be inlined somewhere.
     * `\/* @__NOINLINE__ *\/` - Makes sure the called function is not inlined into the call site.
     *  `\/* @__PURE__ *\/` - Marks a function call as pure. That means, it can safely be dropped. (如果没用到，可以放心删出)
     */
    'spaced-comment': ['error', 'always', { exceptions: ['#__PURE__'] }],
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'eslint-comments/no-unlimited-disable': 'off',
    '@typescript-eslint/no-unused-vars': 1,
    'react/prop-types': 0,
    // curly braces in object
    'curly': ['error', 'multi-line', 'consistent'],
    // 每行最大语句数, 例如：`if (语句1) { 语句2 }`
    'max-statements-per-line': ['error', { max: 2 }],
    // [import/order](https://github.com/import-js/eslint-plugin-import/blob/main/docs/rules/order.md)
    'import/order': ['error',
      {
        'groups': ['builtin', 'external', ['internal', 'parent', 'sibling', 'index'], 'unknown', 'object', 'type'],
        'newlines-between': 'always',
        'pathGroupsExcludedImportTypes': ['builtin'],
        'warnOnUnassignedImports': false,
      },
    ],
  },
  overrides: [
    {
      files: ['**/*.md', '**/*.md/*.*', 'scripts/*.ts', '*.test.ts'],
      rules: {
        'no-alert': 'off',
        'no-console': 'off',
        'no-undef': 'off',
        'no-unused-vars': 'off',
        'no-restricted-imports': 'off',
        '@typescript-eslint/no-unused-vars': 'off',
        '@typescript-eslint/no-redeclare': 'off',
      },
    },
  ],
}
