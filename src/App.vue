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
import { getFontFamily } from '@/store/modules/app/helper'

const { ipcRenderer } = require('electron')

export default {
  computed: {
    ...mapGetters('calendar', [CalendarGetters.GET_CURRENT_DATE]),
    ...mapGetters('app', [
      AppGetters.GET_LANGUAGE,
      AppGetters.GET_THEME,
      AppGetters.GET_THEME_COLORS
    ])
  },
  methods: {
    ...mapActions('calendar', [
      CalendarActions.SET_DATE,
      CalendarActions.SET_DAY_TO,
      CalendarActions.SET_CURRENT_WEEK
    ]),
    ...mapActions('file', [FileActions.FETCH_FILE]),
    ...mapActions('app', [AppActions.INIT_APP]),
    updateAccentColors() {
      const colors = this.getThemeColors
      const theme = this.getTheme
      if (colors) {
        document.documentElement.style.setProperty('--accent-color', colors.accent)
        document.documentElement.style.setProperty('--accent-hover', colors.accentHover)
        document.documentElement.style.setProperty('--accent-dark', colors.accentDark)
        
        // Update background and text colors for Caelestia theme
        if (theme === 'caelestia' && colors.background && colors.text) {
          document.documentElement.style.setProperty('--theme-bg', colors.background)
          document.documentElement.style.setProperty('--theme-text', colors.text)
        } else {
          // Reset to defaults for other themes
          if (theme === 'dark') {
            document.documentElement.style.setProperty('--theme-bg', '#000000')
            document.documentElement.style.setProperty('--theme-text', '#ffffff')
          } else {
            document.documentElement.style.setProperty('--theme-bg', '#ffffff')
            document.documentElement.style.setProperty('--theme-text', '#000000')
          }
        }
      }
    },
    async updateFontFamily() {
      const fontFamily = await getFontFamily()
      if (fontFamily) {
        document.documentElement.style.setProperty('--font-family', fontFamily)
      }
    }
  },
  mounted() {
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
  },
  created() {
    this.initApp()
    this.fetchFile(this.getCurrentDate)

    this.$store.subscribe((mutation) => {
      if (mutation.type === `calendar/${CalendarActions.SET_DATE}`) {
        this.fetchFile(this.getCurrentDate)
        this.setCurrentWeek()
      }

      if (mutation.type === `calendar/${CalendarActions.SET_CURRENT_WEEK}`) {
        // Trigger check for days with content when week changes
        this.$store.dispatch(`calendar/${CalendarActions.CHECK_DAYS_WITH_CONTENT}`)
      }

      if (mutation.type === `app/${AppActions.SET_THEME}`) {
        const theme = this.getTheme
        if (theme === 'dark' || theme === 'caelestia') {
          document.documentElement.classList.add('dark')
        } else {
          document.documentElement.classList.remove('dark')
        }
        // Update CSS variables for accent colors
        this.updateAccentColors()
      }
      
      if (mutation.type === `app/${AppActions.SET_THEME_COLORS}`) {
        this.updateAccentColors()
      }
    })

    const theme = this.getTheme
    if (theme === 'dark' || theme === 'caelestia') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    // Initialize accent colors
    this.updateAccentColors()
    // Initialize font family
    this.updateFontFamily()
    
    // Listen for Caelestia theme file changes
    ipcRenderer.on('caelestia-theme-updated', async (event, colors) => {
      if (this.getTheme === 'caelestia') {
        await this.$store.dispatch(`app/${AppActions.SET_THEME_COLORS}`, {
          theme: 'caelestia',
          colors: {
            accent: colors.accent,
            accentHover: colors.accentHover,
            accentDark: colors.accentDark,
            background: colors.background,
            text: colors.text,
            selectedBg: colors.selectedBg
          }
        })
      }
    })
  }
}
</script>
