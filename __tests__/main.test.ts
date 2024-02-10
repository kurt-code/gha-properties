import * as fs from 'fs'
import { run } from '../src/main'
import * as core from '@actions/core'

const filePath = 'test.properties'
const keys = 'key1,key2,key3'
const operation = 'read'
const keyValuePairs = '{"key4": "value4", "key2": "value2-new"}'

jest.mock('fs', () => ({
  promises: {
    readFile: jest.fn(),
    writeFile: jest.fn()
  }
}))

describe('main.ts', () => {
  beforeEach(() => {
    jest.resetAllMocks()

    jest.spyOn(core, 'getInput').mockImplementation(name => {
      if (name === 'file-path') return filePath
      if (name === 'keys') return keys
      if (name === 'operation') return operation
      if (name === 'key-value-pairs') return keyValuePairs
      return ''
    })
    jest.spyOn(core, 'setOutput').mockImplementation(jest.fn())
    jest.spyOn(core, 'setFailed').mockImplementation(jest.fn())
    jest.spyOn(core, 'debug').mockImplementation(jest.fn())
  })
  afterEach(() => {
    jest.restoreAllMocks()
  })

  describe('read operation', () => {
    it('should read properties from file and set outputs', async () => {
      jest
        .spyOn(fs.promises, 'readFile')
        .mockResolvedValue('key1=value1\nkey2=value2\nkey3=value3')
      await run()
      expect(fs.promises.readFile).toHaveBeenCalledWith(
        'test.properties',
        'utf8'
      )
    })

    it('should handle file read error', async () => {
      const error = new Error('File read error')
      jest.spyOn(fs.promises, 'readFile').mockRejectedValue(error)
      await run()
      expect(fs.promises.readFile).toHaveBeenCalledWith(
        'test.properties',
        'utf8'
      )
      expect(core.setFailed).toHaveBeenCalledWith(error.message)
    })
  })

  describe('write operation', () => {
    it('should write properties to file', async () => {
      // jest.spyOn(fs.promises, 'readFile').mockResolvedValue('');
      jest.spyOn(core, 'getInput').mockImplementation(name => {
        if (name === 'file-path') return filePath
        if (name === 'keys') return keys
        if (name === 'operation') return 'write'
        if (name === 'key-value-pairs') return keyValuePairs
        return ''
      })
      await run()
      expect(fs.promises.readFile).toHaveBeenCalledWith(
        'test.properties',
        'utf8'
      )
      expect(fs.promises.writeFile).toHaveBeenCalled()
    })

    it('should handle file write error', async () => {
      jest.spyOn(core, 'getInput').mockImplementation(name => {
        if (name === 'file-path') return filePath
        if (name === 'keys') return keys
        if (name === 'operation') return 'write'
        if (name === 'key-value-pairs') return keyValuePairs
        return ''
      })
      const error = new Error('File write error')
      jest.spyOn(fs.promises, 'readFile').mockResolvedValue('')
      jest.spyOn(fs.promises, 'writeFile').mockRejectedValue(error)
      await run()
      expect(fs.promises.readFile).toHaveBeenCalledWith(
        'test.properties',
        'utf8'
      )
      expect(fs.promises.writeFile).toHaveBeenCalled()
      expect(core.setFailed).toHaveBeenCalledWith(error.message)
    })
  })

  describe('should handle invalid operation', () => {
    it('should exit with error for invalid operation', async () => {
      // spyON getInput() to return an invalid operation
      jest.spyOn(core, 'getInput').mockImplementationOnce(() => {
        // eslint-disable-next-line no-throw-literal
        throw {}
      })
      await run()
      expect(core.setFailed).toHaveBeenCalledWith(`Unknown error`)
    })
  })

  describe('should handle unknown error', () => {
    it('should exit with error for invalid operation', async () => {
      jest.spyOn(core, 'getInput').mockImplementation(name => {
        if (name === 'file-path') return filePath
        if (name === 'keys') return keys
        if (name === 'operation') return 'unknown'
        if (name === 'key-value-pairs') return keyValuePairs
        return ''
      })
      await run()
      expect(core.setFailed).toHaveBeenCalledWith(`Invalid operation: unknown`)
    })
  })
})
