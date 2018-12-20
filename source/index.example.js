import React, { PureComponent } from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import styled, { createGlobalStyle } from 'styled-components'

import { createStateStore } from './__utils__'
import { TinyMCEComponent, createEditorStore, Toolbar, LOCALE_LIST, GET_LOCALE, SET_LOCALE, TinyMCEPanelRestyleGlobalStyle } from './index'

import { name as packageName, version as packageVersion } from '../package.json'

const COLOR_PRIMARY = '#F55D54'
const COLOR_BORDER = '#D9D9D9'
const COLOR_BUTTON_FOREGROUND = '#222'
const COLOR_BUTTON_BACKGROUND = '#CCC'
const COLOR_BUTTON_BACKGROUND_LIGHT = '#DDD'
const COLOR_BUTTON_BACKGROUND_LIGHTER = '#EEE'
const BUTTON_SIZE = '40px'
const BUTTON_WIDTH_MIN = '40px'

const ExampleGlobalStyle = createGlobalStyle`
  .example-button,
  .example-status {
    position: relative;
    display: flex;
    flex-flow: column;
    align-items: center;
    justify-content: center;
    overflow: visible;
    padding: 0 4px;
    min-width: ${BUTTON_WIDTH_MIN};
    height: ${BUTTON_SIZE};
    color: ${COLOR_BUTTON_FOREGROUND};
  
    & + .example-button { margin-left: 12px; }
    & + .example-status { margin-left: 12px; }
  }
  
  .example-button {
    background: ${COLOR_BUTTON_BACKGROUND};
    &:hover { background: ${COLOR_BUTTON_BACKGROUND_LIGHT}; }
    &.select {
      background: ${COLOR_BUTTON_BACKGROUND_LIGHTER};
      box-shadow: inset 0 0 0 1px ${COLOR_BORDER};
      border-bottom: 2px solid ${COLOR_PRIMARY};
    }
  }

  .tooltip-top,
  .tooltip-bottom,
  .tooltip-left {
    position: relative;
    &:hover {
      &::before, &::after {
        display: block;
        pointer-events: none;
        position: absolute;
        z-index: 1;
      }
      &::before {
        content: '';
        width: 0;
        height: 0;
        border: 5px solid transparent;
      }
      &::after {
        content: attr(data-tooltip-content);
        padding: 4px 8px;
        font-size: 12px;
        line-height: 1.4;
        white-space: nowrap;
        text-align: center;
        text-decoration: none;
        color: #fff;
        background: #000;
      }
    }
  }
  
  .tooltip-top:hover {
    &::before { left: 50%; bottom: calc(100% + 2px); transform: translate(-50%, 0); border-top-color: #000; border-bottom-width: 0; }
    &::after { left: 50%; bottom: calc(100% + 7px); transform: translate(-50%, 0); }
  }
  
  .tooltip-bottom:hover {
    &::before { left: 50%; top: calc(100% + 2px); transform: translate(-50%, 0); border-bottom-color: #000; border-top-width: 0; }
    &::after { left: 50%; top: calc(100% + 7px); transform: translate(-50%, 0); }
  }
  
  .tooltip-left:hover {
    &::before { top: 50%; right: calc(100% + 2px); transform: translate(0, -50%); border-left-color: #000; border-right-width: 0; }
    &::after { top: 50%; right: calc(100% + 7px); transform: translate(0, -50%); }
  }
  
  .tooltip-lock {
    & .tooltip-top:hover,
    & .tooltip-bottom:hover,
    & .tooltip-left:hover {
      &::before, &::after { display: none; }
    }
  }
`

