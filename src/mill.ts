import * as path from 'path'
import * as fs from 'fs'
import * as exec from '@actions/exec'
import * as core from '@actions/core'

const defaultMillVersion = '0.10.5'

export async function getMillPath(root: string): Promise<'./mill' | './millw'> {
  const millPath = path.join(root, 'mill')
  const millWPath = path.join(root, 'millw')
  if (fs.existsSync(millPath)) {
    return './mill'
  } else if (fs.existsSync(millWPath)) {
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

export async function checkForValidMillVersion(root: string): Promise<boolean> {
  const millVersionFile = path.join(root, '.mill-version')
  const millFile = path.join(root, 'mill')
  const millwFile = path.join(root, 'millw')

  if (fs.existsSync(millVersionFile)) {
    const data = fs.readFileSync(millVersionFile, 'utf8')
    return validateVersion(data)
  } else if (fs.existsSync(millFile)) {
    return checkMillFile(millFile)
  } else if (fs.existsSync(millwFile)) {
    return checkMillFile(millwFile)
  } else {
    core.info(
      `No .mill-version or mill file found so defaulting to ${defaultMillVersion}`
    )
    return true
  }
}

function checkMillFile(millFile: string): boolean {
  const data = fs.readFileSync(millFile, 'utf8')
  const lines = data.split('\n')
  const versionLine = lines.find(line =>
    line.startsWith('DEFAULT_MILL_VERSION')
  )
  if (versionLine) {
    const version = versionLine.substring(
      versionLine.indexOf('=') + 1,
      versionLine.length
    )
    return validateVersion(version)
  } else {
    core.error('Invalid mill file found without a DEFAULT_MILL_VERSION')
    return false
  }
}

function validateVersion(version: String): boolean {
  if (version.trim().startsWith('0.10')) {
    return true
  } else {
    core.error(
      `Unsupported Mill version found: "${version}". Try updating to ${defaultMillVersion} and try again.`
    )
    return false
  }
}
