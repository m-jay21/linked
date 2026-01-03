'use strict'

require('v8-compile-cache')

import {
  app,
  protocol,
  BrowserWindow,
  ipcMain,
  nativeTheme,
  Menu,
  Notification,
  dialog
} from 'electron'

// Use app.isPackaged to detect production builds (AppImage, etc.)
// app.isPackaged is true when the app is packaged, false in development
const isDevelopment = !app.isPackaged
const isWindows = process.platform === 'win32'
const isMacOS = process.platform === 'darwin'

let win

// Turn off software rasterizer for less resource usage
app.commandLine.appendSwitch('disable-software-rasterizer', 'true')
app.setAppUserModelId(process.execPath)

protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } }
])

const path = require('path')
const fs = require('fs')
const os = require('os')
export const DAILY = 1000 * 60 * 60 * 24
export const WEEKLY = DAILY * 7
const basePath = path.join(app.getPath('documents'), 'linked')

const Store = require('electron-store')
global.storage = new Store({
  watch: true,
  defaults: {
    isSetupFinished: false,
    language: 'en-US',
    theme: 'dark',
    searchMode: 'forward',
    enableUpdates: true,
    updateInterval: DAILY,
    dataPath: basePath,
    allowPrerelease: false
  }
})

import updater from './updater.js'

const template = [
  {
    label: app.name,
    submenu: [
      { role: 'about' },
      {
        label: 'Settings',
        accelerator: 'CommandOrControl + ,',
        click() {
          reopenWindowAndSendWebContents('open-settings')
        }
      },
      { type: 'separator' },
      { role: 'quit' }
    ]
  },
  {
    label: 'Edit',
    submenu: [
      { role: 'undo' },
      { role: 'redo' },
      { type: 'separator' },
      { role: 'cut' },
      { role: 'copy' },
      { role: 'paste' },
      ...(isMacOS
        ? [
            { role: 'delete' },
            { role: 'selectAll' },
            { type: 'separator' },
            {
              label: 'Speech',
              submenu: [{ role: 'startSpeaking' }, { role: 'stopSpeaking' }]
            }
          ]
        : [{ role: 'delete' }, { type: 'separator' }, { role: 'selectAll' }])
    ]
  },
  {
    label: 'View',
    submenu: [
      {
        label: 'Today',
        click() {
          reopenWindowAndSendWebContents('set-today')
        },
        accelerator: 'CommandOrControl + .'
      },
      {
        label: 'Search',
        click() {
          reopenWindowAndSendWebContents('set-search')
        },
        accelerator: 'CommandOrControl + K'
      },
      { type: 'separator' },
      {
        label: 'Previous Day',
        click() {
          reopenWindowAndSendWebContents('previous-day')
        },
        accelerator: 'CommandOrControl + P'
      },
      {
        label: 'Next Day',
        click() {
          reopenWindowAndSendWebContents('next-day')
        },
        accelerator: 'CommandOrControl + N'
      },
      { type: 'separator' },
      {
        label: 'Previous Week',
        click() {
          reopenWindowAndSendWebContents('previous-week')
        },
        accelerator: 'CommandOrControl + Shift + P'
      },
      {
        label: 'Next Week',
        click() {
          reopenWindowAndSendWebContents('next-week')
        },
        accelerator: 'CommandOrControl + Shift + N'
      },
      { type: 'separator' },
      { role: 'reload' },
      { role: 'minimize' }
    ]
  },
  {
    role: 'help',
    submenu: [
      {
        label: 'Documentation',
        click: async () => {
          const { shell } = require('electron')
          await shell.openExternal('https://uselinked.com/')
        }
      },
      {
        label: 'Check for updates',
        click: async () => updater.askForUpdates()
      }
    ]
  }
]

const menu = Menu.buildFromTemplate(template)
Menu.setApplicationMenu(menu)

