import TranslationConfig from './translation'

const LOCALE_LIST = TranslationConfig.localeList
const DEFAULT_LOCALE = LOCALE_LIST[ 0 ] // like 'en_US'

const TRANSLATION_DATA = {
  locale: '',
  missingDefaultKey: 'default',
  translation: (key, variables) => `TRANSLATION_DATA-${key}-${variables}` // a function, should be replaced with compiled code
}

const TRANSLATE = (key, variables) => TRANSLATION_DATA.translation(key, variables) || `${TRANSLATION_DATA.translation(TRANSLATION_DATA.missingDefaultKey)} = ${key}`

const GET_LOCALE = () => TRANSLATION_DATA.locale
const SET_LOCALE = (locale = DEFAULT_LOCALE) => {
  if (TRANSLATION_DATA.locale === locale) return
  locale = locale.toLowerCase().replace('-', '_').split('_')[ 0 ]
  locale = LOCALE_LIST.find((v) => v.includes(locale)) || LOCALE_LIST.find((v) => locale.includes(v)) || DEFAULT_LOCALE
  const translateLocale = TranslationConfig[ locale ]
  if (!translateLocale) throw new Error(`[SET_LOCALE] error locale: ${locale}, LOCALE_LIST: ${LOCALE_LIST}`)
  __DEV__ && console.log('SET_LOCALE', locale)
  TRANSLATION_DATA.locale = locale
  TRANSLATION_DATA.translation = (key, variables) => translateLocale[ key ] && translateLocale[ key ](variables)
}

export {
  LOCALE_LIST,
  TRANSLATE,
  GET_LOCALE,
  SET_LOCALE
}
