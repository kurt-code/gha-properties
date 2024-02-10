import * as fs from 'fs';
import {
  readPropertiesFile,
  getPropertiesForKeys,
  writePropertyToFile,
  writePropertiesToFile,
  KeyValuePairs
} from '../src/properties';

jest.mock('fs', () => ({
  promises: {
    appendFile: jest.fn().mockResolvedValue(undefined),
    readFile: jest.fn().mockResolvedValue('key1=value1\nkey2=value2\nkey3=value3'),
    writeFile: jest.fn().mockResolvedValue(undefined)
  }
}))


describe('Properties File Operations', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks()
  })

  describe('readPropertiesFile', () => {
    it('should read properties from file successfully', async () => {
      const result = await readPropertiesFile('test.properties');
      expect(result).toEqual({
        'key1': 'value1',
        'key2': 'value2',
        'key3': 'value3'
      });
    });

    it('should handle empty lines and comments', async () => {
      const mockData = 'key1=value1\n\n# comment\nkey2=value2';
      jest.spyOn(fs.promises, 'readFile').mockResolvedValue(mockData)
      const result = await readPropertiesFile('test.properties');
      expect(result).toEqual({
        'key1': 'value1',
        'key2': 'value2'
      });
    });

    it('should handle file read error', async () => {
      const error = new Error('File read error');
      jest.spyOn(fs.promises, 'readFile').mockRejectedValueOnce(error);
      await expect(readPropertiesFile('test.properties')).rejects.toThrow(error);
    });
  });

  describe('getPropertiesForKeys', () => {
    it('should return properties for specified keys', async () => {
      jest.spyOn(fs.promises, 'readFile').mockResolvedValue('key1=value1\nkey2=value2\nkey3=value3')

      const result = await getPropertiesForKeys('test.properties', ['key1', 'key3']);
      console.log(result)
      expect(result).toEqual({
        'key1': 'value1',
        'key3': 'value3'
      });
    });

    it('should handle keys not found', async () => {
      const result = await getPropertiesForKeys('test.properties', ['key4', 'key5']);
      expect(result).toEqual({});
    });
  });

  describe('writePropertyToFile', () => {
    it('should write property to file successfully', async () => {
      await writePropertyToFile('test.properties', 'key3', 'value3');
      expect(fs.promises.writeFile).toHaveBeenCalledWith(
        'test.properties',
        'key1=value1\nkey2=value2\nkey3=value3\n'
      );
    });

    it('should handle file write error', async () => {
      const error = new Error('File write error');
      jest.spyOn(fs.promises, 'writeFile').mockRejectedValueOnce(error);
      await expect(writePropertyToFile('test.properties', 'key1', 'value1')).rejects.toThrow(error);
    });
  });

  describe('writePropertiesToFile', () => {
    it('should write properties to file successfully', async () => {
      jest.spyOn(fs.promises, 'writeFile').mockResolvedValue(undefined);
      const mockProperties = {
        'key4': 'value4',
      };
      await writePropertiesToFile('test.properties', mockProperties);

      expect(fs.promises.writeFile).toHaveBeenCalledWith(
        'test.properties',
        'key1=value1\nkey2=value2\nkey3=value3\nkey4=value4\n'
      );
    });

    it('should handle file write error', async () => {
      const error = new Error('File write error');
      jest.spyOn(fs.promises, 'readFile').mockRejectedValueOnce(error);
      await expect(writePropertiesToFile('test.properties', { 'key1': 'value1' })).rejects.toThrow(error);
    });
  });
});
