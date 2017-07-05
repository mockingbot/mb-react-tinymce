export {
  LOCALE_LIST,
  TRANSLATE,
  TRY_TRANSLATE,
  GET_LOCALE,
  SET_LOCALE
} from './Locale'

export {
  MockingBotIcon
} from './MockingBotIcon'

function getRandomId (prefix = '') { return `${prefix}${Date.now().toString(36)}-${Math.random().toString(36).substr(2, 10)}` }

export {
  getRandomId
}
