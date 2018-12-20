import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import { createEditor, deleteEditor, createEditorStore } from './editorStore'

// const COLOR_PRIMARY = '#EB5648'
const COLOR_SELECTION = 'rgba(235, 85, 71, 0.4)' // 'color(var(--color-primary) a(0.4))'
const COLOR_TEXT_80 = '#525E71'

const TinyMCEComponentDiv = styled.div`
  padding: 2px;
  font-size: 12px;
  color: ${COLOR_TEXT_80};
  & *::selection { background: ${COLOR_SELECTION}; }

  & ol,
  & ul { margin: 1em 0; padding-left: 2em; }

  & table {
    & td,
    & th,
    & caption { border: 1px dashed #bbb; }
    & tr:nth-child(even) { background: #eee; }
  }
`

// TODO: NOTE: picked from https://github.com/instructure-react/react-tinymce/blob/4bddd289b474c09e621e02e33b3989aad36b38f4/lib/components/TinyMCE.js

class TinyMCEComponent extends PureComponent {
  static propTypes = {
    editorStore: PropTypes.object,
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func, // possible value change
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
    if (!editorStore) return
    createEditor(editorStore, this.divElement, locale, value)
  }

  doRemoveEditor () {
    const { editorStore, value, onChange } = this.props
    if (!editorStore) return
    const nextValue = deleteEditor(editorStore)
    onChange && nextValue !== undefined && nextValue !== value && onChange(nextValue)
  }

  componentDidMount () { this.props.isActive && this.doCreateEditor() }

  componentWillUnmount () { this.doRemoveEditor() }

  componentDidUpdate (prevProps) {
    if (this.props.isActive === prevProps.isActive) return
    this.props.isActive ? this.doCreateEditor() : this.doRemoveEditor()
  }

  render () {
    const { value } = this.props
    return <TinyMCEComponentDiv ref={this.setElementRef} dangerouslySetInnerHTML={{ __html: value }} />
  }
}

export { TinyMCEComponent, createEditorStore }
