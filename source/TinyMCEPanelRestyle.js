import { createGlobalStyle } from 'styled-components'

const COLOR_SELECT = 'rgba(0, 0, 0, 0.06)'
const COLOR_HOVER = 'rgba(0, 0, 0, 0.04)'
const COLOR_BORDER = '#D9D9D9'
const COLOR_PRIMARY = '#EB5648'
const COLOR_PRIMARY_SECONDARY = '#F7827B'
const COLOR_SELECTION = 'rgba(235, 85, 71, 0.4)' // 'color(var(--color-primary) a(0.4))'
const COLOR_TEXT_80 = '#525E71'
const COLOR_INACTIVE = '#BBB'
const DIALOG_ITEM_HEIGHT = '30px'
const DIALOG_ITEM_TEXT_HEIGHT = '20px'
const INSERT_TABLE_ITEM_COUNT = '6'

const TinyMCEPanelRestyleGlobalStyle = createGlobalStyle`
/* TODO: remove this when we have a sane project manager, instead of a fake */

.mce-panel.mce-floatpanel {
  & *::selection { background: ${COLOR_SELECTION}; }

  & .mce-reset,
  & .mce-label,
  & .mce-txt,
  & .mce-text,
  & .mce-textbox,
  & .mce-text-center {
    font-size: 12px;
    color: ${COLOR_TEXT_80};
    font-family: -apple-system, "SF UI Text", "Helvetica Neue", Arial, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "WenQuanYi Zen Hei", sans-serif;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  & .mce-combobox.mce-colorbox,
  & .mce-checkbox {
    display: flex;
    align-items: center;
  }

  & .mce-checkbox > .mce-ico.mce-i-checkbox {
    margin: 2px;
    width: 10px;
    height: 10px;
    font-size: 10px;
    line-height: 12px;
    border: 1px solid ${COLOR_PRIMARY};
    color: ${COLOR_PRIMARY};
    background: transparent;
  }

  & .mce-textbox,
  & .mce-listbox,
  & .mce-listbox > button {
    min-height: ${DIALOG_ITEM_TEXT_HEIGHT} !important;
    max-height: ${DIALOG_ITEM_TEXT_HEIGHT} !important;
    line-height: 14px;
  }
  & .mce-textbox,
  & .mce-listbox {
    box-sizing: border-box;
    border: 0;
    border-bottom: 1px solid ${COLOR_BORDER};
    background: transparent;
    &:hover { border-bottom: 1px solid ${COLOR_TEXT_80}; }
    &:focus { border-bottom: 1px solid ${COLOR_PRIMARY}; }
    & > button[role="presentation"] > .mce-caret { border-top-color: ${COLOR_INACTIVE}; }
  }

  /* insert table - tab-color-combobox */
  & .mce-combobox.mce-colorbox > .mce-btn.mce-open {
    border: 0;
    background: transparent;
    & > button {
      position: relative;
      margin-left: 5px;
      padding: 0;
      width: 18px;
      height: 18px;
      background: ${COLOR_BORDER};
      & > i.mce-ico { position: absolute; top: 1px; left: 1px; border: 1px solid #fff; }
    }
  }
}

/* common dialog */

div[role="dialog"] { width: auto !important; height: auto !important; }

div[role="dialog"] > div[role="application"] {
  & > .mce-window-head,
  & > .mce-window-body,
  & > .mce-window-body > .mce-form,
  & > .mce-window-body > .mce-form > div,
  & > .mce-foot,
  & > .mce-foot > div { box-sizing: border-box; max-width: 220px; }

  & > .mce-window-head {
    padding: 5px 0 5px 10px;
    border-bottom: 1px solid ${COLOR_BORDER};
    & > .mce-title { font-size: 12px; font-weight: normal; color: ${COLOR_TEXT_80}; }
    & > .mce-close {
      width: 24px;
      height: 30px;
      & > i.mce-ico { font-size: 10px; color: ${COLOR_PRIMARY}; }
    }
  }

  & > .mce-foot {
    border: 0;
    & .mce-btn { display: none; }
    & .mce-btn.mce-primary {
      display: block;
      position: static;
      margin: 0 auto;
      width: 100px;
      height: 30px;
      background: ${COLOR_PRIMARY};
      &:hover { background: ${COLOR_PRIMARY_SECONDARY}; }
      & .mce-txt { font-size: 14px; color: #fff; }
    }
  }
}

/* insert link */
div[role="dialog"][aria-label="Insert link"] > div[role="application"] > .mce-window-body {
  & > .mce-form > div > .mce-formitem {
    &,
    & > div { width: 180px !important; }

    & > div {
      & > label.mce-label { width: 48px !important; }

      & > .mce-listbox,
      & > .mce-combobox,
      & > .mce-combobox > input.mce-textbox,
      & > input.mce-textbox { left: initial !important; right: 0; width: 122px !important; }
    }
  }
}

/* insert table */
div[role="dialog"][aria-label="Table properties"] > div[role="application"] > .mce-window-body {
  padding: 10px 0;
  min-height: calc(${DIALOG_ITEM_HEIGHT} * ${INSERT_TABLE_ITEM_COUNT} + 20px);

  & > .mce-container,
  & > .mce-container > .mce-container-body { min-height: calc(${DIALOG_ITEM_HEIGHT} * ${INSERT_TABLE_ITEM_COUNT}); }

  & .mce-abs-layout,
  & .mce-abs-layout-item { position: relative; left: 0 !important; top: 0 !important; }

  & div.mce-abs-layout,
  & div.mce-abs-layout-item { box-sizing: border-box; max-width: 220px; height: auto !important; min-height: ${DIALOG_ITEM_HEIGHT}; }

  & > .mce-container.mce-panel {
    /* insert table - tab */
    & > div[role="tablist"] { display: none; }

    /* insert table - tab-content */
    & > .mce-container-body {
      display: flex;
      flex-flow: column;
      align-items: flex-start;
      overflow-y: auto;
      height: 100% !important;
      & > div[role="tabpanel"] { display: block !important; position: static; }

      & .mce-formitem {
        &,
        & > div { min-width: 220px; }

        & > div {
          display: flex;
          flex-flow: row nowrap;
          align-items: center;
          padding: 0 20px;
        }

        & label { max-width: 72px; min-width: 72px; margin-right: 20px; }
        & input { min-width: 88px; max-width: 88px; max-height: 18px; }
        & .mce-combobox.mce-colorbox > input { min-width: 64px; max-width: 64px; }
      }

      & > .mce-form:nth-child(2) > div > .mce-form > div > .mce-form > div {
        /* HACK: to hide table cell spacing */
        & > .mce-formitem:nth-child(4) { display: none; }
        /* HACK: to hide table cell padding */
        & > .mce-formitem:nth-child(5) { display: none; }
        /* HACK: to hide table border attribute edit */
        & > .mce-formitem:nth-child(6) { display: none; }
      }

      /* HACK: to hide direct table CSS style edit */
      & > .mce-form:nth-child(3) > div > .mce-formitem:nth-child(2) { display: none; }
    }
  }
}

/* color picker */
div[role="dialog"][aria-label="Color"] > div[role="application"] > .mce-window-body {
  &,
  & > .mce-container,
  & > .mce-container > .mce-container-body { max-width: 220px; min-height: 256px; }

  & > .mce-container > .mce-container-body {
    display: flex;
    flex-flow: column;
    align-items: center;
    overflow-y: auto;

    & .mce-abs-layout-item { position: relative; left: 0 !important; top: 0 !important; }

    & > .mce-colorpicker {
      margin: 12px;
      width: 196px !important;
      height: 160px !important;

      & > .mce-colorpicker-sv { width: 160px; height: 160px; }
      & > .mce-colorpicker-h { width: 24px; height: 160px; }
      & > .mce-colorpicker-h > .mce-colorpicker-h-marker { border: 1px solid ${COLOR_PRIMARY}; }
    }

    & > .mce-container.mce-form {
      &,
      & > .mce-container-body { width: 196px !important; height: 50px !important; }

      & > .mce-container-body {
        display: flex;
        flex-flow: row wrap-reverse;

        & > .mce-formitem {
          &,
          & > .mce-container-body { width: 64px !important; }
        }

        & > .mce-formitem > .mce-container-body {
          display: flex;
          flex-flow: row nowrap;

          & label.mce-label { min-width: 18px; display: flex; align-items: center; justify-content: center; }
          & input.mce-textbox { min-width: 40px; }
        }

        & > .mce-formitem:nth-child(5) {
          &,
          & > .mce-container-body { width: 84px !important; }
          & > .mce-container-body input.mce-textbox { min-width: 60px; }
        }

        /* color indicator */
        & > .mce-container.mce-last {
          position: absolute;
          left: initial !important;
          right: 0;

          &,
          & > .mce-container-body { width: 24px !important; height: 24px !important; }
        }
      }
    }
  }
}

/* select */
div[role="application"].mce-menu.mce-panel {
  border: 0;
  padding: 0;
  min-width: 122px;
  width: auto !important;
  box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.1);

  & > div[role="menu"] {
    width: auto !important;
    & > div[role="menuitem"] {
      display: flex;
      flex-flow: row;
      align-items: center;
      margin: 0;
      padding: 0 6px;
      height: ${DIALOG_ITEM_HEIGHT};
      border: 0;
      &:hover { background: ${COLOR_HOVER}; }
      &.mce-active { background: ${COLOR_SELECT}; }

      & .mce-text { color: ${COLOR_TEXT_80}; }
    }
    & > div[role="separator"].mce-menu-item-sep { margin: 0; height: 0; border-bottom: 1px solid ${COLOR_BORDER}; }
  }
}

/* insert table - grid */
table[role="grid"].mce-grid td[role="gridcell"] > a {
  &:hover,
  &.mce-active { border-color: ${COLOR_PRIMARY}; background: ${COLOR_PRIMARY}; }
}
`

export { TinyMCEPanelRestyleGlobalStyle }
