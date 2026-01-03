<template>
  <router-view />
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

import {
  Getters as CalendarGetters,
  Actions as CalendarActions
} from '@/store/modules/calendar/types'

import { Actions as FileActions } from '@/store/modules/file/types'
import {
  Getters as AppGetters,
  Actions as AppActions
} from '@/store/modules/app/types'

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

export default {
  computed: {
    ...mapGetters('calendar', [CalendarGetters.GET_CURRENT_DATE]),
    ...mapGetters('app', [AppGetters.GET_LANGUAGE, AppGetters.GET_THEME])
  },
  mounted() {
    const ipcRenderer = getIpcRenderer()
    if (!ipcRenderer) {
      console.warn('ipcRenderer not available in mounted hook')
      return
    }

    ipcRenderer.on('open-settings', () => {
      this.$router.push('settings', () => {})
    })

    ipcRenderer.on('set-today', () => {
      this.setDate()
    })

    ipcRenderer.on('set-search', () => {
      this.$router.push('search', () => {})
    })

    ipcRenderer.on('previous-day', () => {
      this.setDayTo(-1)
    })

    ipcRenderer.on('next-day', () => {
      this.setDayTo(1)
    })

    ipcRenderer.on('previous-week', () => {
      this.setDayTo(-7)
    })

    ipcRenderer.on('next-week', () => {
      this.setDayTo(7)
    })

    ipcRenderer.on('theme-update', (event, colors) => {
      if (colors && this.getTheme === 'caelestia') {
        this.applyDynamicTheme(colors)
      }
    })

    if (this.getTheme === 'caelestia') {
      ipcRenderer.invoke('GET_DYNAMIC_THEME').then(colors => {
        if (colors) {
          this.applyDynamicTheme(colors)
        }
      })
    }
  },
  methods: {
    ...mapActions('calendar', [
      CalendarActions.SET_DATE,
      CalendarActions.SET_DAY_TO,
      CalendarActions.SET_CURRENT_WEEK
    ]),
    ...mapActions('file', [FileActions.FETCH_FILE]),
    ...mapActions('app', [AppActions.INIT_APP]),
    applyDynamicTheme(colors) {
      const root = document.documentElement
      const body = document.body
      root.style.setProperty('--theme-bg', colors.bg)
      root.style.setProperty('--theme-fg', colors.fg)
      root.style.setProperty('--theme-accent', colors.accent)
      root.style.setProperty('--theme-selected-bg', colors.selectedBg)
      root.style.setProperty('--theme-selected-fg', colors.selectedFg)
      root.style.setProperty('--theme-inactive', colors.inactive)
      root.style.setProperty('--theme-border', colors.border)
      root.style.setProperty('--theme-primary', colors.primary)
      root.style.setProperty('--theme-secondary', colors.secondary)
      root.style.setProperty('--theme-highlight', colors.highlight)
      root.setAttribute('data-theme', 'caelestia')
      if (body) {
        body.style.backgroundColor = colors.bg
        body.style.color = colors.fg
      }
    }
  },
  created() {
    this.initApp()
    this.fetchFile(this.getCurrentDate)

    this.$store.subscribe((mutation) => {
      if (mutation.type === `calendar/${CalendarActions.SET_DATE}`) {
        this.fetchFile(this.getCurrentDate)
        this.setCurrentWeek()
      }

      if (mutation.type === `app/${AppActions.SET_THEME}`) {
        if (this.getTheme === 'dark' || this.getTheme === 'caelestia') {
          document.documentElement.classList.add('dark')
        } else {
          document.documentElement.classList.remove('dark')
        }
        if (this.getTheme === 'caelestia') {
          const ipcRenderer = getIpcRenderer()
          if (ipcRenderer) {
            ipcRenderer.invoke('GET_DYNAMIC_THEME').then(colors => {
              if (colors) {
                this.applyDynamicTheme(colors)
              }
            })
          }
        } else {
          document.documentElement.removeAttribute('data-theme')
        }
      }
    })

    if (this.getTheme === 'dark' || this.getTheme === 'caelestia') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    
    if (this.getTheme === 'caelestia') {
      const ipcRenderer = getIpcRenderer()
      if (ipcRenderer) {
        ipcRenderer.invoke('GET_DYNAMIC_THEME').then(colors => {
          if (colors) {
            this.applyDynamicTheme(colors)
          }
        })
      }
    }
  }
}
</script>
