import { readJsonSync } from 'fs-extra'
import { ComponentItem } from '.'

type FieldFloat32 = {
  type: 'float32'
}

type FieldStruct = {
  type: 'struct'
  fields: {
    [key: string]: Field
  }
}

type FieldArray = {
  type: 'array'
  item: Field
}

type FieldFixedArray = {
  type: 'fixed_array'
  length: number
  item: Field
}

type Field = FieldStruct | FieldFloat32 | FieldArray | FieldFixedArray

type ComponentVersionSchema = {
  schema: FieldStruct
  metadata: Record<string, any>
}

function processInt32(field: Field, accessor: string) {
  console.log('typescriptint32')
}

function processFloat32(field: Field, accessor: string) {
  console.log('float32')
}

function processArray(field: Field, accessor: string) {
  console.log('float32')
}

function processFixedArray(field: Field, accessor: string) {
  console.log('float32')
}

function processField(field: Field, accessor: string) {
  const mappingProcess: Record<
    Field['type'],
    (field: any, accessor: string) => void
  > = {
    struct: processStruct,
    array: processArray,
    fixed_array: processFixedArray,
    float32: processFloat32
  }

  if (mappingProcess[field.type]) {
    mappingProcess[field.type](field, accessor)
  } else {
    throw new Error(`Type ${field.type} unknown`)
  }
}

function processStruct(field: FieldStruct, accessor: string) {
  for (const fieldName of Object.keys(field.fields)) {
    processField(field.fields[fieldName], `${accessor}.${fieldName}`)
  }
}

function processVersion(content: ComponentVersionSchema, previousVersion: any) {
  processField(content.schema, 'root')
}

export function processComponent(component: ComponentItem) {
  console.log({ component })

  const previousVersion = null
  const versions = component.versions.sort((a, b) => a.value - b.value)

  for (const version of versions) {
    const fileContent = readJsonSync(
      version.absolutePath
    ) as ComponentVersionSchema
    processVersion(fileContent, previousVersion)
  }
}
