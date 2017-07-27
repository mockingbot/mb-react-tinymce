import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'

import { DEFAULT_EDITOR_STATE } from './state'
import { createEditor, deleteEditor, createEditorStore } from './editorStore'

import LocalClassName from './index.pcss'
const CSS_TINY_MCE_COMPONENT = LocalClassName[ 'tiny-mce-component' ]

// TODO: NOTE: picked from https://github.com/instructure-react/react-tinymce/blob/4bddd289b474c09e621e02e33b3989aad36b38f4/lib/components/TinyMCE.js

class TinyMCEComponent extends PureComponent {
  static propTypes = {
    editorStore: PropTypes.object.isRequired,
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired, // possible value change
    isActive: PropTypes.bool, // toggle editor
    locale: PropTypes.string
  }

  constructor (props) {
    super(props)

    this.setElementRef = (ref) => (this.divElement = ref)
    this.divElement = null
  }

  doCreateEditor () {
    const { editorStore, locale, value } = this.props
    createEditor(editorStore, this.divElement, locale, value)
  }

  doRemoveEditor () {
    const { editorStore, value, onChange } = this.props
    const nextValue = deleteEditor(editorStore)
    value !== nextValue && onChange(nextValue)
  }

  componentDidMount () { this.props.isActive && this.doCreateEditor() }

  componentWillUnmount () { this.props.editorStore.getState() !== DEFAULT_EDITOR_STATE && this.doRemoveEditor() }

  componentDidUpdate (prevProps) {
    if (this.props.isActive === prevProps.isActive) return
    this.props.isActive ? this.doCreateEditor() : this.doRemoveEditor()
  }

  render () {
    const { value } = this.props
    return <div ref={this.setElementRef} className={CSS_TINY_MCE_COMPONENT} dangerouslySetInnerHTML={{ __html: value }} />
  }
}

export {
  TinyMCEComponent,
  createEditorStore
}
