import React from 'react'
import PropTypes from 'prop-types'

import LocalClassName from './css-icon.pcss'
const CSS_CSS_ICON = LocalClassName[ 'css-icon' ]

const ICON_NAME_MAP = {
  'arrow-up': 'arrow up',
  'arrow-down': 'arrow down',

  'DEFAULT': 'none'
}

const CSSIcon = ({ name, className }) => <i className={`${CSS_CSS_ICON} ${ICON_NAME_MAP[ name ] || ICON_NAME_MAP.DEFAULT} ${className || ''}`} />

CSSIcon.propTypes = {
  name: PropTypes.string.isRequired,
  className: PropTypes.string
}

export {
  CSSIcon
}