const createWindow = () => {
  win = new BrowserWindow({
    width: 470,
    minWidth: 450,
    height: 850,
    minHeight: 450,
    title: 'linked',
    backgroundColor: '#161616',
    webPreferences: {
      devTools: process.env.NODE_ENV === 'development',
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
      spellcheck: false
    }
  })

  // Vite dev server runs on port 5173 by default
  if (isDevelopment) {
    win.loadURL('http://localhost:5173')
    if (!process.env.IS_TEST) win.webContents.openDevTools()
  } else {
    // Production: load from dist folder
    // Try unpacked location first (app.asar.unpacked), then inside asar
    let indexPath = process.resourcesPath
      ? path.join(process.resourcesPath, 'app.asar.unpacked', 'dist', 'index.html')
      : path.join(app.getAppPath(), '..', 'app.asar.unpacked', 'dist', 'index.html')
    
    // Fallback to inside asar if unpacked doesn't exist
    const asarPath = path.join(app.getAppPath(), 'dist', 'index.html')
    
    win.loadFile(indexPath).catch(() => {
      win.loadFile(asarPath)
    })
    nativeTheme.themeSource = global.storage.get('theme')
  }
  
  win.on('closed', () => { win = null })
}

app.on('window-all-closed', () => {
  if (!isMacOS) {
    app.quit()
  }
})

app.on('window-all-closed', () => { if (!isMacOS) app.quit() })
app.on('activate', () => { if (win === null) createWindow()} )

import installExtension, { VUEJS_DEVTOOLS } from 'electron-devtools-installer'

app.whenReady().then(async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    try {
      await installExtension(VUEJS_DEVTOOLS)
    } catch (e) {
      console.error('Vue Devtools failed to install:', e.toString())
    }
  }
  createWindow()
  updater.setupUpdates()
  setupThemeWatcher()
})

if (isDevelopment) {
  if (isWindows) {
    process.on('message', (data) => {
      if (data === 'graceful-exit') {
        app.quit()
      }
    })
  } else {
    process.on('SIGTERM', () => {
      app.quit()
    })
  }
}

const reopenWindowAndSendWebContents = (message) => {
  if (!win) {
    createWindow()
    app.whenReady().then(() => {
      setTimeout(() => {
        win.webContents.send(message)
      }, 300)
    })
  }
  win.webContents.send(message)
}

/* 
 * IPC MAIN COMMUNICATION
 */

ipcMain.handle('GET_STORAGE_VALUE', (event, key) => {
  return global.storage.get(key)
})

ipcMain.handle('SET_STORAGE_VALUE', (event, key, data) => {
  return global.storage.set(key, data)
})

ipcMain.handle('DELETE_STORAGE_VALUE', (event, key) => {
  return global.storage.delete(key)
})

ipcMain.handle('SET_DATA_PATH', async () => {
  const currentPath = global.storage.get('dataPath')
  const result = await dialog.showOpenDialog(win, {
    properties: ['openDirectory', 'createDirectory']
  })
  
  if (result.canceled === true) {
    new Notification({
      title: 'Action aborted',
      body: 'Your previous settings still apply.'
    }).show()
    
    return currentPath
  }

  const newPath = result.filePaths.length > 0
    ? result.filePaths[0]
    : basePath

  searchIndex = new Document({
    document: {
      id: 'date',
      index: ['content'],
      store: true
    },
    tokenize: global.storage.get('searchMode')
  })
  
  if ((await fs.promises.readdir(newPath)).length !== 0) {
    await dialog.showMessageBox(win, {
      message: 'Directory not empty!',
      detail: `${newPath} is not empty, please choose another directory or add an empty directory at the desired location first.`,
      type: 'error',
      buttons: ['Close'],
      defaultId: 1,
      noLink: true
    })

    return global.storage.get('dataPath')
  }

  const fsEx = require('fs-extra')
  try {
    await fsEx.move(currentPath, newPath, { overwrite: true })
  } catch (e) {
    await dialog.showMessageBox(win, {
      message: 'An error occured!',
      detail: e.toString(),
      type: 'error',
      buttons: ['Close'],
      defaultId: 1,
      noLink: true
    })
    return global.storage.get('dataPath')
  }
  
  global.storage.set('dataPath', newPath)
  await repairSearchDatabase()

  new Notification({
    title: 'Successfully set new path!',
    body: `Your data now is being read from ${newPath}.`
  }).show()

  return global.storage.get('dataPath')
})


ipcMain.handle('TOGGLE_THEME', (event, mode) => {
  if (mode === 'light') {
    nativeTheme.themeSource = 'light'
  } else if (mode === 'caelestia') {
    nativeTheme.themeSource = 'dark'
  } else {
    nativeTheme.themeSource = 'dark'
  }
  return nativeTheme.shouldUseDarkColors
})

// Btop theme parsing
const btopThemePath = path.join(os.homedir(), '.config/btop/themes/caelestia.theme')
let themeWatcher = null

