# GitHub Action To Read/Write Key-Value Pairs To/From A File

[![GitHub Super-Linter](https://github.com/kurt-code/gha-properties/actions/workflows/linter.yml/badge.svg)](https://github.com/super-linter/super-linter)
![CI](https://github.com/kurt-code/gha-properties/actions/workflows/ci.yml/badge.svg)
[![Check dist/](https://github.com/kurt-code/gha-properties/actions/workflows/check-dist.yml/badge.svg)](https://github.com/kurt-code/gha-properties/actions/workflows/check-dist.yml)
[![CodeQL](https://github.com/kurt-code/gha-properties/actions/workflows/codeql-analysis.yml/badge.svg)](https://github.com/kurt-code/gha-properties/actions/workflows/codeql-analysis.yml)
[![Coverage](./badges/coverage.svg)](./badges/coverage.svg)

The Properties File Action allows you to perform read and write operations on properties files
within your GitHub Actions workflows. This action is particularly useful for managing configuration
files or properties used in your projects.

## Usage

To use this action to , add the following step to your GitHub workflow:

```yaml
# to READ key-value pairs from a properties file
- name: Read/Write Properties File
  uses: kurt-code/gha-properties@v0.0.1
  id: read-properties
  with:
    operation: 'read'
    file-path: 'path/to/properties/file'
    keys: 'key1,key2'
- name: Get the Read properties
  run: |
    echo "key1: ${{ steps.read-properties.outputs.key1 }}"
    echo "key2: ${{ steps.read-properties.outputs.key2 }}"



# to WRITE key-value pairs to a properties file
- name: Read/Write Properties File
  uses: kurt-code/gha-properties@v0.0.1
  id: read-properties
  with:
    operation: 'write'
    file-path: 'path/to/properties/file'
    key-value-pairs: '{"key1": "value1", "key2": "value2"}'
 ```

## Contribution

> First, you'll need to have a reasonably modern version of `node` handy.
> This won't work with versions older than 20, for instance.

Install the dependencies

```bash
npm install
```

Run all check and build tasks

```bash
npm run all
```
