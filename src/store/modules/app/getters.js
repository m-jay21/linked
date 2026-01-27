import { Getters } from './types'

export default {
  [Getters.GET_LANGUAGE](state) {
    return state.language
  },

  [Getters.GET_THEME](state) {
    return state.theme
  },

  [Getters.GET_THEME_COLORS](state) {
    if (!state.theme || !state.themeColors[state.theme]) {
      return state.themeColors.dark // default
    }
    // For caelestia, return caelestia colors, otherwise return theme colors
    return state.themeColors[state.theme]
  },

  [Getters.GET_ACCENT_COLOR](state, getters) {
    const colors = getters[Getters.GET_THEME_COLORS]
    return colors?.accent || '#FF005C'
  },

  [Getters.GET_UPDATE_INTERVAL](state) {
    return state.updateInterval
  },

  [Getters.GET_DATA_PATH](state) {
    return state.dataPath
  },

  [Getters.GET_ALLOW_PRERELEASE](state) {
    return state.allowPrerelease
  },

  [Getters.GET_SETTINGS_MODAL_OPEN](state) {
    return state.isSettingsModalOpen
  }
}
