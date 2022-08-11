import {getMillPath} from '../src/mill'
import {expect} from '@jest/globals'
import * as fs from 'fs'
import * as exec from '@actions/exec'

describe('mill', () => {
  const millPath = '__tests__/examples/missing/mill'

  jest.setTimeout(20000) // 20 seconds for CI for the curl stuff

  // NOTE: That the path is relative to the root of the workspace for the tests
  it('should be able to recognize an existing mill file', async () => {
    const result = await getMillPath('__tests__/examples/mill')
    expect(result).toBe('./mill')
  })

  it('should be able to recognize an existing millw file', async () => {
    const result = await getMillPath('__tests__/examples/millw')
    expect(result).toBe('./millw')
  })

  it('should be able to download latest mill if none is found', async () => {
    const result = await getMillPath('__tests__/examples/missing')
    const exists = fs.existsSync(millPath)
    const runResult = await exec.exec(millPath, ['--version'])
    expect(result).toBe('./mill')
    expect(exists).toBe(true)
    expect(runResult).toBe(0)
  })

  afterAll(() => {
    fs.rmSync('__tests__/examples/missing/mill')
  })
})
