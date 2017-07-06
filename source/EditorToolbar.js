import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import './editor-toolbar.pcss'

import { TRANSLATE, MockingBotIcon } from './__utils__'

import { Select as EditorSelect } from './editor-item'

import { SET_TINY_MCE_TOOLBAR_COMPONENT } from './TinyMCE'

function $(selector, context = document) {
  return context.querySelector(selector)
}

function $$(selector, context = document) {
  return [...context.querySelectorAll(selector)]
}

function hide($elmt) {
  return Object.assign($elmt.style, { display: 'none' })
}

function show($elmt) {
  return Object.assign($elmt.style, { display: 'initial' })
}

const EDITOR_TOOLBAR_LIST = [
  'fontSize',
  'bold',
  'italic',
  'underline',
  'strikeThrough',
  'foreColor',
  'alignment',
  'insertUnorderedList',
  'insertOrderedList',
  'insertTable',
  'insertLink',
  'insertImage',
]

const EDITOR_COLOR_LIST = [
  '#000', '#9B9B9B', '#4A4A4A',
  '#417505', '#B8E986', '#7ED321',
  '#FF001F', '#8B572A', '#F6A623', '#F8E71C',
  '#BD0FE1', '#9013FE', '#4990E2', '#50E3C2',
]

const EDITOR_ALIGNMENT_LIST = [
  { val: 'justifyLeft', item: <MockingBotIcon name="justifyLeft" /> },
  { val: 'justifyCenter', item: <MockingBotIcon name="justifyCenter" /> },
  { val: 'justifyRight', item: <MockingBotIcon name="justifyRight" /> },
  /*{ val: 'justifyFull', item:  <mockingboticon name="justifyFull" /> },*/
]

const EDITOR_TOOLBAR_MAP = {
  fontSize: ({ state: { editor: { fontSize } } }) => (
    <EditorSelect
      key="fontSize"
      className="font-size-picker"
      optionList={[12, 14, 16, 18, 20, 22, 24]}
      createOnSelectHandler={fontSize => () => tinyMCE.execCommand('fontSize', true, `${fontSize}px`)}
      getListItem={fontSize => `${fontSize}px`}
      currentOption={(
        <div className="font-size-indicator">
          {/px$/i.test(fontSize) ? fontSize : `${fontSize}px`}
        </div>
      )}
      dataTooltipContent={TRANSLATE('TinyMCE:fontSize')}
    />
  ),

  foreColor: ({ state: { editor: { foreColor } } }) => (
    <EditorSelect
      key="foreColor"
      className="color-picker"
      optionList={EDITOR_COLOR_LIST}
      createOnSelectHandler={color => () => tinyMCE.execCommand('foreColor', true, color)}
      currentOption={(
        <div className="foreColor">
          <MockingBotIcon name="foreColor" />
          <div className="fore-color-indicator" style={{ background: foreColor }} />
        </div>
      )}
      getListItem={color => <div className="color-item" style={{ background: color }} />}
      dataTooltipContent={TRANSLATE('TinyMCE:foreColor')}
    />
  ),

  alignment: ({ state: { editor: { alignment } } }) => (
    <EditorSelect
      key="alignment"
      className="alignment"
      optionList={EDITOR_ALIGNMENT_LIST}
      currentOptionIdx={Math.max(0, EDITOR_ALIGNMENT_LIST.findIndex(({ val }) => val === alignment))}
      createOnSelectHandler={({ val }) => () => tinyMCE.execCommand(val, true)}
      dataTooltipContent={TRANSLATE('TinyMCE:alignment')}
    />
  ),

  insertTable: toolbar => (
    <button
      key="insertTable"
      className="tooltip-top"
      onClick={toolbar.onCreateTable}
      data-tooltip-content={TRANSLATE('TinyMCE:insertTable')}
    >
      <MockingBotIcon name="insertTable" />
    </button>
  ),

  insertLink: toolbar => (
    <button
      key="insertLink"
      className="tooltip-top"
      onClick={toolbar.onCreateLink}
      data-tooltip-content={TRANSLATE('TinyMCE:insertLink')}
    >
      <MockingBotIcon name="insertLink" />
    </button>
  ),

  insertImage: toolbar => (
    <button
      key="insertImage"
      className="tooltip-top"
      onClick={toolbar.onClickUploadBtn}
      data-tooltip-content={TRANSLATE('TinyMCE:insertImage')}
    >
      <MockingBotIcon name="insertImage" />
    </button>
  ),
}

class EditorToolbar extends PureComponent {
  static propTypes = {
    isLock: PropTypes.bool,
    className: PropTypes.string,
    showAlertModal: PropTypes.func.isRequired,
    showPendingModal: PropTypes.func.isRequired,
    uploadSingleAsset: PropTypes.func.isRequired
  }

  constructor (props) {
    super(props)

    this.setElementRef = (ref) => this.elementRef = ref
    this.elementRef = null

    this.state = {
      isEditorActivated: false,
      isFocused: false,
      isTableMenuOpen: false,

      editor: {
        fontSize: 12,
        bold: false,
        italic: false,
        underline: false,
        strikeThrough: false,
        foreColor: '#000',
        alignment: 'left',
        insertOrderedList: false,
        insertUnorderedList: false,
      },
    }
  }

