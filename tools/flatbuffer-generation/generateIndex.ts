import fs from 'fs'
import path from 'path'

const indexTemplate = `
$componentImports
import { Engine } from '../../../engine'

export function defineFlatbufferComponents({
  defineComponent
}: Pick<Engine, 'defineComponent'>) {

  return {
    $componentReturns
  }
}
`
function importComponent(component: string) {
  return `import * as ${component} from './${component}'`
}

function defineComponent(component: string) {
  return `${component}:  defineComponent(${component}.COMPONENT_ID, ${component}.${component})`
}

export function generateIndex(param: {
  components: string[]
  componentPath: string
}) {
  const { components, componentPath } = param
  const componentWithoutIndex = components.filter(
    (component) => component !== 'index'
  )

  const indexContent = indexTemplate
    .replace(
      '$componentImports',
      componentWithoutIndex.map(importComponent).join('\n')
    )
    .replace(
      '$componentReturns',
      componentWithoutIndex.map(defineComponent).join(',\n')
    )

  fs.writeFileSync(path.resolve(componentPath, 'index.ts'), indexContent)
}
