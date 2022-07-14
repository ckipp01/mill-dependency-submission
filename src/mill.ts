import * as path from 'path'
import * as fs from 'fs'
import * as exec from '@actions/exec'
import * as core from '@actions/core'

const defaultMillVersion = '0.10.5'

export async function getMillPath(root: string) {
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
