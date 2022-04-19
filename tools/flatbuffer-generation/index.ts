#!/usr/bin/env node

import path from 'path'
import { getFilePathsSync } from '../utils/getFilePathsSync'
import { generateComponent } from './generateComponent'
import { generateFlatbuffer } from './generateFlatbuffer'
import { generateIndex } from './generateIndex'

function getParam(key: string) {
  const index = process.argv.findIndex((item) => item === key)
  return index !== -1 && process.argv.length > index && process.argv[index + 1]
}

/**
 * @param componentPath - Argument of execution '--component-path'
 *
 * The component-path folder must have the `fbs` folder with .fbs files definition
 *  inside. This will be used to execute the flat-buffer compiler generating the
 *  .ts and .cs files in the folder `${componentPath}/fb-generated`.
 * After flat-buffer generation, the ecs-components are generated in the folder
 * `${componentPath}/ComponentInPascalCase.ts` and an `index.ts` with the engine
 *  integration is also generated.
 *
 */
async function main() {
  const componentPath = getParam('--component-path')
  if (!componentPath) {
    console.error('Arg --component-path is required.')
    process.exit(2)
  }

  const generatedPath = path.resolve(componentPath, 'fb-generated')
  const flatbufferPath = path.resolve(componentPath, 'fbs')

  console.log(
    `Decentraland > Gen dir: ${generatedPath} - fb dir: ${flatbufferPath}`
  )

  const components = getFilePathsSync(flatbufferPath, false)
    .filter((filePath) => filePath.toLowerCase().endsWith('.fbs'))
    .map((filePath) => filePath.substring(0, filePath.length - 4))

  await generateFlatbuffer({
    components,
    componentPath,
    flatbufferPath,
    generatedPath
  })

  for (const component of components) {
    const tsFile =
      component
        .split(/(?=[A-Z])/)
        .join('-')
        .toLowerCase() + '.ts'
    const csharpFile = component + '.cs'
    const fbFile = component + '.fbs'
    await generateComponent({
      component,
      tsFile,
      csharpFile,
      fbFile,
      generatedPath,
      componentPath,
      flatbufferPath
    })
  }

  await generateIndex({ components, componentPath })
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
