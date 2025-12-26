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

import { formatDate } from '@/store/modules/calendar/helper'

const fetchFile = date => {
  const ipcRenderer = getIpcRenderer()
  if (!ipcRenderer) {
    console.warn('ipcRenderer not available')
    return Promise.resolve({ content: '', rating: 0 })
  }
  return ipcRenderer.invoke('FETCH_FILE', [formatDate(date, 'y'), date])
}

const saveFile = (date, file) => {
  const ipcRenderer = getIpcRenderer()
  if (!ipcRenderer) {
    console.warn('ipcRenderer not available')
    return Promise.resolve()
  }
  return ipcRenderer.invoke('SAVE_FILE', [
    formatDate(date, 'y'),
    date,
    file.content,
    file.rating
  ])
}

const debounce = (func, wait) => {
  let timeout

  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

export { debounce, fetchFile, saveFile }
