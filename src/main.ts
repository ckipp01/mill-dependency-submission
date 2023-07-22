import { checkForValidMillVersion, getMillPath } from '../src/mill'
import * as core from '@actions/core'
import * as exec from '@actions/exec'

const defaultMillPluginVersion = '0.2.5'

async function run(): Promise<void> {
  try {
    const token = core.getInput('token')
    core.setSecret(token)
    process.env['GITHUB_TOKEN'] = token

    const workingDirectoryInput = core.getInput('working-directory')
    const workingDirectory =
      workingDirectoryInput.length === 0 ? '.' : workingDirectoryInput

    const pluginVersionInput = core.getInput('plugin-version')

    await checkForValidMillVersion(workingDirectory)

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
