import * as path from 'path'
import * as fs from 'fs'
import {exists, readFile} from './promisified'
import * as exec from '@actions/exec'
import * as core from '@actions/core'

const defaultMillVersion = '0.11.1'

export async function getMillPath(root: string): Promise<'./mill' | './millw'> {
  const millPath = path.join(root, 'mill')
  const millWPath = path.join(root, 'millw')
  if (await exists(millPath)) {
    return './mill'
  } else if (await exists(millWPath)) {
    return './millw'
  } else {
    core.info('Installing mill...')
    await exec.exec('curl', [
      '--create-dirs',
      '-sLo',
      millPath,
      `https://github.com/com-lihaoyi/mill/releases/download/${defaultMillVersion}/${defaultMillVersion}`
    ])
    await exec.exec('chmod', ['+x', millPath])
    return './mill'
  }
}

/**
 * Given a directory returns a promise which resolves to the Mill version declared in the
 * project, or undefined if there is no declared version.
 * The promise is rejected if the version is not supported or if any error happens.
 */
export async function checkForValidMillVersion(
  root: string
): Promise<string | undefined> {
  const millVersionFile = path.join(root, '.mill-version')
  const configMillVersionFile = path.join(root, '.config', 'mill-version')
  const millFile = path.join(root, 'mill')
  const millwFile = path.join(root, 'millw')

  if (await exists(millVersionFile)) {
    const data = await readFile(millVersionFile, 'utf8')
    return validatedVersion(data)
  } else if (await exists(configMillVersionFile)) {
    const data = await readFile(configMillVersionFile, 'utf8')
    return validatedVersion(data)
  } else if (await exists(millFile)) {
    return millFileVersion(millFile)
  } else if (await exists(millwFile)) {
    return millFileVersion(millwFile)
  } else {
    core.info(
      `No .mill-version or mill file found so defaulting to ${defaultMillVersion}`
    )
    return undefined
  }
}

async function millFileVersion(millFile: string): Promise<string> {
  const data = await readFile(millFile, 'utf8')
  const lines = data.split('\n')
  const versionLine = lines.find(line =>
    line.startsWith('DEFAULT_MILL_VERSION')
  )
  if (versionLine) {
    const version = versionLine.substring(
      versionLine.indexOf('=') + 1,
      versionLine.length
    )
    return validatedVersion(version)
  } else {
    throw 'Invalid mill file found without a DEFAULT_MILL_VERSION'
  }
}

function validatedVersion(version: String): string {
  const trimmedVersion = version.trim()
  if (trimmedVersion.startsWith('0.10') || trimmedVersion.startsWith('0.11')) {
    return trimmedVersion
  } else {
    throw `Unsupported Mill version found: "${trimmedVersion}". Try updating to ${defaultMillVersion} and try again.`
  }
}
