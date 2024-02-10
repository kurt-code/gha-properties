import { promises as fs } from 'fs'

export type KeyValuePairs = Record<string, string>;

export async function readPropertiesFile(filePath: string): Promise<{ [key: string]: string }> {
  try {
    const data = await fs.readFile(filePath, 'utf8')
    if (!data) {
      throw new Error('File content is empty or undefined.');
    }
    const lines = data.split('\n');
    const properties: { [key: string]: string } = {};
    for (const line of lines) {
      if (line.trim() !== '' && !line.startsWith('#')) {
        const firstEqualsIndex = line.indexOf('=');
        if (firstEqualsIndex !== -1) { // Check if '=' exists in the line
          const key = line.substring(0, firstEqualsIndex).trim();
          const value = line.substring(firstEqualsIndex + 1).trim();
          properties[key] = value;
        } else {
          console.warn(`Invalid line format: ${line}`);
        }
      }
    }
    return properties;
  } catch (error) {
    throw error;
  }
}


export async function getPropertiesForKeys(filePath: string, keys: string[]):  Promise<{ [key: string]: string }> {
  try {
    const allProperties = await readPropertiesFile(filePath);
    const filteredProperties: { [key: string]: string } = {};
    keys.forEach(key => {
      if (allProperties.hasOwnProperty(key)) {
        filteredProperties[key] = allProperties[key];
      }
    });
    return filteredProperties;
  } catch (error) {
    throw error;
  }
}

export async function writePropertyToFile(filePath: string, key: string, value: string): Promise<void> {
  try {
    const properties = await readPropertiesFile(filePath);
    properties[key] = value;
    let newFileContent = '';
    for (const prop in properties) {
      if (properties.hasOwnProperty(prop)) {
        newFileContent += `${prop}=${properties[prop]}\n`;
      }
    }
    await fs.writeFile(filePath, newFileContent);
  } catch (error) {
    throw error;
  }
}

export async function writePropertiesToFile(filePath: string, keyValuePairs: KeyValuePairs): Promise<void> {
  try {
    const existingProperties = await readPropertiesFile(filePath);
    for (const key in keyValuePairs) {
      if (keyValuePairs.hasOwnProperty(key)) {
        existingProperties[key] = keyValuePairs[key];
      }
    }
    let newFileContent = '';
    for (const prop in existingProperties) {
      if (existingProperties.hasOwnProperty(prop)) {
        newFileContent += `${prop}=${existingProperties[prop]}\n`;
      }
    }
    await fs.writeFile(filePath, newFileContent);
  } catch (error) {
    throw error;
  }
}
