// Get ipcRenderer lazily (available in Electron renderer with nodeIntegration: true)
const getIpcRenderer = () => {
  if (typeof window !== 'undefined' && window.require) {
    return window.require('electron').ipcRenderer
  }
  if (typeof require !== 'undefined') {
    return require('electron').ipcRenderer
  }
  return null
}

const DAILY = 1000 * 60 * 60 * 24
const WEEKLY = DAILY * 7

/*
 * Electron Storage Getters
 */
export const getLanguage = async () => {
  const ipcRenderer = getIpcRenderer()
  if (!ipcRenderer) return 'en-US'
  return ipcRenderer.invoke('GET_STORAGE_VALUE', 'language')
}

export const getTheme = async () => {
  const ipcRenderer = getIpcRenderer()
  if (!ipcRenderer) return 'dark'
  return ipcRenderer.invoke('GET_STORAGE_VALUE', 'theme')
}

export const getUpdateInterval = async () => {
  const ipcRenderer = getIpcRenderer()
  if (!ipcRenderer) return 0
  const updateInterval = await ipcRenderer.invoke('GET_STORAGE_VALUE', 'updateInterval')
  return updateInterval === DAILY ? 0 : 1
}

export const getDataPath = () => {
  const ipcRenderer = getIpcRenderer()
  if (!ipcRenderer) return null
  return ipcRenderer.invoke('GET_STORAGE_VALUE', 'dataPath')
}

export const getAllowPrerelease = async () => {
  const ipcRenderer = getIpcRenderer()
  if (!ipcRenderer) return false
  return ipcRenderer.invoke('GET_STORAGE_VALUE', 'allowPrerelease')
}

/* 
 * Electron Storage Setters
 */
export const setTheme = async (theme) => {
  const ipcRenderer = getIpcRenderer()
  if (!ipcRenderer) return
  return ipcRenderer.invoke('SET_STORAGE_VALUE', 'theme', theme).then(() => {
    ipcRenderer.invoke('TOGGLE_THEME', theme)
  })
}

export const setLanguage = async (language) => {
  localStorage.lang = language
  const ipcRenderer = getIpcRenderer()
  if (!ipcRenderer) return
  return ipcRenderer.invoke('SET_STORAGE_VALUE', 'language', language)
}

export const loadSearchIndex = async () => {
  const ipcRenderer = getIpcRenderer()
  if (!ipcRenderer) return
  await ipcRenderer.invoke('LOAD_SEARCH_INDEX')
}

export const reIndexAll = async () => {
  const ipcRenderer = getIpcRenderer()
  if (!ipcRenderer) return
  return await ipcRenderer.invoke('REINDEX_ALL')
}

export const setUpdateInterval = async (updateInterval) => {
  const ipcRenderer = getIpcRenderer()
  if (!ipcRenderer) return
  return ipcRenderer.invoke('SET_STORAGE_VALUE', 'updateInterval', updateInterval === 0 ? DAILY : WEEKLY)
}

export const setDataPath = () => {
  const ipcRenderer = getIpcRenderer()
  if (!ipcRenderer) return null
  return ipcRenderer.invoke('SET_DATA_PATH')
}

export const setAllowPrerelease = async (value) => {
  const ipcRenderer = getIpcRenderer()
  if (!ipcRenderer) return
  return ipcRenderer.invoke('SET_STORAGE_VALUE', 'allowPrerelease', value)
}