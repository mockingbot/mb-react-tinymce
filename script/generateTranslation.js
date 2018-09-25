import { resolve, relative } from 'path'
import { existsSync, mkdirSync, writeFileSync } from 'fs'
import MessageFormat from 'messageformat'
import {
  OUTPUT_DIRECTORY_PATH,
  LOCALE_LIST,
  TRANSLATION_LIST_MAP
} from './I18N_DATA'

const fromRoot = (...args) => resolve(__dirname, '..', ...args)

const compileLocaleData = (locale, data, debugMessage = '') => {
  try {
    return new MessageFormat(locale).compile(data).toString()
  } catch (error) {
    console.warn('[Error][Compile]', locale, data, debugMessage)
    console.warn(error.message)
    console.warn(JSON.stringify(error.location, null, ' '))
    throw error
  }
}

const repackTranslation = (localList, translationListMap) => {
  const localeCount = localList.length
  if (!localeCount) throw new Error(`localeCount: ${localeCount}, localList: ${localList}`)

  const repackList = localList.map(() => ({}))
  Object.entries(translationListMap).forEach(([ key, translationList ]) => {
    if (translationList.length !== localeCount) throw new Error(`key: ${key} translationList: ${translationList.length} localeCount: ${localeCount}`)
    translationList.forEach((data, i) => compileLocaleData(localList[ i ], data, key)) // DEBUG: try to compile each line first to find syntax errors
    translationList.forEach((data, i) => (repackList[ i ][ key ] = data))
  })

  return localList.map((locale, i) => ({ locale, data: repackList[ i ] }))
}

const compileAndOutput = (translationDataList, outputDirectoryPath) => {
  if (!existsSync(outputDirectoryPath)) mkdirSync(outputDirectoryPath)

  // output each locale file
  const outputFileList = translationDataList.map(({ locale, data }) => {
    const outputLocaleFilePath = resolve(outputDirectoryPath, `locale_${locale}.js`)
    writeFileSync(outputLocaleFilePath, `/* eslint-disable */\n${compileLocaleData(locale, data)}\n`)
    return outputLocaleFilePath
  })

  // output index file
  const outputIndexFilePath = resolve(outputDirectoryPath, `index.js`)
  writeFileSync(outputIndexFilePath, [
    `/* eslint-disable */`,
    ...translationDataList.map(({ locale }) => `import ${locale} from './locale_${locale}'`),
    `const localeList = [ ${translationDataList.map(({ locale }) => `'${locale}'`).join(', ')} ]`,
    `export default { ${translationDataList.map(({ locale }) => `${locale}`).join(', ')}, localeList }`
  ].join('\n'))
  outputFileList.push(outputIndexFilePath)

  return outputFileList
}

const main = () => {
  // start the process
  const outputFileList = compileAndOutput(
    repackTranslation(LOCALE_LIST, TRANSLATION_LIST_MAP),
    OUTPUT_DIRECTORY_PATH
  )

  const shortPath = (path) => relative(fromRoot(), path)
  console.log(`Exported:\n - ${outputFileList.map(shortPath).join('\n - ')}`)
}

main()
