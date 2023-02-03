import { resolve } from 'path'

// Since most packages in your node_modules folder are probably legacy CommonJS rather than JavaScript modules
import commonjs from '@rollup/plugin-commonjs'
import json from '@rollup/plugin-json'
// A Rollup plugin which locates modules using the Node resolution algorithm, for using third party modules in node_modules
import nodeResolve from '@rollup/plugin-node-resolve'
import dts from 'rollup-plugin-dts'
import esbuild from 'rollup-plugin-esbuild'

import type { RollupOptions } from 'rollup'

// 处理输入输出文件
const input = resolve(__dirname, '../../', 'packages/utils/src/index.ts')
const createOutputFile = (filename: string) => resolve(__dirname, '../../', 'packages/utils/dist', filename)

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
      nodeResolve(),
      commonjs(),
    ],
    output: [
      {
        file: createOutputFile('index.mjs'),
        // https://rollupjs.org/configuration-options/#output-format
        format: 'es',
      },
      {
        file: createOutputFile('index.cjs'),
        format: 'cjs',
      },
      {
        file: createOutputFile('index.iife.js'),
        format: 'iife',
        name: 'OdinlinUtils',
        extend: true,
        globals: {},
        plugins: [],
      },
      {
        file: createOutputFile('index.iife.min.js'),
        format: 'iife',
        name: 'OdinlinUtils',
        extend: true,
        globals: {},
        plugins: [
          {
            name: 'esbuild-minifer',
            renderChunk: esbuild({ minify: true }).renderChunk,
          },
        ],
      },
    ],
  },
  {
    input,
    external: [],
    plugins: [
      dts({ respectExternal: true }),
    ],
    output: {
      file: createOutputFile('index.d.ts'),
      format: 'es',
    },
  },
]

export default configs
