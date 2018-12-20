import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

const ARROW_SIZE = '8px'
const ARROW_WIDTH = '8px'
const ARROW_HEIGHT = '4px'

const CSSIconI = styled.i`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;

  &.none { visibility: hidden; }
  &.arrow {
    width: ${ARROW_SIZE};
    height: ${ARROW_SIZE};
    &::after { content: ''; border: calc(${ARROW_WIDTH} * 0.5) solid transparent; }
    &.up::after { border-top: 0; border-bottom: ${ARROW_HEIGHT} solid currentColor; }
    &.down::after { border-bottom: 0; border-top: ${ARROW_HEIGHT} solid currentColor; }
  }
`

const ICON_NAME_MAP = {
  'arrow-up': 'arrow up',
  'arrow-down': 'arrow down',

  'DEFAULT': 'none'
}

const CSSIcon = ({ name, className }) => <CSSIconI className={`${ICON_NAME_MAP[ name ] || ICON_NAME_MAP.DEFAULT} ${className || ''}`} />

CSSIcon.propTypes = {
  name: PropTypes.string.isRequired,
  className: PropTypes.string
}

export { CSSIcon }
