import * as core from '@actions/core'

import { getPropertiesForKeys, writePropertiesToFile } from './properties'

export function getInputs(): {
  filePath: string
  keys: string
  operation: string
  keyValuePairs: string
} {
  return {
    filePath: core.getInput('file-path', { required: true }),
    keys: core.getInput('keys', { required: false }),
    operation: core.getInput('operation', { required: true }),
    keyValuePairs: core.getInput('key-value-pairs', { required: false })
  }
}

/**
 * The main function for the action.
 * @returns {Promise<void>} Resolves when the action is complete.
 */
export async function run(): Promise<void> {
  try {
    const { filePath, keys, operation, keyValuePairs } = getInputs()
    if (operation === 'read') {
      const requiredKeys = keys.split(',').map(key => key.trim())
      const properties = await getPropertiesForKeys(filePath, requiredKeys)
      // Output each key-value pair
      if (properties) {
        for (const [key, value] of Object.entries(properties)) {
          core.setOutput(key, value)
        }
      }
    } else if (operation === 'write') {
      const values = JSON.parse(keyValuePairs)
      await writePropertiesToFile(filePath, values)
      core.debug('Properties written successfully.')
    } else {
      throw new Error(`Invalid operation: ${operation}`)
    }
  } catch (error) {
    // Fail the workflow run if an error occurs
    if (error instanceof Error) {
      core.setFailed(error.message)
    } else {
      core.setFailed('Unknown error')
    }
  }
}
