import React, { PureComponent } from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import { TinyMCEComponent, EditorToolbar, LOCALE_LIST, GET_LOCALE, SET_LOCALE } from './index'

import LocalClassName from './index.example.pcss'
const CSS_EXAMPLE_ROOT = LocalClassName[ 'example-root' ]

const ExampleButton = ({ name = '', className = '', onClick = null, select = false }) => <div
  className={`example-button safari-flex-button ${select ? 'select' : ''} ${className}`}
  onClick={onClick}
>{name}</div>
ExampleButton.propTypes = {
  name: PropTypes.string,
  className: PropTypes.string,
  select: PropTypes.bool,
  onClick: PropTypes.func
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
    return <div>
      <h2>{title || ''}</h2>
      <p>{message || ''}</p>
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

function initExample ({ rootElement, locale }) {
  let state = {
    locale,
    isLock: false,
    value: `<h2>MB React TinyMCE</h2><p>Double click here or click above button 'TinyMCEComponent' to enter edit mode</p>`,
    isActive: false,
    contentStyle: CONTENT_STYLE_SIZE_LIST[ CONTENT_STYLE_SIZE_LIST.length - 1 ],
    modal: null
  }
  const getState = () => state
  const setState = (nextState) => {
    state = { ...state, ...nextState }
    renderExample(state)
  }

  const showAlertModal = ({ title, message }) => setState({ modal: { title, message } })
  const showPendingModal = ({ pendingPromise, title, message }) => setState({ modal: { pendingPromise, title, message } })
  const doCloseExampleModal = () => setState({ modal: null })
  const uploadSingleAsset = (asset) => new Promise((resolve, reject) => {
    const reader = new window.FileReader()
    reader.readAsDataURL(asset)
    // reader.addEventListener('load', () => reject(new Error('Test Error Message'))) // test with Error
    reader.addEventListener('load', () => setTimeout(() => resolve({ image: reader.result }), 2000)) // test with delay
    reader.addEventListener('error', reject)
  })
  const changeLocale = (locale) => {
    SET_LOCALE(locale)
    setState({ locale: GET_LOCALE() })
  }
  const onEditEnd = (value) => {
    const valueBrief = value.length > 100 ? `${value.slice(0, 80)}...(+${value.length - 80} char)` : value
    setState({ value, modal: { title: 'Edit Result', message: valueBrief } })
  }

  function renderExample ({ locale, isLock, value, isActive, contentStyle, modal }) {
    ReactDOM.render(<div className={CSS_EXAMPLE_ROOT}>
      <div className="button-row">
        {LOCALE_LIST.map((v) => <ExampleButton
          key={v}
          name={v}
          select={locale === v}
          onClick={() => changeLocale(v)}
        />)}
        {CONTENT_STYLE_SIZE_LIST.map((v, i) => <ExampleButton
          key={i}
          name={`Size ${i}`}
          select={contentStyle === v}
          onClick={() => setState({ contentStyle: v })}
        />)}
      </div>

      <div className="button-row">
        <ExampleButton
          name={`EditorToolbar: ${isLock ? 'Locked' : 'Unlocked'}`}
          onClick={() => setState({ isLock: !isLock })}
          select={!isLock}
        />
        <ExampleButton
          name={`TinyMCEComponent: ${isActive ? 'Edit' : 'Display'}`}
          onClick={() => setState({ isActive: !isActive })}
          select={isActive}
        />
      </div>

      <div className="example-edit-toolbar">
        <EditorToolbar
          isLock={isLock}
          showAlertModal={showAlertModal}
          showPendingModal={showPendingModal}
          uploadSingleAsset={uploadSingleAsset}
        />
      </div>

      <div
        className={`example-tiny-mce-content ${isActive ? 'edit' : 'display'}`}
        style={contentStyle}
        onDoubleClick={() => setState({ isActive: !isActive })}
      >
        <TinyMCEComponent
          locale={locale}
          value={value}
          isActive={isActive}
          onEditEnd={onEditEnd}
        />
      </div>

      <div className={`example-model-container ${modal ? 'show-fullscreen' : ''}`}>
        <div className="modal-fullscreen-content">
          {modal && <ExampleModal {...modal} doClose={doCloseExampleModal} />}
        </div>
      </div>
    </div>, rootElement)
  }

  changeLocale(locale)

  return {
    getState,
    setState,
    renderExample
  }
}

export {
  initExample
}
