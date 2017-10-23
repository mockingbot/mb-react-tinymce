// This is a pre-compile script, used to generate script / data for app
// This file should not be referenced from React code

const nodeModulePath = require('path')
const nodeModuleFs = require('fs')
const MessageFormat = require('messageformat')

const OUTPUT_DIRECTORY_PATH = nodeModulePath.resolve(__dirname, './source/__utils__/translation')

const LOCALE_LIST = [ 'zh_CN', 'en_US' ]
const TRANSLATION_LIST_MAP = {
  'TinyMCE:fontSize': [ '字号', 'Text' ],
  'TinyMCE:bold': [ '粗体', 'Bold' ],
  'TinyMCE:italic': [ '斜体', 'Italic' ],
  'TinyMCE:underline': [ '下划线', 'Underline' ],
  'TinyMCE:strikeThrough': [ '中划线', 'Strike Through' ],
  'TinyMCE:foreColor': [ '文字颜色', 'Text Color' ],
  'TinyMCE:alignment': [ '水平对齐', 'Alignment' ],
  'TinyMCE:insertUnorderedList': [ '项目符号', 'Bulleted List' ],
  'TinyMCE:insertOrderedList': [ '编号', 'Numbered List' ],
  'TinyMCE:insertTable': [ '表格', 'Insert Table' ],
  'TinyMCE:insertLink': [ '超链接', 'Insert Link' ],
  'TinyMCE:insertImage': [ '图片', 'Insert Image' ],

  'TinyMCE:alert:upload-error': [ '未能成功上传至服务器', 'Failed to upload to server' ],
  'TinyMCE:pending:image-upload': [ '正在上传图片', 'Uploading Image' ],

  'default': [ '文本缺失', 'Translation Missing' ] // use when above keys all missed
}

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
  Object.keys(translationListMap).forEach((key) => {
    const translationList = translationListMap[ key ]
    if (translationList.length !== localeCount) throw new Error(`key: ${key} translationList: ${translationList.length} localeCount: ${localeCount}`)
    translationList.forEach((data, i) => compileLocaleData(localList[ i ], data, key)) // DEBUG: try to compile each line first to find syntax errors
    translationList.forEach((data, i) => (repackList[ i ][ key ] = data))
  })

  return localList.map((locale, i) => ({ locale, data: repackList[ i ] }))
}

const compileAndOutput = (translationDataList, outputDirectoryPath) => {
  if (!nodeModuleFs.existsSync(outputDirectoryPath)) nodeModuleFs.mkdirSync(outputDirectoryPath)

  // output each locale file
  const promiseList = translationDataList.map(({ locale, data }) => {
    const compiledString = `/* eslint-disable */\nexport default (() => { ${compileLocaleData(locale, data, '[compileAndOutput]')} })()`
    const outputLocaleFilePath = nodeModulePath.join(outputDirectoryPath, `locale_${locale}.js`)
    return new Promise((resolve, reject) => nodeModuleFs.writeFile(
      outputLocaleFilePath,
      compiledString,
      (error) => error ? reject(error) : resolve(outputLocaleFilePath)
    ))
  })

  // output index file
  const outputIndexFilePath = nodeModulePath.join(outputDirectoryPath, `index.js`)
  promiseList.push(new Promise((resolve, reject) => nodeModuleFs.writeFile(
    outputIndexFilePath,
    `/* eslint-disable */\n` +
    translationDataList.map(({ locale }) => `import ${locale} from './locale_${locale}'\n`).join('') +
    `const localeList = [ ${translationDataList.map(({ locale }) => `'${locale}'`).join(', ')} ]\n` +
    `export default { ${translationDataList.map(({ locale }) => `${locale}`).join(', ')}, localeList }\n`,
    (error) => error ? reject(error) : resolve(outputIndexFilePath)
  )))

  return Promise.all(promiseList)
}

// start the process
compileAndOutput(repackTranslation(LOCALE_LIST, TRANSLATION_LIST_MAP), OUTPUT_DIRECTORY_PATH)
  .then((result) => { console.log('Exported:\n', result) })
  .catch((error) => { console.warn('Error:\n', error) })
