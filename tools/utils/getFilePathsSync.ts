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

  for (const [index, stat] of stats.entries()) {
    if (stat.isDirectory()) {
      if (recursive) {
        const folderFiles = getFilePathsSync(filePaths[index]).map((fileName) =>
          path.resolve(`/${fileNames[index]}`, fileName).substring(1)
        )
        files.push(...folderFiles)
      }
    } else {
      files.push(fileNames[index])
    }
  }

  return files
}