const parseBtopTheme = (filePath) => {
  if (!fs.existsSync(filePath)) return null
  
  const colors = {}
  const content = fs.readFileSync(filePath, 'utf-8')
  const regex = /theme\[(\w+)\]\s*=\s*#?([0-9a-fA-F]{6})/gi
  let match
  
  while ((match = regex.exec(content)) !== null) {
    colors[match[1]] = `#${match[2].toUpperCase()}`
  }
  
  return colors
}

const mapBtopColors = (btopColors) => {
  return {
    bg: btopColors.main_bg || '#0f1513',
    fg: btopColors.main_fg || '#dee4e0',
    accent: btopColors.hi_fg || '#86d6bf',
    selectedBg: btopColors.selected_bg || '#1b211f',
    selectedFg: btopColors.selected_fg || '#86d6bf',
    inactive: btopColors.inactive_fg || '#89938f',
    border: btopColors.div_line || '#3f4945',
    primary: btopColors.cpu_start || '#a2eed9',
    secondary: btopColors.free_start || '#5bd0df',
    highlight: btopColors.used_start || '#96f2ce'
  }
}

ipcMain.handle('GET_DYNAMIC_THEME', async () => {
  const colors = parseBtopTheme(btopThemePath)
  if (!colors) return null
  return mapBtopColors(colors)
})

const setupThemeWatcher = () => {
  if (!fs.existsSync(btopThemePath)) return
  
  const sendThemeUpdate = () => {
    const colors = parseBtopTheme(btopThemePath)
    if (colors && win) {
      win.webContents.send('theme-update', mapBtopColors(colors))
    }
  }
  
  sendThemeUpdate()
  
  themeWatcher = fs.watch(btopThemePath, (eventType) => {
    if (eventType === 'change') {
      setTimeout(sendThemeUpdate, 100)
    }
  })
}

ipcMain.handle('FETCH_FILE', async (event, args) => {
  const [year, fileName] = args
  const dataPath = getFilePath(year)
  const filePath = `${dataPath}/${fileName}.json`

  // return default data if file doesn't exist (don't create file)
  if (!fs.existsSync(filePath)) {
    return JSON.parse(getDefaultData())
  }

  // return the file if it exists
  return fs.promises.readFile(filePath, 'utf-8').then(data => JSON.parse(data))
})

import { Document } from 'flexsearch'

let searchIndex = new Document({
  document: {
    id: 'date',
    index: ['content'],
    store: true
  },
  tokenize: global.storage.get('searchMode')
})

const searchIndexPath = `${app.getPath('userData')}/search-index/`

const createSearchIndexFolder = () => {
  !fs.existsSync(searchIndexPath) && fs.mkdirSync(searchIndexPath, { recursive: true })
}

const exportIndex = async () => {
  createSearchIndexFolder()
  searchIndex.export(
    (key, data) => fs.writeFileSync(`${searchIndexPath}${key}.json`, data !== undefined ? data : '')
  )
}

const retrieveIndex = async () => {
  createSearchIndexFolder()
  const keys = fs
    .readdirSync(searchIndexPath, { withFileTypes: true })
    .filter(item => !item.isDirectory())
    .map(item => item.name)

  for (let i = 0, key; i < keys.length; i += 1) {
    key = keys[i]
    
    // TODO: mac sometimes creates this file in the search index folder, which causes the app to exit
    if (key === '.DS_Store') continue
    
    const data = fs.readFileSync(`${searchIndexPath}${key}`, 'utf8')
    searchIndex.import(key.slice(0, -5), data === undefined ? null : data)
  }
}


ipcMain.handle('SAVE_FILE', async (event, args) => {
  const [year, fileName, content, rating] = args
  const dataPath = getFilePath(year)
  const filePath = `${dataPath}/${fileName}.json`
  
  // Ensure directory exists
  await fs.promises.mkdir(dataPath, { recursive: true })
  
  // If content is empty, delete the file if it exists
  if (isContentEmpty(content)) {
    if (fs.existsSync(filePath)) {
      await fs.promises.unlink(filePath)
      // Remove from search index
      searchIndex.remove(fileName)
      await exportIndex()
    }
    return
  }

  // Only save if content exists
  searchIndex.update(fileName, {
    date: fileName, 
    content: tokenizer(content)
  })

  await fs.promises.writeFile(
    filePath,
    JSON.stringify({
      content: content,
      rating: rating
    })
  )
  
  await exportIndex()
})

