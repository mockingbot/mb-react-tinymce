import React from 'react'
import PropTypes from 'prop-types'

const ICON_NAME_MAP = {
  'bold': 'icon-t-bold',
  'italic': 'icon-t-italic',
  'underline': 'icon-t-underline',
  'strikeThrough': 'icon-t-strikethrough',
  'foreColor': 'icon-font',
  'justifyLeft': 'icon-t-align-left',
  'justifyCenter': 'icon-t-align-center',
  'justifyRight': 'icon-t-align-right',
  'insertOrderedList': 'icon-t-ol',
  'insertUnorderedList': 'icon-t-ul',
  'insertTable': 'icon-t-table',
  'insertLink': 'icon-mobile-copy-link',
  'insertImage': 'icon-img',
  'arrow-down': 'icon-tri-arrow-down',

  'DEFAULT': 'icon-question'
}

const MockingBotIcon = ({ name, className }) => <i
  className={`${ICON_NAME_MAP[ name ] || ICON_NAME_MAP.DEFAULT} ${className || ''}`}
/>

MockingBotIcon.propTypes = {
  name: PropTypes.string.isRequired,
  className: PropTypes.string
}

export {
  MockingBotIcon
}
