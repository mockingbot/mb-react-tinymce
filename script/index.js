import { resolve } from 'path'
import { readFileSync, writeFileSync } from 'fs'
import { execSync } from 'child_process'

import { argvFlag, runMain } from 'dev-dep-tool/library/main'
import { getLogger } from 'dev-dep-tool/library/logger'
import { getScriptFileListFromPathList } from 'dev-dep-tool/library/fileList'
import { initOutput, packOutput, publishOutput } from 'dev-dep-tool/library/commonOutput'
import { getTerserOption, minifyFileListWithTerser } from 'dev-dep-tool/library/minify'

const PATH_ROOT = resolve(__dirname, '..')
const PATH_OUTPUT = resolve(__dirname, '../output-gitignore')
const fromRoot = (...args) => resolve(PATH_ROOT, ...args)
const fromOutput = (...args) => resolve(PATH_OUTPUT, ...args)
const execOptionRoot = { cwd: fromRoot(), stdio: argvFlag('quiet') ? [ 'ignore', 'ignore' ] : 'inherit', shell: true }

const processFileList = (filePathList, func) => filePathList.forEach((filePath) => writeFileSync(
  filePath,
  func(readFileSync(filePath).toString())
))

runMain(async (logger) => {
  logger.padLog('generate translation')
  execSync(`npm run script-generate-t9n`, execOptionRoot)

  logger.padLog('generate spec')
  execSync(`npm run script-generate-spec`, execOptionRoot)

  const packageJSON = await initOutput({ fromRoot, fromOutput, logger })
  if (!argvFlag('pack')) return

  logger.padLog(`build library`)
  execSync('npm run build-library', execOptionRoot)

  logger.padLog(`build module`)
  execSync('npm run build-module', execOptionRoot)

  logger.padLog(`minify library`)
  await minifyFileListWithTerser({
    fileList: await getScriptFileListFromPathList([ 'library' ], fromOutput),
    option: getTerserOption(),
    rootPath: PATH_OUTPUT,
    logger
  })

  logger.padLog(`minify module`)
  await minifyFileListWithTerser({
    fileList: await getScriptFileListFromPathList([ 'module' ], fromOutput),
    option: getTerserOption({ isModule: true }),
    rootPath: PATH_OUTPUT,
    logger
  })

  logger.padLog(`add lint disable`)
  processFileList([ fromOutput('library/index.js'), fromOutput('module/index.js') ], (text) => `/* eslint-disable */\n${text}`)
  processFileList([ fromOutput('library/index.css'), fromOutput('module/index.css') ], (text) => `/* stylelint-disable */\n${text.replace(/stylelint-disable/g, '')}`)

  const pathPackagePack = await packOutput({ fromRoot, fromOutput, logger })
  await publishOutput({ flagList: process.argv, packageJSON, pathPackagePack, extraArgs: [ '--userconfig', '~/mockingbot.npmrc' ], logger })
}, getLogger(process.argv.slice(2).join('+'), argvFlag('quiet')))
