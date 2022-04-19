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
    ComponentT.pack(fbBuilder, value)
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


// work
const generatedPath = getParam('--generated-path')
const flatbufferPath = getParam('--flatbuffer-path')
const componentPath = getParam('--component-path')

if (!generatedPath) {
  console.error('Arg --generated-path is required.')
  process.exit(1)
}

if (!flatbufferPath) {
  console.error('Arg --flatbuffer-path is required.')
  process.exit(2)
}

if (!componentPath) {
  console.error('Arg --component-path is required.')
  process.exit(3)
}

console.log(`Decentraland > Gen dir: ${generatedPath} - fb dir: ${flatbufferPath}`)

const components = getFilePathsSync(flatbufferPath, false)
  .filter((filePath) => filePath.toLowerCase().endsWith('.fbs'))
  .map((filePath) => filePath.substring(0, filePath.length - 4))



for (const component of components) {
  const tsFile = component.split(/(?=[A-Z])/).join('-').toLowerCase() + '.ts';
  const csharpFile = component + '.cs'
  processComponent({ component, tsFile, csharpFile, generatedPath, componentPath})
}


function processComponent(arg0: { component: string; tsFile: string; csharpFile: string; generatedPath: string, componentPath: string }) {
  const { tsFile, generatedPath, component, componentPath } = arg0
  const filePath = path.resolve(generatedPath, tsFile)
  const fileContent = fs.readFileSync(filePath).toString()

  const object = fileContent.search(`export class ${component}T`)
  const objectClass = fileContent.substring(object)
  const newObjectClass = fileContent.substring(object)
    .replace('pack', 'static pack')
    .replace('flatbuffers.Builder', `flatbuffers.Builder, value: ${component}T`)
    .replace(/this/g, 'value')

  const componentFilePath = path.resolve(componentPath, `${component}.ts`)
  const componentContent = template
    .replace(/Component/g, component)
    .replace('component-ts-file', tsFile.substring(0, tsFile.length - 3))

  fs.writeFileSync(componentFilePath, componentContent)

  fs.writeFileSync(filePath, fileContent.replace(objectClass, newObjectClass))
}

