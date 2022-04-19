import fs from 'fs'
import path from 'path'
import componentEcsTypeTemplate from './componentEcsTypeTemplate'

export async function generateComponent(params: {
  component: string
  tsFile: string
  csharpFile: string
  fbFile: string
  generatedPath: string
  componentPath: string
  flatbufferPath: string
}) {
  const {
    tsFile,
    generatedPath,
    component,
    componentPath,
    fbFile,
    flatbufferPath
  } = params

  const flatbufferTsGeneratedPath = path.resolve(generatedPath, tsFile)
  const flatbufferTsGeneratedContent = fs
    .readFileSync(flatbufferTsGeneratedPath)
    .toString()

  const fbPath = path.resolve(flatbufferPath, fbFile)
  const fbContent = fs.readFileSync(fbPath).toString()

  const object = flatbufferTsGeneratedContent.search(
    `export class ${component}T`
  )

  if (object > 0) {
    const objectClass = flatbufferTsGeneratedContent.substring(object)
    const newObjectClass = flatbufferTsGeneratedContent
      .substring(object)
      .replace('pack', 'static pack')
      .replace(
        'flatbuffers.Builder',
        `flatbuffers.Builder, value: ${component}T`
      )
      .replace(/this/g, 'value')

    const classId = [
      ...fbContent.matchAll(/attribute "COMPONENT_ID_(.*?)\"/g)
    ][0][1]
    const componentFilePath = path.resolve(componentPath, `${component}.ts`)
    const componentContent = componentEcsTypeTemplate
      .replace(/Component/g, component)
      .replace('component-ts-file', tsFile.substring(0, tsFile.length - 3))
      .replace('INVALID_COMPONENT_ID', classId.toString())

    fs.writeFileSync(componentFilePath, componentContent)
    fs.writeFileSync(
      flatbufferTsGeneratedPath,
      flatbufferTsGeneratedContent.replace(objectClass, newObjectClass)
    )
  }
}
