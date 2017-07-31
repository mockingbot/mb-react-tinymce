import { getHexFromRGBColor } from 'source/__utils__'

const DEFAULT_EDITOR_STATE = {
  editorRef: null,
  editorStatus: {
    bold: false,
    italic: false,
    underline: false,
    strikeThrough: false,
    insertOrderedList: false,
    insertUnorderedList: false,
    justifyLeft: false,
    justifyCenter: false,
    justifyRight: false,
    // JustifyFull: false,
    // JustifyNone: false,
    fontSize: '',
    foreColor: ''
  }
}

const BOOLEAN_STATUS_LIST = [
  'bold',
  'italic',
  'underline',
  'strikeThrough',
  'insertOrderedList',
  'insertUnorderedList',
  'justifyLeft',
  'justifyCenter',
  'justifyRight'
  // 'JustifyFull',
  // 'JustifyNone'
]

const getEditorStatus = (editorRef) => BOOLEAN_STATUS_LIST.reduce((status, name) => {
  status[ name ] = editorRef.queryCommandState(name)
  return status
}, {
  fontSize: `${parseInt(editorRef.queryCommandValue('fontSize')) || ''}`,
  // this actually calls document.queryCommandValue('foreColor'), and the result is in rgb() format
  foreColor: getHexFromRGBColor(editorRef.queryCommandValue('foreColor')) || ''
})

export {
  DEFAULT_EDITOR_STATE,
  getEditorStatus
}
