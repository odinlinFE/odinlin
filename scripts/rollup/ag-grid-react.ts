import { resolve } from 'path'

// Since most packages in your node_modules folder are probably legacy CommonJS rather than JavaScript modules
import commonjs from '@rollup/plugin-commonjs'
import json from '@rollup/plugin-json'
// A Rollup plugin which locates modules using the Node resolution algorithm, for using third party modules in node_modules
// import nodeResolve from '@rollup/plugin-node-resolve'
import dts from 'rollup-plugin-dts'
import esbuild from 'rollup-plugin-esbuild'
import postcss from 'rollup-plugin-postcss'

import type { RollupOptions } from 'rollup'

// 处理输入输出文件
const input = resolve(__dirname, '../../', 'packages/ag-grid-react/src/index.ts')
const inputLess = resolve(__dirname, '../../', 'packages/ag-grid-react/src/index.less')
const createOutputFile = (filename: string) => resolve(__dirname, '../../', 'packages/ag-grid-react/dist', filename)

/**
 * @title rollup configure
 */
const configs: RollupOptions[] = [
  {
    input,
    external: [],
    plugins: [
      esbuild(),
      json(),
      // NOTICE: resolveOnly表示仅解析匹配的依赖，不解析其他依赖。解析的依赖会被build。
      // nodeResolve({
      //   resolveOnly: ['lodash-es'],
      // }),
      commonjs(),
    ],
    output: [
      {
        file: createOutputFile('index.mjs'),
        format: 'es',
      },
      {
        file: createOutputFile('index.cjs'),
        format: 'cjs',
      },
    ],
  },
  {
    input,
    external: [],
    plugins: [
      // 该插件默认将所有外部库标记为“外部”， 从而防止它们被捆绑。
      // 如果将 respectExternal 选项设置为 true，插件将不会执行 任何默认分类，而是使用“外部”选项作为 通过汇总配置。
      dts({ respectExternal: false }),
    ],
    output: {
      file: createOutputFile('index.d.ts'),
      format: 'es',
    },
  },
  {
    input: inputLess,
    external: [],
    plugins: [
      postcss({ modules: false, extract: true }),
    ],
    output: {
      file: createOutputFile('index.css'),
      format: 'es',
      exports: 'default',
    },
  },
]

export default configs
