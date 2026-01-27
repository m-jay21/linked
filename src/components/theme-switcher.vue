<template>
  <div class="space-y-2 mb-4 mt-4">
    <button
      v-for="theme in themes"
      :key="theme.id"
      @click="handleThemeSelect(theme.id)"
      @mouseenter="hoveredTheme = theme.id"
      @mouseleave="hoveredTheme = null"
      class="w-full px-4 py-3 rounded-lg border-2 transition-all text-left"
      :style="getThemeButtonStyle(theme.id)"
    >
      <div class="flex items-center justify-between">
        <span class="text-sm font-medium" :style="{ color: themeText }">{{ theme.name }}</span>
        <span 
          v-if="currentTheme === theme.id" 
          class="text-xs font-semibold"
          :style="{ color: accentColor }"
        >
          Active
        </span>
      </div>
    </button>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { Actions as AppActions, Getters as AppGetters } from '@/store/modules/app/types'

export default {
  data() {
    return {
      themes: [
        { id: 'light', name: 'Light' },
        { id: 'dark', name: 'Dark' },
        { id: 'caelestia', name: 'Custom' }
      ],
      hoveredTheme: null
    }
  },
  computed: {
    ...mapGetters('app', [AppGetters.GET_THEME, AppGetters.GET_THEME_COLORS]),
    currentTheme() {
      return this.getTheme
    },
    accentColor() {
      const colors = this.getThemeColors
      if (!colors) return '#FF005C'
      return this.currentTheme === 'dark' ? colors.accentDark : colors.accent
    },
    themeText() {
      const theme = this.currentTheme
      if (theme === 'caelestia') {
        const colors = this.getThemeColors
        return colors?.text || '#e0e4da'
      }
      return theme === 'dark' ? '#ffffff' : '#000000'
    },
    buttonBorderColor() {
      const theme = this.currentTheme
      if (theme === 'caelestia') {
        const colors = this.getThemeColors
        return colors?.text ? this._adjustOpacity(colors.text, 0.15) : '#4a5568'
      }
      return theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
    },
    buttonBg() {
      const theme = this.currentTheme
      if (theme === 'caelestia') {
        const colors = this.getThemeColors
        return colors?.selectedBg || colors?.background || '#1d211b'
      }
      return theme === 'dark' ? '#1f2937' : '#f3f4f6'
    },
    buttonHoverBg() {
      const theme = this.currentTheme
      if (theme === 'caelestia') {
        const colors = this.getThemeColors
        const baseBg = colors?.selectedBg || colors?.background || '#1d211b'
        return this._lightenColor(baseBg, 0.05)
      }
      return theme === 'dark' ? '#374151' : '#e5e7eb'
    },
    activeButtonBg() {
      // Active button with accent color at 10% opacity
      const accent = this.accentColor
      const r = parseInt(accent.slice(1, 3), 16)
      const g = parseInt(accent.slice(3, 5), 16)
      const b = parseInt(accent.slice(5, 7), 16)
      return `rgba(${r}, ${g}, ${b}, 0.1)`
    }
  },
  methods: {
    ...mapActions('app', [AppActions.SET_THEME]),
    handleThemeSelect(themeId) {
      this.setTheme(themeId)
    },
    getThemeButtonStyle(themeId) {
      const isActive = this.currentTheme === themeId
      const isHovered = this.hoveredTheme === themeId && !isActive
      
      let borderColor = this.buttonBorderColor
      let backgroundColor = 'transparent'
      
      if (isActive) {
        borderColor = this.accentColor
        backgroundColor = this.activeButtonBg
      } else if (isHovered) {
        borderColor = this.accentColor
        backgroundColor = this.buttonHoverBg
      }
      
      return {
        borderColor,
        backgroundColor
      }
    },
    _adjustOpacity(hex, opacity) {
      const r = parseInt(hex.slice(1, 3), 16)
      const g = parseInt(hex.slice(3, 5), 16)
      const b = parseInt(hex.slice(5, 7), 16)
      return `rgba(${r}, ${g}, ${b}, ${opacity})`
    },
    _lightenColor(hex, amount) {
      const r = parseInt(hex.slice(1, 3), 16)
      const g = parseInt(hex.slice(3, 5), 16)
      const b = parseInt(hex.slice(5, 7), 16)
      const newR = Math.min(255, Math.floor(r + (255 - r) * amount))
      const newG = Math.min(255, Math.floor(g + (255 - g) * amount))
      const newB = Math.min(255, Math.floor(b + (255 - b) * amount))
      return `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`
    }
  }
}
</script>
