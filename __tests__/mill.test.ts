import {checkForValidMillVersion, getMillPath} from '../src/mill'
import {exists, rm} from '../src/promisified'
import {describe, expect, it, jest, afterAll} from '@jest/globals'
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
    const doesExist = await exists(millPath)
    const runResult = await exec.exec(millPath, ['--version'])
    expect(result).toBe('./mill')
    expect(doesExist).toBe(true)
    expect(runResult).toBe(0)
  })

  it('should be able to recognize a valid version from a mill file', async () => {
    const result = await checkForValidMillVersion('__tests__/examples/mill')
    expect(result).toBe('0.10.5')
  })

  it('should be able to recognize a valid version from a millw file', async () => {
    const result = await checkForValidMillVersion('__tests__/examples/millw')
    expect(result).toBe('0.10.0')
  })

  it('should be able to recognize a valid version from a .mill-version file', async () => {
    const result = await checkForValidMillVersion(
      '__tests__/examples/mill-version'
    )
    expect(result).toBe('0.10.5')
  })

  it('should be able to recognize a valid version from a .config/.mill-version file', async () => {
    const result = await checkForValidMillVersion(
      '__tests__/examples/config-mill-version'
    )
    expect(result).toBe('0.11.1')
  })

  it('should be able to detect a version that is too old', async () => {
    const resultPromise = checkForValidMillVersion(
      '__tests__/examples/old-version'
    )
    expect(resultPromise).rejects.toBe(
      'Unsupported Mill version found: "0.9.0". Try updating to 0.12.5 and try again.'
    )
  })

  afterAll(() => {
    return rm('__tests__/examples/missing/mill')
  })
})
