import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import { apiExtractor } from "rollup-plugin-api-extractor";
import { terser } from 'rollup-plugin-terser';
import packageJson from './package.json'

const PROD = !!process.env.CI

export default {
  input: 'src/index.ts',
  context: 'globalThis',
  external: [/@decentraland\//],
  output: [
    {
      file: packageJson.main,
      format: 'iife',
      name: 'self',
      extend: true,
      sourcemap: 'inline'
    },
    {
      file: packageJson.main.replace(/\.js$/, '.min.js'),
      format: 'iife',
      name: 'self',
      extend: true,
      sourcemap: 'hidden',
      compact: true,
      plugins: [terser({})]
    }
  ],
  plugins: [
    resolve({
      preferBuiltins: false,
      browser: true
    }),
    typescript({
      tsconfig: './tsconfig.json',
      sourceMap: false,
      compilerOptions: {
        sourceMap: false,
        inlineSourceMap: false,
        inlineSources: false
      },
    }),
    commonjs({
      exclude: 'node_modules',
      ignoreGlobal: true,
    }),
    true && terser({ format: { comments: false } }),
    apiExtractor({
      configFile: './api-extractor.json',
      configuration: {
        projectFolder: '.',
        compiler: {
          tsconfigFilePath: "<projectFolder>/tsconfig.json",
        },
      },
      local: !PROD,
      cleanUpRollup: false
    })
  ],
};