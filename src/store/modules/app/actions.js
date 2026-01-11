import { Actions, Mutations } from '@/store/modules/app/types'
import { Actions as CalendarActions } from '@/store/modules/calendar/types'
import {
  getLanguage,
  getTheme,
  getThemeColors,
  getUpdateInterval,
  setLanguage,
  setTheme,
  setThemeColors,
  loadSearchIndex,
  setUpdateInterval,
  getDataPath,
  setDataPath, 
  setAllowPrerelease, 
  getAllowPrerelease,
  readCaelestiaTheme
} from '@/store/modules/app/helper'

export default {
  async [Actions.INIT_APP](context) {
    const theme = await getTheme()
    context.commit(Mutations.SET_THEME, theme)
    
    const themeColors = await getThemeColors()
    context.commit(Mutations.SET_THEME_COLORS, { theme: 'light', colors: themeColors.light })
    context.commit(Mutations.SET_THEME_COLORS, { theme: 'dark', colors: themeColors.dark })
    
    // If theme is caelestia, load colors from file
    if (theme === 'caelestia') {
      const caelestiaColors = await readCaelestiaTheme()
      if (caelestiaColors) {
        context.commit(Mutations.SET_THEME_COLORS, { 
          theme: 'caelestia', 
          colors: {
            accent: caelestiaColors.accent,
            accentHover: caelestiaColors.accentHover,
            accentDark: caelestiaColors.accentDark,
            background: caelestiaColors.background,
            text: caelestiaColors.text,
            selectedBg: caelestiaColors.selectedBg
          }
        })
      }
    }
    
    const language = await getLanguage()
    context.commit(Mutations.SET_LANGUAGE, language)
    

    await context.dispatch('calendar/' + CalendarActions.SET_CURRENT_WEEK, '', {
      root: true
    })
    
    await loadSearchIndex()
    
    const dataPath = await getDataPath()
    context.commit(Mutations.SET_DATA_PATH, dataPath)
    
    const allowPrerelease = await getAllowPrerelease() 
    context.commit(Mutations.SET_ALLOW_PRERELEASE, allowPrerelease)
  },

  async [Actions.SYNC_UPDATE_INTERVAL](context) {
    const updateInterval = await getUpdateInterval()
    context.commit(Mutations.SET_UPDATE_INTERVAL, updateInterval)
  },

  async [Actions.SET_LANGUAGE](context, language) {
    setLanguage(language).then(() => {
      context.commit(Mutations.SET_LANGUAGE, language)
    })
  },

  async [Actions.SET_THEME](context, theme) {
    setTheme(theme).then(() => {
      context.commit(Mutations.SET_THEME, theme)
    })
  },

  async [Actions.SET_THEME_COLORS](context, { theme, colors }) {
    const allColors = await getThemeColors()
    allColors[theme] = { ...allColors[theme], ...colors }
    await setThemeColors(allColors)
    context.commit(Mutations.SET_THEME_COLORS, { theme, colors })
  },

  async [Actions.SET_UPDATE_INTERVAL](context, interval) {
    setUpdateInterval(interval).then(() => {
      context.commit(Mutations.SET_UPDATE_INTERVAL, interval)
    })
  },
  
  async [Actions.SET_DATA_PATH](context) {
    setDataPath().then((path) => {
      context.commit(Mutations.SET_DATA_PATH, path)
    })
  },

  async [Actions.SET_ALLOW_PRERELEASE](context, allowPrerelease) {
    setAllowPrerelease(allowPrerelease).then(() => {
      context.commit(Mutations.SET_ALLOW_PRERELEASE, allowPrerelease)
    })
  }
}
