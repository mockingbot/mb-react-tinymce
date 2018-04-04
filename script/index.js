import { resolve } from 'path'
import { readFileSync, writeFileSync } from 'fs'
import { execSync } from 'child_process'

import { getFileList } from 'dr-js/module/node/file/Directory'

import { argvFlag, runMain } from 'dev-dep-tool/library/__utils__'
import { getLogger } from 'dev-dep-tool/library/logger'
import { initOutput, packOutput, publishOutput } from 'dev-dep-tool/library/commonOutput'
import { getUglifyESOption, minifyFileListWithUglifyEs } from 'dev-dep-tool/library/uglify'

const PATH_ROOT = resolve(__dirname, '..')
const PATH_OUTPUT = resolve(__dirname, '../output-gitignore')
const fromRoot = (...args) => resolve(PATH_ROOT, ...args)
const fromOutput = (...args) => resolve(PATH_OUTPUT, ...args)
const execOptionRoot = { cwd: fromRoot(), stdio: argvFlag('quiet') ? [ 'ignore', 'ignore' ] : 'inherit', shell: true }

const processFile = (filePath, func) => writeFileSync(filePath, func(readFileSync(filePath, { encoding: 'utf8' })))

runMain(async (logger) => {
  logger.padLog('generate spec')
  execSync(`npm run script-generate-spec`, execOptionRoot)
  const packageJSON = await initOutput({ fromRoot, fromOutput, logger })
  if (!argvFlag('pack')) return

  logger.padLog('generate translation')
  execSync(`npm run script-generate-t9n`, execOptionRoot)

  logger.padLog(`build library`)
  execSync('npm run build-library', execOptionRoot)

  logger.padLog(`build module`)
  execSync('npm run build-module', execOptionRoot)

  logger.padLog(`minify library`)
  await minifyFileListWithUglifyEs({
    fileList: (await getFileList(fromOutput('library'))).filter((path) => path.endsWith('.js') && !path.endsWith('.test.js')),
    option: getUglifyESOption({ isDevelopment: false, isModule: true }),
    rootPath: PATH_OUTPUT,
    logger
  })

  logger.padLog(`minify module`)
  await minifyFileListWithUglifyEs({
    fileList: (await getFileList(fromOutput('module'))).filter((path) => path.endsWith('.js') && !path.endsWith('.test.js')),
    option: getUglifyESOption({ isDevelopment: false, isModule: true }),
    rootPath: PATH_OUTPUT,
    logger
  })

  logger.padLog(`add lint disable`)
  processFile(fromOutput('library/index.js'), (text) => `/* eslint-disable */\n${text}`)
  processFile(fromOutput('library/index.css'), (text) => `/* stylelint-disable */\n${text.replace(/stylelint-disable/g, '')}`)
  processFile(fromOutput('module/index.js'), (text) => `/* eslint-disable */\n${text}`)
  processFile(fromOutput('module/index.css'), (text) => `/* stylelint-disable */\n${text.replace(/stylelint-disable/g, '')}`)

  const pathPackagePack = await packOutput({ fromRoot, fromOutput, logger })
  await publishOutput({ flagList: process.argv, packageJSON, pathPackagePack, extraArgs: [ '--userconfig', '~/thatbean.npmrc' ], logger })
}, getLogger(process.argv.slice(2).join('+'), argvFlag('quiet')))
