import fs from 'fs'
import path from 'path'

export function getFilePathsSync(
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
      files.push(fileNames[i])
    }
  })

  return files
}
