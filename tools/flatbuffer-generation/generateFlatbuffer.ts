import path from 'path'
import fs from 'fs-extra'
import { runCommand } from '../utils/shellCommand'

const flatBufferCommandOption = ['--gen-object-api', '--csharp', '--ts']

export async function generateFlatbuffer(params: {
  components: string[]
  flatbufferPath: string
  generatedPath: string
  componentPath: string
}) {
  const { components, flatbufferPath, generatedPath } = params

  const hostFbsList = components.map((component) =>
    path.resolve(flatbufferPath, `${component}.fbs`)
  )

  fs.removeSync(generatedPath)
  fs.mkdirSync(generatedPath)

  await runCommand({
    command: path.resolve(process.cwd(), 'node_modules', '.bin', 'flatc'),
    workingDir: process.cwd(),
    args: [...flatBufferCommandOption, '-o', generatedPath, ...hostFbsList]
  })
}
