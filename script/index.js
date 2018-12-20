import { resolve } from 'path'
import { readFileSync, writeFileSync } from 'fs'
import { execSync } from 'child_process'

import { argvFlag, runMain } from 'dr-dev/module/main'
import { getLogger } from 'dr-dev/module/logger'
import { getScriptFileListFromPathList } from 'dr-dev/module/fileList'
import { initOutput, packOutput, publishOutput } from 'dr-dev/module/commonOutput'
import { getTerserOption, minifyFileListWithTerser } from 'dr-dev/module/minify'

const PATH_ROOT = resolve(__dirname, '..')
const PATH_OUTPUT = resolve(__dirname, '../output-gitignore')
const fromRoot = (...args) => resolve(PATH_ROOT, ...args)
const fromOutput = (...args) => resolve(PATH_OUTPUT, ...args)
const execOptionRoot = { cwd: fromRoot(), stdio: argvFlag('quiet') ? [ 'ignore', 'ignore', 'inherit' ] : 'inherit', shell: true }

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
    option: getTerserOption({ ecma: 5 }),
    rootPath: PATH_OUTPUT,
    logger
  })

  logger.padLog(`minify module`)
  await minifyFileListWithTerser({
    fileList: await getScriptFileListFromPathList([ 'module' ], fromOutput),
    option: getTerserOption({ isReadable: true }),
    rootPath: PATH_OUTPUT,
    logger
  })

  logger.padLog(`add lint disable`)
  processFileList([ fromOutput('library/index.js'), fromOutput('module/index.js') ], (text) => `/* eslint-disable */\n${text}`)

  const pathPackagePack = await packOutput({ fromRoot, fromOutput, logger })
  await publishOutput({ flagList: process.argv, packageJSON, pathPackagePack, extraArgs: [ '--userconfig', '~/mockingbot.npmrc' ], logger })
}, getLogger(process.argv.slice(2).join('+'), argvFlag('quiet')))
