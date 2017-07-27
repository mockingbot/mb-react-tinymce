import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'

import { TRANSLATE, MockingBotIcon } from 'source/__utils__'
import { Select } from './Select'

import LocalClassName from './index.pcss'
const CSS_TOOLBAR = LocalClassName[ 'toolbar' ]
const CSS_TOOLBAR_BUTTON = LocalClassName[ 'toolbar-button' ]

class Toolbar extends PureComponent {
  static propTypes = {
    editorStore: PropTypes.object.isRequired,
    showAlertModal: PropTypes.func.isRequired,
    showPendingModal: PropTypes.func.isRequired,
    uploadSingleAsset: PropTypes.func.isRequired,
    isLock: PropTypes.bool, // lock
    className: PropTypes.string
  }

  constructor (props) {
    super(props)

    this.onFileSelect = () => {
      if (!this.inputFileElement) return
      const { showPendingModal, showAlertModal, uploadSingleAsset } = this.props
      const imageFile = this.inputFileElement.files[ 0 ]
      const pendingPromise = uploadSingleAsset(imageFile)
        .then(({ image, width }) => this.getEditorRef() && this.getEditorRef().insertContent(`<img src=${image} width="${Math.min(width, 500)}" />`))
        .catch((error) => showAlertModal({ title: TRANSLATE('TinyMCE:alert:upload-error'), message: error.message }))

      showPendingModal({ title: TRANSLATE('TinyMCE:pending:image-upload'), pendingPromise })

      this.inputFileElement.value = '' // clear selected file, or selecting the same file will not trigger onChange
      this.inputFileElement.removeEventListener('change', this.onFileSelect)
    }

    this.showMenuInsertImage = () => {
      if (!this.inputFileElement) return
      this.inputFileElement.addEventListener('change', this.onFileSelect)
      this.inputFileElement.click()
    }

    this.buttonMap = [ 'bold', 'italic', 'underline', 'strikeThrough', 'insertUnorderedList', 'insertOrderedList' ].reduce((o, command) => {
      o[ command ] = createToolbarStatusButton(command, () => this.execEditorCommand(command))
      return o
    }, {
      'insertTable': createToolbarStatusButton('insertTable', showMenuInsertTable),
      'insertLink': createToolbarStatusButton('insertLink', showMenuInsertLink),
      'insertImage': createToolbarStatusButton('insertImage', this.showMenuInsertImage)
    })

    this.selectMap = {
      'fontSize': createToolbarSelect({
        className: 'select-font-size',
        renderItem: (fontSize) => fontSize,
        renderSelectItem: (fontSize = FONT_SIZE_ITEM_LIST[ 0 ]) => <div>{fontSize}</div>,
        onChange: (fontSize) => this.execEditorCommand('fontSize', fontSize),
        tooltip: 'TinyMCE:fontSize'
      }),
      'foreColor': createToolbarSelect({
        className: 'select-fore-color',
        renderItem: (foreColor) => <span style={{ background: foreColor }} />,
        renderSelectItem: (foreColor = FORE_COLOR_ITEM_LIST[ 0 ]) => <div>
          <MockingBotIcon name="foreColor" />
          <span style={{ background: foreColor }} />
        </div>,
        onChange: (foreColor) => this.execEditorCommand('foreColor', foreColor),
        tooltip: 'TinyMCE:foreColor'
      }),
      'alignment': createToolbarSelect({
        className: 'select-alignment',
        renderItem: (alignment) => <MockingBotIcon name={alignment} />,
        onChange: (alignment) => this.execEditorCommand(alignment),
        tooltip: 'TinyMCE:alignment'
      })
    }

    this.setInputFileElementRef = (ref) => (this.inputFileElement = ref)
    this.inputFileElement = null

    this.doSetState = (state) => this.setState(state)
    this.getEditorRef = () => this.state.editorRef
    this.execEditorCommand = (command, value) => this.getEditorRef() && this.getEditorRef().execCommand(command, true, value) // execCommand(command:String, ui:Boolean, value:Object, args:Object):Boolean
    this.state = this.props.editorStore.getState() // sync to editorState
  }

  componentDidMount () {
    this.props.editorStore.subscribe(this.doSetState)
  }

  componentWillUnmount () {
    this.props.editorStore.unsubscribe(this.doSetState)
  }

  render () {
    const { isLock: isLockProps, className } = this.props
    const { editorRef, editorStatus } = this.state
    const isLock = isLockProps || !editorRef
    return <div className={`${CSS_TOOLBAR} TINY_MCE_CUSTOM_UI ${className || ''}`} onMouseDown={muteEvent} tabIndex="-1">
      {this.selectMap.fontSize(FONT_SIZE_ITEM_LIST, FONT_SIZE_ITEM_LIST.indexOf(editorStatus.fontSize), isLock)}

      {this.buttonMap.bold(editorStatus.bold, isLock)}
      {this.buttonMap.italic(editorStatus.italic, isLock)}
      {this.buttonMap.underline(editorStatus.underline, isLock)}
      {this.buttonMap.strikeThrough(editorStatus.strikeThrough, isLock)}

      {this.selectMap.foreColor(FORE_COLOR_ITEM_LIST, FORE_COLOR_ITEM_LIST.indexOf(editorStatus.foreColor), isLock)}
      {this.selectMap.alignment(ALIGNMENT_ITEM_LIST, getAlignmentItemIndex(editorStatus), isLock)}

      {this.buttonMap.insertUnorderedList(editorStatus.insertUnorderedList, isLock)}
      {this.buttonMap.insertOrderedList(editorStatus.insertOrderedList, isLock)}

      {this.buttonMap.insertTable(false, isLock)}
      {this.buttonMap.insertLink(false, isLock)}
      {this.buttonMap.insertImage(false, isLock)}

      {/* The real TinyMCE toolbar */}
      <div className="TINY_MCE_FIXED_TOOLBAR" />

      {/* The real upload button */}
      <input ref={this.setInputFileElementRef} type="file" accept="image/png,image/jpeg,image/gif" hidden />
    </div>
  }
}

