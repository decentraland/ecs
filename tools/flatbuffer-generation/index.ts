#!/usr/bin/env node

/**
 * docker run -v /proj/src:/src 
 *    -v /proj/dest:/dest 
 *    neomantra/flatbuffers 
 *    flatc --cpp --js --ruby -o /dest /src/monster.fbs
 */

import fs from 'fs'
import path from 'path'


const template = `
import { Builder, ByteBuffer as FlatBufferByteBuffer } from 'flatbuffers'
import { EcsType } from '../../../built-in-types/EcsType'
import { ByteBuffer } from '../../../serialization/ByteBuffer'
import { Component as fbComponent, ComponentT } from './fb-generated/component-ts-file'

export const CLASS_ID = INVALID_CLASS_ID

type Type = number | boolean

type FromClass<T> = {
  [K in keyof T]: T[K] extends Array<any>
    ? T[K]
    : T[K] extends Type
    ? T[K]
    : never
}

type Component = FromClass<ComponentT>

export const Component: EcsType<Component> = {
  serialize(value: Component, builder: ByteBuffer): void {
    const fbBuilder = new Builder()
    fbBuilder.finish(ComponentT.pack(fbBuilder, value))
    builder.writeBuffer(fbBuilder.asUint8Array(), false)
  },
  deserialize(reader: ByteBuffer): Component {
    const buf = new FlatBufferByteBuffer(reader.buffer())
    // TODO: see performance
    return { ...fbComponent.getRootAsComponent(buf).unpack() }
  }
}
`

function getFilePathsSync(
  dir: string,
  recursive: boolean = true
): string[] {
  // variables
  const fileNames = fs.readdirSync(dir)
  const filePaths = fileNames.map((fileName) => path.resolve(dir, fileName))
  const stats = filePaths.map((filePath) => fs.statSync(filePath))

  // Return value
  const files: string[] = []

  stats.forEach(async (stat, i) => {
    if (stat.isDirectory()) {
      if (recursive) {
        files.concat(getFilePathsSync(filePaths[i]))
      }
    } else {
      files.push(fileNames[i]);
    }
  })

  return files
}

function getParam(key: string) {
  const index = process.argv.findIndex((item) => item === key)
  return index !== -1 && process.argv.length > index && process.argv[index + 1]
}


// work`
const componentPath = getParam('--component-path')

if (!componentPath) {
  console.error('Arg --component-path is required.')
  process.exit(2)
}

const generatedPath = path.resolve(componentPath, 'fb-generated')
const flatbufferPath = path.resolve(componentPath, 'fbs')


console.log(`Decentraland > Gen dir: ${generatedPath} - fb dir: ${flatbufferPath}`)

const components = getFilePathsSync(flatbufferPath, false)
  .filter((filePath) => filePath.toLowerCase().endsWith('.fbs'))
  .map((filePath) => filePath.substring(0, filePath.length - 4))


for (const component of components) {
  const tsFile = component.split(/(?=[A-Z])/).join('-').toLowerCase() + '.ts';
  const csharpFile = component + '.cs'
  const fbFile = component + '.fbs'
  processComponent({
    component,
    tsFile,
    csharpFile,
    fbFile,
    generatedPath,
    componentPath,
    flatbufferPath
  })
}


const indexContent = `
${
  components
  .filter(component => component !== 'index')
  .map((component) => `import * as ${component} from './${component}'`)
  .join('\n')
}
import { Engine } from '../../../engine'

export function defineFlatbufferComponents({
  defineComponent
}: Pick<Engine, 'defineComponent'>) {

  return {
    ${
      components
      .filter(component => component !== 'index')
      .map((component) => `${component}:  defineComponent(${component}.CLASS_ID, ${component}.${component})`)
      .join(',\n')
    }
  }
}
`

fs.writeFileSync(path.resolve(componentPath, 'index.ts'), indexContent)

function processComponent(
  params: {
    component: string
    tsFile: string
    csharpFile: string
    fbFile: string
    generatedPath: string
    componentPath: string
    flatbufferPath: string
  }
) {
  const { 
    tsFile, 
    generatedPath, 
    component, 
    componentPath,
    fbFile, 
    flatbufferPath 
  } = params

  const flatbufferTsGeneratedPath = path.resolve(generatedPath, tsFile)
  const flatbufferTsGeneratedContent =
    fs.readFileSync(flatbufferTsGeneratedPath).toString()

  const fbPath = path.resolve(flatbufferPath, fbFile)
  const fbContent = fs.readFileSync(fbPath).toString()

  const object = flatbufferTsGeneratedContent.search(`export class ${component}T`)

  if (object > 0) {
    const objectClass = flatbufferTsGeneratedContent.substring(object)
    const newObjectClass = flatbufferTsGeneratedContent.substring(object)
      .replace('pack', 'static pack')
      .replace('flatbuffers.Builder', `flatbuffers.Builder, value: ${component}T`)
      .replace(/this/g, 'value')

    const classId = [...fbContent.matchAll(/attribute "CLASS_ID_(.*?)\"/g)][0][1]
    const componentFilePath = path.resolve(componentPath, `${component}.ts`)
    const componentContent = template
      .replace(/Component/g, component)
      .replace('component-ts-file', tsFile.substring(0, tsFile.length - 3))
      .replace('INVALID_CLASS_ID', classId.toString())

    fs.writeFileSync(componentFilePath, componentContent)
    fs.writeFileSync(
      flatbufferTsGeneratedPath, 
      flatbufferTsGeneratedContent.replace(objectClass, newObjectClass)
    )
  }
}

