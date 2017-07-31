import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'

import { CSSIcon } from 'source/__utils__'

import LocalClassName from './select.pcss'
const CSS_SELECT = LocalClassName[ 'select' ]
const CSS_SELECT_V2 = LocalClassName[ 'select-v2' ]

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

    return <div ref={this.setElementRef} className={`${CSS_SELECT} ${className || ''}`}>
      <div
        className={`safari-flex-button item-select ${isOpen ? 'open' : ''} ${isLock ? 'lock' : 'tooltip-top'}`}
        onClick={!isLock ? this.toggleIsOpen : null}
        data-tooltip-content={tooltip}
      >
        {(renderSelectItem || renderItem)(itemList[ selectItemIndex ])}
        <CSSIcon name="arrow-down" className="icon" />
      </div>
      {!isLock && isOpen && <div className="item-list">{itemList.map(this.renderItem, this)}</div>}
    </div>
  }
}

// don't ask me why...
class SelectV2 extends Select {
  render () {
    const { itemList, selectItemIndex, renderItem, renderSelectItem, isLock, className, tooltip } = this.props
    const { isOpen } = this.state

    return <div className={CSS_SELECT_V2}>
      <div className={`item-label ${isLock ? 'lock' : ''}`}>{tooltip}</div>
      <div ref={this.setElementRef} className={`${CSS_SELECT} ${isLock ? 'lock' : ''} ${className || ''}`}>
        <div
          className={`safari-flex-button item-select ${isOpen ? 'open' : ''} ${isLock ? 'lock' : ''}`}
          onClick={!isLock ? this.toggleIsOpen : null}
        >
          {(renderSelectItem || renderItem)(itemList[ selectItemIndex ])}
          <CSSIcon name={isOpen ? 'arrow-up' : 'arrow-down'} className="icon" />
        </div>
        {!isLock && isOpen && <div className="item-list">{itemList.map(this.renderItem, this)}</div>}
      </div>
    </div>
  }
}

export {
  Select,
  SelectV2
}
