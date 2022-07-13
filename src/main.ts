import * as core from '@actions/core'
import * as path from 'path'
import * as fs from 'fs'
import * as exec from '@actions/exec'

const defaultMillPluginVersion = '0.1.0'
const defaultMillVersion = '0.10.5'

async function getMillPath(root: string) {
  const millPath = path.join(root, 'mill')
  const millWPath = path.join(root, 'millw')
  if (fs.existsSync(millPath)) {
    return './mill'
  } else if (fs.existsSync(millWPath)) {
    return './millw'
  } else {
    core.info('Installing mill...')
    await exec.exec('curl', [
      '-sLo',
      millPath,
      `https://github.com/com-lihaoyi/mill/releases/download/${defaultMillVersion}/${defaultMillVersion}`
    ])
    await exec.exec('chmod', ['+x', millPath])
    return './mill'
  }
}

async function run(): Promise<void> {
  try {
    const token = core.getInput('token')
    core.setSecret(token)
    process.env['GITHUB_TOKEN'] = token

    const workingDirectoryInput = core.getInput('working-directory')
    const workingDirectory =
      workingDirectoryInput.length === 0 ? '.' : workingDirectoryInput

    const pluginVersionInput = core.getInput('plugin-version')

    const millCommand = await getMillPath(workingDirectory)

    const pluginVersion =
      pluginVersionInput.length === 0
        ? defaultMillPluginVersion
        : pluginVersionInput

    await exec.exec(
      millCommand,
      [
        '--no-server',
        '--import',
        `ivy:io.chris-kipp::mill-github-dependency-graph::${pluginVersion}`,
        'io.kipp.mill.github.dependency.graph.Graph/submit'
      ],
      {
        cwd: workingDirectory
      }
    )
  } catch (error) {
    if (error instanceof Error) {
      core.setFailed(error)
    } else {
      core.setFailed(`unknown error: ${error}`)
    }
  }
}

run()
