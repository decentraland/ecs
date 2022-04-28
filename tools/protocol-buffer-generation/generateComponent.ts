import fs from 'fs'
import path from 'path'
import componentEcsTypeTemplate from './componentEcsTypeTemplate'

export async function generateComponent(params: {
  component: string
  generatedPath: string
  definitionsPath: string
}) {
  const { component, generatedPath, definitionsPath } = params

  const protoFilePath = path.resolve(definitionsPath, `${component}.proto`)
  const protoFileContent = fs.readFileSync(protoFilePath).toString()

  const componentId = [
    ...protoFileContent.matchAll(/ComponentDefinition.ComponentID=(.*?);/g)
  ][0][1]
  const componentFilePath = path.resolve(generatedPath, `${component}.ts`)
  const componentContent = componentEcsTypeTemplate
    .replace(/Component/g, component)
    .replace('INVALID_COMPONENT_ID', componentId.toString())

  fs.writeFileSync(componentFilePath, componentContent)
}