  componentDidMount() {
    // Expose the instance to TinyMCE for future usage:
    SET_TINY_MCE_TOOLBAR_COMPONENT(this)
  }

  onFocus = () => this.setState({ isFocused: true })
  onBlur = () => this.setState({ isFocused: false, isEditorActivated: !!tinyMCE.activeEditor })

  activateEditor = () => this.setState({ isEditorActivated: true })
  deactivateEditor = () => this.setState({ isEditorActivated: this.state.isFocused })

  setFontSize = fontSize => tinyMCE.execCommand('fontSize', true, `${fontSize}px`)
  createExecCommandToggler = style => () => tinyMCE.execCommand(style, true)

  onCreateTable = ({ currentTarget }) => {
    const $tableBtn = $('.TINY_MCE_FIXED_TOOLBAR button')
    if (!$tableBtn) return
    $tableBtn.click()

    const $tableCreateBtn = $('body > .mce-menu [role="menuitem"]')
    if (!$tableCreateBtn) return
    $tableCreateBtn.click()

    const [$tableMenu, $tableCreateMenu] = $$('body > .mce-menu[role="application"]')
    const $tableCreator = currentTarget

    hide($tableMenu)
    hide($tableCreateMenu)

    // To avoid TinyMCE overwriting
    setTimeout(() => {
      show($tableCreateMenu)
      $('table.mce-grid a.mce-active').classList.remove('mce-active')
      $('table.mce-grid td:last-child a').classList.add('mce-active')
    }, 200)

    $tableCreateMenu.addEventListener('click', () => hide($tableCreateMenu))

    const { top, left, height } = $tableCreator.getBoundingClientRect()

    Object.assign($tableCreateMenu.style, {
      top: `${top + height}px`,
      left: `${left - 150}px`,
      marginTop: 0,
    })
  }

  onCreateLink = () => {
    const $linkCreateBtn = $$('.TINY_MCE_FIXED_TOOLBAR button')[ 1 ]

    if ($linkCreateBtn) {
      $linkCreateBtn.click()
    }
  }

  onClickUploadBtn = () => {
    if (!this.state.isEditorActivated || !this.elementRef) return

    const inputFileElement = this.elementRef
    const { showPendingModal, showAlertModal, uploadSingleAsset } = this.props

    const onFileSelectEvent = () => {
      inputFileElement.removeEventListener('change', onFileSelectEvent)

      const imageFile = inputFileElement.files[ 0 ]
      inputFileElement.value = ''

      const pendingPromise = uploadSingleAsset(imageFile)
        .then(({ image, width }) => {
          tinyMCE.activeEditor.insertContent(`<img src=${image} width="${Math.min(width, 500)}" />`)
        })
        .catch((error) => showAlertModal({
          title: TRANSLATE('TinyMCE:alert:upload-error'),
          message: error.message
        }))

      showPendingModal({
        title: TRANSLATE('TinyMCE:pending:image-upload'),
        pendingPromise
      })
    }

    inputFileElement.addEventListener('change', onFileSelectEvent)
    inputFileElement.click()
  }

  updateEditorState() {
    const editor = tinyMCE.activeEditor

    if (!editor) return

    this.setState({
      editor: {
        fontSize: editor.queryCommandValue('fontSize') || 12,

        bold: editor.queryCommandState('bold'),
        italic: editor.queryCommandState('italic'),
        underline: editor.queryCommandState('underline'),
        strikeThrough: editor.queryCommandState('strikeThrough'),
        foreColor: editor.queryCommandValue('foreColor'),
        insertOrderedList: editor.queryCommandState('insertOrderedList'),
        insertUnorderedList: editor.queryCommandState('insertUnorderedList'),

        alignment: (
          editor.queryCommandValue('justifyLeft') === 'true'
          ? 'justifyLeft'
          : editor.queryCommandValue('justifyCenter') === 'true'
          ? 'justifyCenter'
          : editor.queryCommandValue('justifyRight') === 'true'
          ? 'justifyRight'
          // https://github.com/tinymce/tinymce/issues/1632
          : 'justifyFull'
        ),
      },
    })
  }

  render () {
    // console.log('[RENDER] EditorToolbar ###################################')
    const { isLock, className } = this.props
    const { isEditorActivated, editor } = this.state

    return (
      <div
        className={`tinymce-editor-toolbar ${className} ${!isLock && isEditorActivated ? 'is-activated' : 'isnt-activated tooltip-lock'}`}
        onFocus={this.onFocus}
        onBlur={this.onBlur}
      >
        {
          EDITOR_TOOLBAR_LIST
          .map(it => (
            EDITOR_TOOLBAR_MAP[it]
            ? EDITOR_TOOLBAR_MAP[it](this)
            : (
              <button
                key={it}
                className={`${it} ${editor[it] ? 'is-active' : ''} tooltip-top`}
                data-tooltip-content={TRANSLATE(`TinyMCE:${it}`)}
                onClick={this.createExecCommandToggler(it)}
              >
                <MockingBotIcon name={it} />
              </button>
            )
          ))
        }

        {/* The real TinyMCE toolbar */}
        <div className="TINY_MCE_FIXED_TOOLBAR" />

        {/* The real upload button */}
        <input
          hidden
          type="file"
          accept="image/png,image/jpeg,image/gif"
          ref={this.setElementRef}
        />
      </div>
    )
  }
}

export default EditorToolbar

