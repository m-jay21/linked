const { ipcRenderer } = require('electron')
const DAILY = 1000 * 60 * 60 * 24
const WEEKLY = DAILY * 7

/*
 * Electron Storage Getters
 */
export const getLanguage = async () => {
  return ipcRenderer.invoke('GET_STORAGE_VALUE', 'language')
}

export const getTheme = async () => {
  return ipcRenderer.invoke('GET_STORAGE_VALUE', 'theme')
}

export const getThemeColors = async () => {
  const colors = await ipcRenderer.invoke('GET_STORAGE_VALUE', 'themeColors')
  // Return default colors if none stored
  if (!colors) {
    return {
      light: {
        accent: '#FF005C',
        accentHover: '#D1014C',
        accentDark: '#EF4444'
      },
      dark: {
        accent: '#FF005C',
        accentHover: '#D1014C',
        accentDark: '#EF4444'
      },
      caelestia: {
        accent: '#a4d397',
        accentHover: '#5bd0df',
        accentDark: '#6dcfa6',
        background: '#11140f',
        text: '#e0e4da'
      }
    }
  }
  // Ensure caelestia colors exist
  if (!colors.caelestia) {
    colors.caelestia = {
      accent: '#a4d397',
      accentHover: '#5bd0df',
      accentDark: '#6dcfa6',
      background: '#11140f',
      text: '#e0e4da'
    }
  }
  return colors
}

export const getUpdateInterval = async () => {
  const updateInterval = await ipcRenderer.invoke('GET_STORAGE_VALUE', 'updateInterval')
  return updateInterval === DAILY ? 0 : 1
}

export const getDataPath = () => {
  return ipcRenderer.invoke('GET_STORAGE_VALUE', 'dataPath')
}

export const getAllowPrerelease = async () => {
  return ipcRenderer.invoke('GET_STORAGE_VALUE', 'allowPrerelease')
}

export const getFontFamily = async () => {
  return ipcRenderer.invoke('GET_STORAGE_VALUE', 'fontFamily')
}

/* 
 * Electron Storage Setters
 */
export const setTheme = async (theme) => {
  return ipcRenderer.invoke('SET_STORAGE_VALUE', 'theme', theme).then(() => {
    ipcRenderer.invoke('TOGGLE_THEME', theme)
  })
}

export const setThemeColors = async (colors) => {
  return ipcRenderer.invoke('SET_STORAGE_VALUE', 'themeColors', colors)
}

export const setLanguage = async (language) => {
  localStorage.lang = language
  return ipcRenderer.invoke('SET_STORAGE_VALUE', 'language', language)
}

export const loadSearchIndex = async () => {
  await ipcRenderer.invoke('LOAD_SEARCH_INDEX')
}

export const reIndexAll = async () => {
  return await ipcRenderer.invoke('REINDEX_ALL')
}

export const setUpdateInterval = async (updateInterval) => {
  return ipcRenderer.invoke('SET_STORAGE_VALUE', 'updateInterval', updateInterval === 0 ? DAILY : WEEKLY)
}

export const setDataPath = () => {
  return ipcRenderer.invoke('SET_DATA_PATH')
}

export const setAllowPrerelease = async (value) => {
  return ipcRenderer.invoke('SET_STORAGE_VALUE', 'allowPrerelease', value)
}

export const readCaelestiaTheme = async () => {
  return ipcRenderer.invoke('READ_CAELESTIA_THEME')
}

export const setFontFamily = async (fontFamily) => {
  return ipcRenderer.invoke('SET_STORAGE_VALUE', 'fontFamily', fontFamily)
}