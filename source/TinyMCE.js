const TINY_MCE = window.tinyMCE || window.tinymce // NOTE: load tinymce from window
const CREATE_TINY_MCE_EDITOR = (config) => {
  if (config.language === 'en_US') delete config.language // check default: https://www.tinymce.com/docs/configure/localization/
  TINY_MCE.init(config)
}
const REMOVE_TINY_MCE_EDITOR = (editor) => TINY_MCE.EditorManager.remove(editor)
const EDITOR_CONFIG = {
  plugins: 'paste link image lists table textcolor colorpicker',
  // toolbar: 'undo redo | cut copy paste | styleselect | bold italic underline | fontselect fontsizeselect forecolor backcolor | alignleft aligncenter alignright alignjustify | insert',
  // toolbar: 'fontsizeselect | bold italic underline strikethrough | forecolor | alignleft aligncenter alignright | bullist numlist | table link image',
  toolbar: 'table link image',
  menubar: false,
  inline: true,
  image_advtab: true,
  custom_undo_redo_levels: 30,
  insert_button_items: 'inserttable link image',
  default_link_target: '_blank',
  fixed_toolbar_container: '.TINY_MCE_FIXED_TOOLBAR'
  // init_instance_callback: (editor) => { console.log('Editor: ' + editor.id + ' is now initialized.') }
}

let TINY_MCE_TOOLBAR_COMPONENT = null
const SET_TINY_MCE_TOOLBAR_COMPONENT = (component) => (TINY_MCE_TOOLBAR_COMPONENT = component)

const DEFAULT_EDITOR_STATE = { value: '', getLockedValue: () => null, isValid: () => false, setInvalid: () => {} }

function reducerCreateEditor (editorState, { domElement, language, onBlur = null }) {
  if (editorState.isValid()) reducerRemoveEditor(editorState)
  const { getLockedValue, setLockedValue, isValid, setInvalid } = getValueLock()
  CREATE_TINY_MCE_EDITOR({
    ...EDITOR_CONFIG,
    language, // 'en_US' or 'zh_CN'
    target: domElement, // selector: '#' + editorState.editorId
    setup: (editor) => {
      editor.on('init', () => {
        editor.setContent(editorState.value) // need to set content here because the domElement will still have old `this.props.content`
        editor.selection.select(editor.getBody(), true)
        editor.focus()
      })

      editor.on('focus', () => TINY_MCE_TOOLBAR_COMPONENT.activateEditor())
      editor.on('nodeChange', () => TINY_MCE_TOOLBAR_COMPONENT.updateEditorState())

      editor.on('blur', (event) => {
        TINY_MCE_TOOLBAR_COMPONENT.deactivateEditor()

        onBlur && setTimeout(() => onBlur(event), 0) // reduce update time
        // http://stackoverflow.com/questions/23105694/how-to-make-tinymce-4-toolbar-external-and-always-visible
        // event.stopImmediatePropagation()
        // event.focus()
        // return false
      })

      if (!isValid()) REMOVE_TINY_MCE_EDITOR(editor) // already expired, prevent leak
      else setLockedValue(editor)
    }
  })
  return { ...editorState, getLockedValue, isValid, setInvalid }
}

function reducerRemoveEditor (editorState) {
  if (!editorState.isValid()) return editorState
  editorState.setInvalid()
  const editor = editorState.getLockedValue()
  if (!editor) return editorState
  const value = editor.getContent()
  REMOVE_TINY_MCE_EDITOR(editor)
  return { ...editorState, ...DEFAULT_EDITOR_STATE, value }
}

function getValueLock () {
  let valid = true
  let lockedValue = null
  return { getLockedValue: () => lockedValue, setLockedValue: (value) => (lockedValue = value), isValid: () => valid, setInvalid: () => (valid = false) }
}

export {
  TINY_MCE,
  SET_TINY_MCE_TOOLBAR_COMPONENT,
  DEFAULT_EDITOR_STATE,
  reducerCreateEditor,
  reducerRemoveEditor
}
