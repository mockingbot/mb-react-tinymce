import { resolve } from 'path'

const OUTPUT_DIRECTORY_PATH = resolve(__dirname, '../source/__utils__/translation')

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

export {
  OUTPUT_DIRECTORY_PATH,
  LOCALE_LIST,
  TRANSLATION_LIST_MAP
}
