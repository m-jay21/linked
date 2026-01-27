import { Mutations } from './types'

export default {
  [Mutations.SET_LANGUAGE](state, language) {
    state.language = language
  },

  [Mutations.SET_THEME](state, theme) {
    state.theme = theme
  },

  [Mutations.SET_THEME_COLORS](state, { theme, colors }) {
    if (state.themeColors[theme]) {
      state.themeColors[theme] = { ...state.themeColors[theme], ...colors }
    }
  },

  [Mutations.SET_UPDATE_INTERVAL](state, interval) {
    state.updateInterval = interval
  },

  [Mutations.SET_DATA_PATH](state, path) {
    state.dataPath = path
  },

  [Mutations.SET_ALLOW_PRERELEASE](state, allowPrerelease) {
    state.allowPrerelease = allowPrerelease
  },

  [Mutations.SET_SETTINGS_MODAL_OPEN](state, isOpen) {
    state.isSettingsModalOpen = isOpen
  }
}
