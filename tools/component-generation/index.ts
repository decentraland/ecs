#!/usr/bin/env node

import { getPathsSync, PathItem } from '../utils/getFilePathsSync'
import path from 'path'
import { processComponent } from './processComponent'

function getParam(key: string) {
  const index = process.argv.findIndex((item) => item === key)
  return index !== -1 && process.argv.length > index && process.argv[index + 1]
}

export type ComponentItem = {
  dirPath: string
  name: string
  versions: {
    value: number
    absolutePath: string
  }[]
}

function getComponents(
  filePaths: PathItem[],
  componentPath: string
): ComponentItem[] {
  const ret: ComponentItem[] = []
  const componentsName = filePaths.filter(
    (item) => item.path.split('/').length === 1
  )

  for (const componentName of componentsName) {
    const name = componentName.path
    const dirPath = path.resolve(componentPath, componentName.path)

    const files: string[] = filePaths
      .filter(
        (item) =>
          item.path.startsWith(name) &&
          !item.isDirectory &&
          item.path.endsWith('.json')
      )
      .map((file) => file.path)

    const versions = files
      .filter((item) => item.match(/v(.*).json/))
      .map((item) => ({
        value: parseInt(item.match(/v(.*).json/)![1]),
        absolutePath: path.resolve(componentPath, item)
      }))

    ret.push({
      name,
      dirPath,
      versions
    })
  }

  return ret
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
    return
  }
  console.log(
    `Decentraland > Gen dir: ${componentPath} - fb dir: ${componentPath}`
  )

  const filePaths = getPathsSync(componentPath)
  const components = getComponents(filePaths, componentPath)

  for (const component of components) {
    processComponent(component)
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
