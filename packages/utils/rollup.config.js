// NOTICE: `npm:esbuild-register@3.x`包的作用是 rollup.config.js 能引入外部ts文件导出的配置
require('esbuild-register')

module.exports = require('@scripts/rollup/utils.ts')
