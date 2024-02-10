import { promises as fs } from 'fs'

export type KeyValuePairs = Record<string, string>

export async function readPropertiesFile(
  filePath: string
): Promise<{ [key: string]: string }> {
  const data = (await fs.readFile(filePath, 'utf8')) ?? ''
  const lines = data.split('\n')
  const properties: { [key: string]: string } = {}
  for (const line of lines) {
    if (line.trim() !== '' && !line.startsWith('#')) {
      const firstEqualsIndex = line.indexOf('=')
      if (firstEqualsIndex !== -1) {
        // Check if '=' exists in the line
        const key = line.substring(0, firstEqualsIndex).trim()
        const value = line.substring(firstEqualsIndex + 1).trim()
        properties[key] = value
      }
    }
  }
  return properties
}

export async function getPropertiesForKeys(
  filePath: string,
  keys: string[]
): Promise<{ [key: string]: string }> {
  const allProperties = await readPropertiesFile(filePath)
  const filteredProperties: { [key: string]: string } = {}
  for (const key of keys) {
    if (Object.prototype.hasOwnProperty.call(allProperties, key)) {
      filteredProperties[key] = allProperties[key]
    }
  }
  return filteredProperties
}

export async function writePropertyToFile(
  filePath: string,
  key: string,
  value: string
): Promise<void> {
  const properties = await readPropertiesFile(filePath)
  properties[key] = value
  let newFileContent = ''
  for (const prop in properties) {
    if (Object.prototype.hasOwnProperty.call(properties, prop)) {
      newFileContent += `${prop}=${properties[prop]}\n`
    }
  }
  await fs.writeFile(filePath, newFileContent)
}

export async function writePropertiesToFile(
  filePath: string,
  keyValuePairs: KeyValuePairs
): Promise<void> {
  const existingProperties = await readPropertiesFile(filePath)
  for (const key in keyValuePairs) {
    if (Object.prototype.hasOwnProperty.call(keyValuePairs, key)) {
      existingProperties[key] = keyValuePairs[key]
    }
  }
  let newFileContent = ''
  for (const prop in existingProperties) {
    if (Object.prototype.hasOwnProperty.call(existingProperties, prop)) {
      newFileContent += `${prop}=${existingProperties[prop]}\n`
    }
  }
  await fs.writeFile(filePath, newFileContent)
}
