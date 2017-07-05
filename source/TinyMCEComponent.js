import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { getRandomId } from './__utils__'
import { DEFAULT_EDITOR_STATE, reducerCreateEditor, reducerRemoveEditor } from './TinyMCE'
import './tiny-mce-component.pcss'

// TODO: NOTE: picked from https://github.com/instructure-react/react-tinymce/blob/4bddd289b474c09e621e02e33b3989aad36b38f4/lib/components/TinyMCE.js

class TinyMCEComponent extends PureComponent {
  static propTypes = {
    isActive: PropTypes.bool,
    value: PropTypes.string,
    onEditEnd: PropTypes.func, // possible value change
    locale: PropTypes.string
  }

  constructor (props) {
    super(props)

    this.editorState = { ...DEFAULT_EDITOR_STATE, editorId: getRandomId() }

    this.setElementRef = (ref) => (this.divElement = ref)
    this.divElement = null
  }

  doCreateEditor () {
    this.editorState = { ...this.editorState, value: this.props.value }
    this.editorState = reducerCreateEditor(this.editorState, { domElement: this.divElement, language: this.props.locale })
  }

  doRemoveEditor () {
    if (!this.editorState.isValid()) return
    this.editorState = reducerRemoveEditor(this.editorState)
    this.props.onEditEnd(this.editorState.value)
  }

  componentDidMount () { if (this.props.isActive) this.doCreateEditor() }

  componentWillUnmount () { this.doRemoveEditor() }

  componentDidUpdate () {
    if (this.props.isActive === this.editorState.isValid()) return
    if (this.props.isActive) this.doCreateEditor()
    else this.doRemoveEditor()
  }

  render () {
    const { value } = this.props
    return <div
      id={this.editorState.editorId}
      ref={this.setElementRef}
      className="tiny-mce-content"
      dangerouslySetInnerHTML={{ __html: value }}
    />
  }
}

export {
  TinyMCEComponent
}
