import React, { PureComponent } from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import { createStateStore } from './__utils__'
import { TinyMCEComponent, createEditorStore, Toolbar, LOCALE_LIST, GET_LOCALE, SET_LOCALE } from './index'

import LocalClassName from './index.example.pcss'
const CSS_EXAMPLE_ROOT = LocalClassName[ 'example-root' ]
const CSS_EXAMPLE_MODAL = LocalClassName[ 'example-modal' ]
const CSS_EXAMPLE_BUTTON = LocalClassName[ 'example-button' ]
const CSS_EXAMPLE_STATUS = LocalClassName[ 'example-status' ]

const ExampleButton = ({ name = '', className = '', onClick = null, select = false }) => <div
  className={`safari-flex-button ${CSS_EXAMPLE_BUTTON} ${select ? 'select' : ''} ${className || ''}`}
  onClick={onClick || null}
>{name}</div>
ExampleButton.propTypes = {
  name: PropTypes.string,
  className: PropTypes.string,
  select: PropTypes.bool,
  onClick: PropTypes.func
}

const ExampleStatus = ({ name = '', className = '' }) => <div className={`${CSS_EXAMPLE_STATUS} ${className || ''}`}>{name}</div>
ExampleStatus.propTypes = {
  name: PropTypes.string,
  className: PropTypes.string
}

class ExampleModal extends PureComponent {
  static propTypes = {
    pendingPromise: PropTypes.object,
    title: PropTypes.string,
    message: PropTypes.string,
    doClose: PropTypes.func
  }

  componentDidMount () {
    this.props.pendingPromise && this.props.pendingPromise // this is a fork of promise chain, will not have follow up then()
      .then((result) => this.props.doClose(result))
      .catch((error) => this.props.doClose(error, 'error'))
  }

  render () {
    const { title, message, doClose } = this.props
    return <div className={CSS_EXAMPLE_MODAL}>
      <p className="title">{title || ''}</p>
      {message && <pre className="content">{message || ''}</pre>}
      <ExampleButton name="Close" onClick={doClose} />
    </div>
  }
}

const CONTENT_STYLE_SIZE_LIST = [
  { width: '60px', height: '40px' },
  { width: '120px', height: '80px' },
  { width: '300px', height: '200px' },
  { width: '600px', height: '400px' }
]

function initExample ({ rootElement, locale = 'en_US' }) {
  const editorStore = createEditorStore()

  const { getState, setState, subscribe } = createStateStore({
    locale,
    isLock: false,
    value: `<h2>MB React TinyMCE</h2><p>Double click here or click above button 'TinyMCEComponent' to enter edit mode</p>`,
    isActive: false,
    contentStyle: CONTENT_STYLE_SIZE_LIST[ CONTENT_STYLE_SIZE_LIST.length - 1 ],
    modal: null
  })

  subscribe((state) => renderExample(state))

  // pre-connected methods
  const showAlertModal = ({ title, message }) => setState({ modal: { title, message } })
  const showPendingModal = ({ pendingPromise, title, message }) => setState({ modal: { pendingPromise, title, message } })
  const doCloseExampleModal = () => setState({ modal: null })
  const uploadSingleAsset = (imageFile) => new Promise((resolve, reject) => {
    const reader = new window.FileReader()
    reader.readAsDataURL(imageFile)
    reader.addEventListener('load', () => resolve(reader.result))
    reader.addEventListener('error', reject)
  }).then((imageDataURL) => new Promise((resolve, reject) => {
    const imgElement = document.createElement('img')
    imgElement.addEventListener('load', () => resolve({ image: imageDataURL, width: imgElement.width, height: imgElement.height }))
    imgElement.addEventListener('error', reject)
    imgElement.src = imageDataURL
  })).then((result) => new Promise((resolve) => setTimeout(() => resolve(result), 2000))) // add 2sec delay for debug
  const changeLocale = (locale) => {
    SET_LOCALE(locale)
    setState({ locale: GET_LOCALE() })
  }
  const onValueChange = (value) => setState({ value, modal: { title: 'Changed Edit Result', message: value.length > 1024 ? `${value.slice(0, 512)}...(+${value.length - 512} char)` : value } })
  const doToggleIsLock = () => setState({ isLock: !getState().isLock })
  const doToggleIsActive = () => setState({ isActive: !getState().isActive })

  // render
  function renderExample ({ locale, isLock, value, isActive, contentStyle, modal }) {
    ReactDOM.render(<div className={CSS_EXAMPLE_ROOT}>
      <div className="button-row">
        {LOCALE_LIST.map((v) => <ExampleButton key={v} name={v} select={locale === v} onClick={() => changeLocale(v)} />)}
        {CONTENT_STYLE_SIZE_LIST.map((v, i) => <ExampleButton key={i} name={`Size ${i}`} select={contentStyle === v} onClick={() => setState({ contentStyle: v })} />)}
      </div>

      <div className="button-row">
        <ExampleStatus name={`TinyMCEComponent: ${isActive ? 'Edit' : 'Display'}`} />
        <ExampleStatus name={`Toolbar: ${isLock ? 'Locked' : 'Unlocked'}`} />
        <ExampleButton name={`${isActive ? 'End' : 'Start'} Editing`} onClick={doToggleIsActive} select={isActive} />
        {isActive && <ExampleButton name={`${isLock ? 'Unlock' : 'Lock'} Toolbar`} onClick={doToggleIsLock} select={isLock} />}
      </div>

      <div className="example-edit-toolbar">
        <Toolbar {...{ editorStore, isLock, showAlertModal, showPendingModal, uploadSingleAsset }} />
      </div>

      <div className={`example-tiny-mce-content ${isActive ? 'edit' : 'display'}`} style={contentStyle} onDoubleClick={isActive ? null : doToggleIsActive}>
        <TinyMCEComponent {...{ editorStore, value, isActive, locale, onChange: onValueChange }} />
      </div>

      <div className={`example-model-container ${modal ? 'show-fullscreen' : ''}`}>
        <div className="modal-fullscreen-content">
          {modal && <ExampleModal {...modal} doClose={doCloseExampleModal} />}
        </div>
      </div>
    </div>, rootElement)
  }

  // trigger initial render
  changeLocale(locale)

  // return for Debug
  return { getState, setState, renderExample, editorStore }
}

export {
  initExample
}
