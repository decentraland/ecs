// #!/bin/bash

// # Listing flatbuffer files
// base_path="${PWD}/src/components/legacy/flatbuffer/fbs/"
// docker_path="/flatbuffer/fbs"
// for file in ${PWD}/src/components/legacy/flatbuffer/fbs/*.fbs
// do
// filename=$(basename -- "$fullfile")
// list_of_files+=" $docker_path/${file:${#base_path}}"
// done

// echo "> Flatbuffer: Generating the next files $list_of_files"

// # Remove old files
// rm -rf ${PWD}/src/components/legacy/flatbuffer/fb-generated/* || true

// # Generate files
// docker run -u $(id -u):$(id -g) -v ${PWD}/src/components/legacy/flatbuffer:/flatbuffer neomantra/flatbuffers flatc --gen-object-api --csharp --ts -o /flatbuffer/fb-generated $list_of_files

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

  // const dockerFbsList = components.map((component) =>
  //   path.resolve('/flatbuffer/fbs', `${component}.fbs`)
  // )
  // docker run -u $(id -u):$(id -g) -v ${componentPath}:/flatbuffer neomantra/flatbuffers flatc ${flatBufferCommandOption.join(' ')} -o /flatbuffer/fb-generated ${dockerFbsList.join(' ')}

  const hostFbsList = components.map((component) =>
    path.resolve(flatbufferPath, `${component}.fbs`)
  )

  fs.removeSync(generatedPath)
  fs.mkdirSync(generatedPath)

  await runCommand({
    command: 'flatc',
    workingDir: process.cwd(),
    args: [...flatBufferCommandOption, '-o', generatedPath, ...hostFbsList]
  })
}
