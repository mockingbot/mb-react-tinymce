import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import { CSSIcon } from 'source/__utils__'

const COLOR_SELECT = 'rgba(0, 0, 0, 0.06)'
const COLOR_HOVER = 'rgba(0, 0, 0, 0.04)'
const COLOR_SHADOW = 'rgba(0, 0, 0, 0.10)'
const COLOR_PRIMARY = '#EB5648'
const COLOR_BORDER = '#D9D9D9'
const COLOR_TEXT_80 = '#525E71'
const COLOR_INACTIVE = '#BBB'

const CSSSelectDiv = styled.div`
  position: relative;
  margin: 0 1px;
  height: 22px;
  font-size: 16px;
  color: ${COLOR_TEXT_80};

  & > .item-select {
    display: flex;
    flex-flow: row;
    align-items: center;
    padding: 0 5px;
    width: 100%;
    height: 100%;
    &:hover { background: ${COLOR_HOVER}; }
    &.open { background: ${COLOR_SELECT}; }
    &.lock { cursor: not-allowed; color: ${COLOR_INACTIVE}; }
    &.lock, &.lock:hover { background: transparent; }
    & > .icon { margin-left: 5px; color: ${COLOR_INACTIVE}; }
  }

  & > .item-list {
    position: absolute;
    top: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: inset 0 0 0 1px ${COLOR_SHADOW}, 0 2px 8px 0 ${COLOR_SHADOW};
    background: #fff;
    z-index: 1;
    & > .item {
      display: flex;
      align-items: center;
      justify-content: center;
      &:hover { background: ${COLOR_HOVER}; }
      &.select { background: ${COLOR_SELECT}; }
    }
  }

  /* custom style */
  &.select-font-size {
    font-size: 12px;
    & > .item-select > div { min-width: 24px; }
    & > .item-list {
      flex-flow: column;
      & > .item { width: 64px; height: 30px; }
    }
  }

  &.select-fore-color {
    & > .item-select {
      & > div { position: relative; height: 100%; }
      & > div > span { position: absolute; left: 2px; bottom: 4px; width: 13px; height: 1px; }
      &.lock > div > span { opacity: 0.4; }
    }
    & > .item-list {
      flex-flow: row wrap;
      padding: 10px;
      width: 160px;
      & > .item { width: 20px; height: 24px; }
      & > .item > span { width: 14px; height: 14px; box-shadow: inset 0 0 0 1px ${COLOR_SHADOW}; }
    }
  }

  &.select-alignment > .item-list {
    flex-flow: row nowrap;
    justify-content: space-between;
    padding: 10px;
    width: 112px;
    & > .item { width: 24px; height: 24px; }
  }
`
const CSSSelectV2Div = styled.div`
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  padding: 0 5px;
  font-size: 12px;
  color: ${COLOR_TEXT_80};
  & > .item-label {
    pointer-events: none;
    margin-right: 4px;
    white-space: nowrap;
    &.lock { color: ${COLOR_INACTIVE}; }
  }
  & > :local(.select) {
    border-bottom: 1px solid ${COLOR_BORDER};
    &:hover { border-bottom: 1px solid ${COLOR_TEXT_80}; }
    &:focus { border-bottom: 1px solid ${COLOR_PRIMARY}; }
    &.lock {
      cursor: not-allowed;
      border-bottom: 1px solid ${COLOR_BORDER};
      & > * { pointer-events: none; opacity: 0; }
    }
    & > .item-select {
      &:hover,
      &.open { background: transparent; }
    }
  }
`

class Select extends PureComponent {
  static propTypes = {
    itemList: PropTypes.array.isRequired,
    selectItemIndex: PropTypes.number.isRequired,
    renderItem: PropTypes.func.isRequired,
    renderSelectItem: PropTypes.func,
    onChange: PropTypes.func.isRequired,
    isLock: PropTypes.bool,
    className: PropTypes.string,
    tooltip: PropTypes.string
  }

  constructor (props) {
    super(props)

    this.toggleIsOpen = () => this.setState({ isOpen: !this.state.isOpen })
    this.onDismissClick = (event) => this.divElement && !this.divElement.contains(event.target) && this.setState({ isOpen: false })

    this.setElementRef = (ref) => (this.divElement = ref)
    this.divElement = null

    this.state = { isOpen: false }
  }

  componentWillUnmount () { document.removeEventListener('click', this.onDismissClick) }

  componentWillUpdate (nextProps, nextState) {
    if (nextState.isOpen === this.state.isOpen) return
    nextState.isOpen
      ? document.addEventListener('click', this.onDismissClick)
      : document.removeEventListener('click', this.onDismissClick)
  }

  renderItem (item, index) {
    const { selectItemIndex, renderItem, onChange } = this.props
    const isSelect = index === selectItemIndex
    return <div key={index} className={`safari-flex-button item ${isSelect ? 'select' : ''}`} onClick={isSelect ? null : () => onChange(item)}>
      {renderItem(item, isSelect)}
    </div>
  }

  render () {
    const { itemList, selectItemIndex, renderItem, renderSelectItem, isLock, className, tooltip } = this.props
    const { isOpen } = this.state

    return <CSSSelectDiv ref={this.setElementRef} className={className || ''}>
      <div
        className={`safari-flex-button item-select ${isOpen ? 'open' : ''} ${isLock ? 'lock' : 'tooltip-top'}`}
        onClick={!isLock ? this.toggleIsOpen : null}
        data-tooltip-content={tooltip}
      >
        {(renderSelectItem || renderItem)(itemList[ selectItemIndex ])}
        <CSSIcon name="arrow-down" className="icon" />
      </div>
      {!isLock && isOpen && <div className="item-list">{itemList.map(this.renderItem, this)}</div>}
    </CSSSelectDiv>
  }
}

// don't ask me why...
class SelectV2 extends Select {
  render () {
    const { itemList, selectItemIndex, renderItem, renderSelectItem, isLock, className, tooltip } = this.props
    const { isOpen } = this.state

    return <CSSSelectV2Div>
      <div className={`item-label ${isLock ? 'lock' : ''}`}>{tooltip}</div>
      <CSSSelectDiv ref={this.setElementRef} className={`${isLock ? 'lock' : ''} ${className || ''}`}>
        <div
          className={`safari-flex-button item-select ${isOpen ? 'open' : ''} ${isLock ? 'lock' : ''}`}
          onClick={!isLock ? this.toggleIsOpen : null}
        >
          {(renderSelectItem || renderItem)(itemList[ selectItemIndex ])}
          <CSSIcon name={isOpen ? 'arrow-up' : 'arrow-down'} className="icon" />
        </div>
        {!isLock && isOpen && <div className="item-list">{itemList.map(this.renderItem, this)}</div>}
      </CSSSelectDiv>
    </CSSSelectV2Div>
  }
}

export {
  Select,
  SelectV2
}
