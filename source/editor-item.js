import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import './editor-item.pcss'
import { CSSIcon } from './__utils__'

const getOptionDisplay = opt => opt.item || opt.val || opt

class Select extends PureComponent {
  constructor(props) {
    super(props)
    this.state = { isOpen: false }
  }

  static propTypes = {
    className: PropTypes.string,
    optionList: PropTypes.array.isRequired,
    currentOption: PropTypes.any,
    currentOptionIdx: PropTypes.oneOfType([PropTypes.number, PropTypes.func]),
    getListItem: PropTypes.func,
    createOnSelectHandler: PropTypes.func,
    dataTooltipContent: PropTypes.string,
  }

  static defaultProps = {
    className: '',
    currentOptionIdx: 0,
    getListItem: () => null,
    createOnSelectHandler: () => () => null,
  }

  componentDidMount() {
    const { $elmt } = this.refs

    Object.assign(this, {
      closeListOnClickOutside: ({ target }) => (
        this.state.isOpen && !$elmt.contains(target)
        && this.setState({ isOpen: false })
      )
    })

    document.addEventListener('click', this.closeListOnClickOutside)
  }

  ComponentWillUnmount() {
    document.removeEventListener('click', this.closeListOnClickOutside)
  }

  onToggle = () => (
    this.setState(prevState => ({ isOpen: !prevState.isOpen }))
  )

  render() {
    const {
      className, optionList, currentOptionIdx,
      createOnSelectHandler,
      currentOption = (
        optionList[
          typeof currentOptionIdx === 'function'
          ? currentOptionIdx(this.props)
          : currentOptionIdx
        ]
      ),
      getListItem,
      dataTooltipContent,
    } = this.props

    const { isOpen } = this.state
    const hiddenProp = isOpen ? {} : { hidden: true }

    return (
      <div
        ref="$elmt"
        className={`editor-select ${className} ${isOpen ? 'is-open' : 'is-close'}`}
      >
        <button onClick={this.onToggle} className="tooltip-top" data-tooltip-content={dataTooltipContent}>
          {getOptionDisplay(currentOption)}
          <CSSIcon name="arrow-down" className="caret" />
        </button>

        <ul {...hiddenProp}>
        {
          optionList.map((opt, idx) => (
            <li key={idx} onClick={createOnSelectHandler(opt)}>
              <button>
                { getListItem(opt) || getOptionDisplay(opt) }
              </button>
            </li>
          ))
        }
        </ul>
      </div>
    )
  }
}

export {
  Select,
}
