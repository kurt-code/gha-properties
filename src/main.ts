import * as core from '@actions/core'
import { properties } from './properties'



export function getInputs(): {
  filePath: string
  keys: string
  readOnly: boolean
  keyValuePairs: string
} {
  return {
    filePath: core.getInput('file-path', { required: true }),
    keys: core.getInput('keys', { required: false }),
    readOnly: core.getInput('read-only', { required: true }) === 'true',
    keyValuePairs: core.getInput('key-value-pairs', { required: false }),
  }
}
/**
 * The main function for the action.
 * @returns {Promise<void>} Resolves when the action is complete.
 */
export async function run(): Promise<void> {
  try {
    const { filePath, keys, readOnly, keyValuePairs } = getInputs()
    // Debug logs are only output if the `ACTIONS_STEP_DEBUG` secret is true

  } catch (error) {
    // Fail the workflow run if an error occurs
    if (error instanceof Error) core.setFailed(error.message)
  }
}
