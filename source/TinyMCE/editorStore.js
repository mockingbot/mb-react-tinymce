import { DEFAULT_EDITOR_STATE, getEditorStatus } from './state'
import { objectMerge, createStateStore } from 'source/__utils__'

const TINY_MCE = window.tinyMCE || window.tinymce // NOTE: load tinymce from window

const DEFAULT_EDITOR_CONFIG = {
  plugins: 'paste link image lists table colorpicker',
  fixed_toolbar_container: '.TINY_MCE_FIXED_TOOLBAR',
  custom_ui_selector: '.TINY_MCE_CUSTOM_UI',
  custom_undo_redo_levels: 30,
  inline: true,
  menubar: false,
  toolbar: 'insert',
  insert_button_items: 'inserttable link image',
  default_link_target: '_blank',
  table_default_styles: { tableLayout: 'fixed', width: '400px', border: '1px solid #999', borderSpacing: '0', borderCollapse: 'separate' }
}

const createEditor = (editorStore, editorElementRef, locale, value) => {
  __DEV__ && console.log('CREATE_TINY_MCE_EDITOR')
  const config = {
    ...DEFAULT_EDITOR_CONFIG,
    language: locale, // 'en_US' or 'zh_CN'
    target: editorElementRef, // or use: selector: `#${editorId}`
    setup: (editorRef) => {
      editorRef.on('init', () => {
        editorRef.setContent(value) // need to set content here because the domElement may have old content
        editorRef.selection.select(editorRef.getBody(), true)
        editorRef.focus()
        editorStore.setState({ editorRef, editorStatus: doGetEditorStatus() })
      })
      editorRef.on('nodeChange', () => editorStore.setState({ editorStatus: doGetEditorStatus() }))
      const doGetEditorStatus = () => objectMerge(editorStore.getState().editorStatus, getEditorStatus(editorRef))

      __DEV__ && editorRef.on('init', () => console.log('init'))
      __DEV__ && editorRef.on('nodeChange', () => console.log('nodeChange', JSON.stringify(doGetEditorStatus())))
      __DEV__ && editorRef.on('focus', () => console.log('focus'))
      __DEV__ && editorRef.on('blur', () => console.log('blur'))
    }
  }
  if (config.language === 'en_US') delete config.language // check default: https://www.tinymce.com/docs/configure/localization/
  TINY_MCE.init(config)
}

const deleteEditor = (editorStore) => {
  if (editorStore.getState() === DEFAULT_EDITOR_STATE) return null
  __DEV__ && console.log('REMOVE_TINY_MCE_EDITOR')
  const { editorRef } = editorStore.getState()
  const value = editorRef.getContent()
  editorRef.remove() // TINY_MCE.EditorManager.remove(editorRef)
  editorStore.setState(DEFAULT_EDITOR_STATE)
  return value
}

const createEditorStore = (state = DEFAULT_EDITOR_STATE) => createStateStore(state)

export {
  createEditor,
  deleteEditor,
  createEditorStore
}