const CSSExampleRootDiv = styled.div`
  display: flex;
  flex-flow: column;
  align-items: center;
  justify-content: flex-start;
  margin: 0 auto;
  width: 720px;
  max-height: 100%;
  overflow: auto;
  box-shadow: inset 0 0 0 1px ${COLOR_BORDER};

  & > .button-row {
    display: flex;
    flex-flow: row;
    margin: 12px 0;
    width: 100%;
  }

  & > .example-edit-toolbar {
    overflow: visible;
    display: flex;
    margin: 12px 0;
    height: 32px;
    box-shadow: inset 0 0 0 1px ${COLOR_BORDER};
  }

  & > .example-tiny-mce-content {
    overflow: auto;
    margin: 12px 0;
    box-shadow: inset 0 0 0 1px ${COLOR_BORDER};

    &.display > div {
      pointer-events: none;
      cursor: default;
      user-select: none;
      min-width: 100%;
      min-height: 100%;
    }
    &.edit > div {
      pointer-events: auto;
      cursor: auto;
      user-select: text;
      -webkit-touch-callout: default; /* iOS Safari */
      min-height: calc(100% + 1px);
    }
    /* Fix for TinyMCE getScrollContainer look-up code */
    /* https://github.com/tinymce/tinymce/blob/86958160cb14309f5d36c53e5fa7b4b011b6e4a8/src/core/src/main/js/dom/Selection.js#L911 */
  }

  & > .example-model-container {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.4);
    display: flex;
    align-items: center;
    justify-content: center;
    pointer-events: none;
    opacity: 0;
    transition: opacity 0.4s ease-out;

    & > .modal-fullscreen-content {
      background: #fff;
      box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.1);
      transform: translate3d(0, -360px, 0);
      transition: transform 0.4s ease-out;
    }

    &.show-fullscreen {
      pointer-events: auto;
      opacity: 1;
      & > .modal-fullscreen-content { transform: translate3d(0, 0, 0); }
    }
  }
`

const CSSExampleModalDiv = styled.div`
  & > .title {
    padding: 14px 20px 8px;
    font-size: 24px;
    font-weight: bold;
    text-align: center;
    border-bottom: 1px solid ${COLOR_BORDER};
  }
  & > .content {
    margin: 20px;
    overflow-y: auto;
    max-width: 480px;
    max-height: 600px;
    word-wrap: break-word;
  }
`

const ExampleButton = ({ name = '', className = '', onClick = null, select = false }) => <div
  className={`safari-flex-button example-button ${select ? 'select' : ''} ${className || ''}`}
  onClick={onClick || null}
>{name}</div>
ExampleButton.propTypes = {
  name: PropTypes.string,
  className: PropTypes.string,
  select: PropTypes.bool,
  onClick: PropTypes.func
}

const ExampleStatus = ({ name = '', className = '' }) => <div className={`example-status ${className || ''}`}>{name}</div>
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
    return <CSSExampleModalDiv>
      <p className="title">{title || ''}</p>
      {message && <pre className="content">{message || ''}</pre>}
      <ExampleButton name="Close" onClick={doClose} />
    </CSSExampleModalDiv>
  }
}

const CONTENT_STYLE_SIZE_LIST = [
  { width: '60px', height: '40px' },
  { width: '120px', height: '80px' },
  { width: '300px', height: '200px' },
  { width: '600px', height: '400px' }
]

const initExample = ({ rootElement, locale = 'en_US' }) => {
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
  const renderExample = ({ locale, isLock, value, isActive, contentStyle, modal }) => {
    ReactDOM.render(<CSSExampleRootDiv>
      <div className="button-row">
        {LOCALE_LIST.map((v) => <ExampleButton key={v} name={v} select={locale === v} onClick={() => changeLocale(v)} />)}
        {CONTENT_STYLE_SIZE_LIST.map((v, i) => <ExampleButton key={i} name={`Size ${i}`} select={contentStyle === v} onClick={() => setState({ contentStyle: v })} />)}
        <ExampleStatus name={`${packageName}@${packageVersion}`} />
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

      <ExampleGlobalStyle />
      <TinyMCEPanelRestyleGlobalStyle />
    </CSSExampleRootDiv>, rootElement)
  }

  // trigger initial render
  changeLocale(locale)

  // return for Debug
  return { getState, setState, renderExample, editorStore }
}

export { initExample }