ipcMain.handle('CHECK_DAYS_WITH_CONTENT', async (event, args) => {
  const dates = args // array of date strings in YYYY-MM-DD format
  const daysWithContent = []
  
  for (const date of dates) {
    const year = date.substring(0, 4)
    const dataPath = getFilePath(year)
    const filePath = `${dataPath}/${date}.json`
    
    if (fs.existsSync(filePath)) {
      try {
        const data = await fs.promises.readFile(filePath, 'utf-8')
        const file = JSON.parse(data)
        
        // Check if content is not empty
        if (!isContentEmpty(file.content)) {
          daysWithContent.push(date)
        }
      } catch (e) {
        // Skip if file is corrupted or can't be read
        console.error(`Error reading file ${filePath}:`, e)
      }
    }
  }
  
  return daysWithContent
})

ipcMain.handle('SEARCH', async (event, search) => {
  const results = searchIndex.search(search)

  if (results.length >= 1 ) {
    const dates = results[0].result
    let dataResult = []

    for (const date of dates) {
      await fs.promises.readFile(`${getFilePath(date.substring(0,4))}/${date}.json`, 'utf-8').then((data) => {
        dataResult.push({
          date: date,
          ...JSON.parse(data)
        })
      })
    }
    
    return dataResult.sort((a, b) => {
      let keyA = new Date(a.date), keyB = new Date(b.date)

      if (keyA < keyB) return 1
      if (keyA > keyB) return -1

      return 0
    })
  }
  return {}
})

ipcMain.handle('LOAD_SEARCH_INDEX', async () => {
  return retrieveIndex()
})

/**
 * Cleans the content from any html elements, as well as deleting any
 * base64 images and removing duplicates.
 * @param content
 * @returns { String }
 */
const tokenizer = (content) => {
  const cleanedHtml = content.replace(/(<([^>]+)>)/gi, ' ').split(' ')
  return cleanedHtml.filter((word, index, self) => self.indexOf(word) === index)
}

/**
 * Checks if content is empty by stripping HTML tags and whitespace
 * @param {string} content - HTML content string
 * @returns {boolean} - true if content is empty
 */
const isContentEmpty = (content) => {
  if (!content) return true
  // Strip HTML tags and check if remaining text is empty
  const textOnly = content.replace(/(<([^>]+)>)/gi, '').trim()
  return textOnly.length === 0
}

ipcMain.handle('REINDEX_ALL', async () => repairSearchDatabase())

const repairSearchDatabase = async () => {
  searchIndex = new Document({
    document: {
      id: 'date',
      index: ['content'],
      store: true
    },
    tokenize: global.storage.get('searchMode')
  })
  
  const isYearFolder = (folder) => /\b\d{4}\b/g.test(folder)
  const dataPath = global.storage.get('dataPath')

  const getYearFolderFiles = (year) =>
    fs.promises.readdir(getFilePath(year))
      .then((files) => files.map((file) => `${year}/${file}`))

  const years =
    await fs.promises.readdir(`${dataPath}`)
      .then((folders) => folders.filter(isYearFolder))


  await Promise.all(years.map(getYearFolderFiles))
    .then((yearFiles) => yearFiles.flat())
    .then((dirtyFiles) => dirtyFiles.filter(file => file.match(/^(.*\.json$).*$/)))
    .then((cleanFiles) =>
      cleanFiles.map((file) => {
        return {
          data: JSON.parse(fs.readFileSync(`${dataPath}/${file}`, "utf8")),
          date: file
        }
      })
    )
    .then((files) =>
      files.forEach((file) => {
        let fileName = file.date.substring(5)
        fileName = fileName.slice(0, fileName.length-5)

        try {
          searchIndex.update(fileName, {
            date: fileName,
            content: tokenizer(file.data.content)
          })
        } catch (e) {
          console.log('could not index day', fileName, file.data.content)
        }
      })
    )
    .then(() => exportIndex())
    .then(() => {
      new Notification({
        title: 'Search Index Updated!',
        body: 'Your database was successfully indexed! You may now search across all your data.'
      }).show()
    })

  return true
}

/**
 * Construct the base path where files are stored and loaded from
 */
const getFilePath = (year) => {
  return `${global.storage.get('dataPath')}/${year}`
}

const getDefaultData = () => {
  return JSON.stringify({
    content: '',
    rating: 0
  })
}