const muteEvent = (event) => {
  event && event.preventDefault()
  event && event.stopPropagation()
  return false
}

const createToolbarStatusButton = (command, onClick = null) => (isSelect, isLock) => <div
  className={`safari-flex-button ${CSS_TOOLBAR_BUTTON} ${isSelect ? 'select' : ''} ${isLock ? 'lock' : 'tooltip-top'}`}
  onClick={isLock ? null : onClick}
  data-tooltip-content={TRANSLATE(`TinyMCE:${command}`)}
>
  <MockingBotIcon name={command} />
</div>

const createToolbarSelect = ({ renderItem, renderSelectItem, onChange, className, tooltip }) => (itemList, selectItemIndex, isLock) => <Select
  className={className}
  itemList={itemList}
  selectItemIndex={selectItemIndex}
  renderItem={renderItem}
  renderSelectItem={renderSelectItem || renderItem}
  onChange={onChange}
  isLock={isLock}
  tooltip={TRANSLATE(tooltip)}
/>

const FONT_SIZE_ITEM_LIST = [ 12, 13, 14, 16, 18, 20, 28, 36, 48, 72 ].map((v) => `${v}px`)
const FORE_COLOR_ITEM_LIST = [
  '#000000', '#9b9b9b', '#4a4a4a', '#417505', '#b8e986', '#7ed321', '#ff001f',
  '#8b572a', '#f6a623', '#f8e71c', '#bd0fe1', '#9013fe', '#4990e2', '#50e3c2'
]

const ALIGNMENT_ITEM_LIST = [ 'justifyLeft', 'justifyCenter', 'justifyRight' ]
const getAlignmentItemIndex = ({ justifyLeft, justifyCenter, justifyRight }) => justifyLeft ? ALIGNMENT_ITEM_LIST.indexOf('justifyLeft')
  : justifyCenter ? ALIGNMENT_ITEM_LIST.indexOf('justifyCenter')
    : justifyRight ? ALIGNMENT_ITEM_LIST.indexOf('justifyRight')
      : 0 // display as justifyLeft, but should be JustifyFull or JustifyNone

const showMenuInsertTable = (event) => {
  showMenuInsert()

  const menuItemInsertTable = document.querySelector('[role="menuitem"] > .mce-i-table').parentElement
  if (!menuItemInsertTable) return
  menuItemInsertTable.click() // fake click the menu item

  let menuFloatPanelInsert = findMenuFloatPanel(menuItemInsertTable)
  if (!menuFloatPanelInsert) return
  menuFloatPanelInsert.style.display = 'none'

  let menuFloatPanelInsertTable = findMenuFloatPanel(document.querySelector('.mce-grid.mce-grid-border[role="grid"]'))
  if (!menuFloatPanelInsertTable) return
  const { top, left, height } = event.currentTarget.getBoundingClientRect() // reposition, relative to clicked button
  Object.assign(menuFloatPanelInsertTable.style, { top: `${top + height}px`, left: `${left - 150}px` })
  setTimeout(() => (menuFloatPanelInsertTable.style.display = ''), 0) // after tinyMCE setting display: none;

  const hideMenuFloatPanelInsertTable = () => {
    menuFloatPanelInsertTable.removeEventListener('click', hideMenuFloatPanelInsertTable)
    document.removeEventListener('click', hideMenuFloatPanelInsertTable)
    menuFloatPanelInsertTable.style.display = 'none'
  }
  menuFloatPanelInsertTable.addEventListener('click', hideMenuFloatPanelInsertTable)
  document.addEventListener('click', hideMenuFloatPanelInsertTable)
}

const showMenuInsertLink = () => {
  showMenuInsert() // fake click the menu item

  const menuItemInsertLink = document.querySelector('[role="menuitem"] > .mce-i-link').parentElement
  if (!menuItemInsertLink) return
  menuItemInsertLink.click() // fake click the menu item
}

const showMenuInsert = () => {
  const menuItemInsert = document.querySelector('[role="presentation"] > .mce-i-insert').parentElement
  if (!menuItemInsert) return
  menuItemInsert.click() // fake click the menu item
}

const findMenuFloatPanel = (currentElement) => {
  while (currentElement) {
    if (currentElement.getAttribute('role') === 'application') return currentElement
    currentElement = currentElement.parentElement
  }
}

export {
  Toolbar
}
