export { CSSIcon } from './CSSIcon'
export { MockingBotIcon } from './MockingBotIcon'
export { LOCALE_LIST, TRANSLATE, GET_LOCALE, SET_LOCALE } from './Locale'

const objectMerge = (object, merge) => {
  for (const key in merge) { // check if has new data
    const value = merge[ key ]
    if (object[ key ] === value) continue
    return { ...object, ...merge }
  }
  return object
}

const createStateStore = (state) => {
  const getState = () => state
  const setState = (nextState) => {
    nextState = objectMerge(state, nextState)
    if (nextState === state) return state
    const prevState = state
    state = nextState
    listenerSet.forEach((listener) => listener(state, prevState))
    return state
  }
  const listenerSet = new Set()
  const subscribe = (listener) => listenerSet.add(listener)
  const unsubscribe = (listener) => listenerSet.delete(listener)
  return { getState, setState, subscribe, unsubscribe }
}

const getHexFromRGBColor = (rgbColor = '') => {
  if (rgbColor.startsWith('#')) return rgbColor
  const result = rgbRegexp.exec(rgbColor)
  return result ? `#${parseHex(result[ 1 ])}${parseHex(result[ 2 ])}${parseHex(result[ 3 ])}` : ''
}
const rgbRegexp = /rgba?\(([\d ]+),([\d ]+),([\d ]+),?([\d ]+)?\)/
const parseHex = (integerString) => {
  const hexString = Math.max(Math.min(parseInt(integerString) || 0, 255), 0).toString(16)
  return hexString.length === 2 ? hexString : `0${hexString}`.slice(-2)
}

export {
  objectMerge,
  createStateStore,
  getHexFromRGBColor
}
