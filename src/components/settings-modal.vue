<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 z-50 flex items-center justify-center"
    :style="{
      backgroundColor: backdropColor
    }"
    @click.self="closeModal"
  >
    <div
      class="rounded-lg shadow-xl w-[600px] max-w-[90vw] h-[90vh] max-h-[90vh] p-6 border-2 overflow-hidden relative flex flex-col"
      :style="{
        backgroundColor: modalBg,
        color: themeText,
        borderColor: accentColor
      }"
      @click.stop
    >
      <!-- Close button in top-right corner -->
      <button
        class="absolute top-4 right-4 cursor-pointer p-1.5 rounded transition-colors z-10"
        :style="{ 
          color: themeText,
          backgroundColor: closeButtonHover ? closeButtonHoverBg : 'transparent'
        }"
        @mouseenter="closeButtonHover = true"
        @mouseleave="closeButtonHover = false"
        @click="closeModal"
        title="Close"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" width="20" height="20" fill="currentColor">
          <path d="M504.6 148.5C515.9 134.9 514.1 114.7 500.5 103.4C486.9 92.1 466.7 93.9 455.4 107.5L320 270L184.6 107.5C173.3 93.9 153.1 92.1 139.5 103.4C125.9 114.7 124.1 134.9 135.4 148.5L278.3 320L135.4 491.5C124.1 505.1 125.9 525.3 139.5 536.6C153.1 547.9 173.3 546.1 184.6 532.5L320 370L455.4 532.5C466.7 546.1 486.9 547.9 500.5 536.6C514.1 525.3 515.9 505.1 504.6 491.5L361.7 320L504.6 148.5z"/>
        </svg>
      </button>

      <!-- Header -->
      <div class="mb-6 pr-8 flex-shrink-0">
        <h1 class="text-2xl font-black" :style="{ color: themeText }">{{ $t('settings.title') }}</h1>
      </div>

      <!-- Settings Content -->
      <div class="space-y-6 overflow-y-auto flex-1 min-h-0">
        <div>
          <h3 class="mt-4" :style="{ color: themeText }">{{ $t('settings.languages.title') }}</h3>
          <p class="text-sm leading-5" :style="{ color: hintTextColor }">{{ $t('settings.languages.hint') }}</p>
          <language-dropdown />
        </div>

        <div>
          <h3 class="mt-4" :style="{ color: themeText }">{{ $t('settings.designMode.title') }}</h3>
          <p class="text-sm" :style="{ color: hintTextColor }">{{ $t('settings.designMode.hint') }}</p>
          <theme-switcher />
          
          <!-- Custom Theme File Selector - Only show when Custom theme is selected -->
          <div v-if="currentTheme === 'caelestia'" class="mt-4 pt-4" :style="{ borderTopColor: buttonBorderColor }" style="border-top: 1px solid;">
            <h5 class="text-xs font-medium mb-2" :style="{ color: themeText }">Custom Theme File</h5>
            <p class="text-xs mb-3" :style="{ color: hintTextColor }">
              Select a btop theme file (.theme) to use for the Custom theme. The app will read colors from this file and update in real-time when the file changes. The file format should be: <code class="text-xs px-1 rounded" :style="{ backgroundColor: buttonBg }">theme[key]=#color</code>
            </p>
            <div class="space-y-2">
              <div v-if="customThemePath" class="px-3 py-2 rounded-md" :style="{ backgroundColor: buttonBg }">
                <p class="text-xs mb-1" :style="{ color: hintTextColor }">Current file:</p>
                <p class="text-xs font-mono break-all" :style="{ color: themeText }">{{ customThemePath }}</p>
              </div>
              <button
                class="rounded-lg flex justify-center items-center align-center cursor-pointer w-full h-12 transition-colors border-2"
                :style="{ 
                  backgroundColor: customThemeButtonHover ? buttonHoverBg : buttonBg,
                  color: buttonText,
                  borderColor: buttonBorderColor
                }"
                @mouseenter="customThemeButtonHover = true"
                @mouseleave="customThemeButtonHover = false"
                @click="handleSelectCustomThemeFile"
              >
                {{ customThemePath ? 'Change Theme File' : 'Select Theme File' }}
              </button>
            </div>
          </div>
        </div>

        <div>
          <h3 class="mt-4" :style="{ color: themeText }">{{ $t('settings.data.title') }}</h3>
          <p class="text-sm" :style="{ color: hintTextColor }">
            {{ $t('settings.data.hint')}} 
            <span class="font-bold" :style="{ color: themeText }">{{ getDataPath }}</span>
          </p>
          <button 
            class="rounded-lg flex justify-center items-center align-center cursor-pointer w-full h-12 mt-4 transition-colors border-2"
            :style="{ 
              backgroundColor: buttonHover ? buttonHoverBg : buttonBg,
              color: buttonText,
              borderColor: buttonBorderColor
            }"
            @mouseenter="buttonHover = true"
            @mouseleave="buttonHover = false"
            @click='setDataPath'
          >
            {{ $t('settings.data.choose') }}
          </button>
        </div>

        <div class="text-center text-xs pb-4" :style="{ color: versionTextColor }">
          v{{ version }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { version } from '../../package.json'
import LanguageDropdown from '@/components/language-dropdown'
import ThemeSwitcher from '@/components/theme-switcher'
import { mapActions, mapGetters } from 'vuex'
import { Actions as AppActions, Getters as AppGetters } from '@/store/modules/app/types'
import { getCustomThemePath, setCustomThemePath } from '@/store/modules/app/helper'

export default {
  components: {
    ThemeSwitcher,
    LanguageDropdown
  },
  props: {
    isOpen: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      version,
      closeButtonHover: false,
      buttonHover: false,
      customThemeButtonHover: false,
      customThemePath: null
    }
  },
  computed: {
    ...mapGetters('app', [
      AppGetters.GET_DATA_PATH,
      AppGetters.GET_THEME_COLORS,
      AppGetters.GET_THEME
    ]),
    currentTheme() {
      return this.getTheme
    },
    accentColor() {
      const colors = this.getThemeColors
      if (!colors) return '#FF005C'
      return this.getTheme === 'dark' ? colors.accentDark : colors.accent
    },
    themeText() {
      const theme = this.getTheme
      if (theme === 'caelestia') {
        const colors = this.getThemeColors
        return colors?.text || '#e0e4da'
      }
      return theme === 'dark' ? '#ffffff' : '#000000'
    },
    modalBg() {
      const theme = this.getTheme
      if (theme === 'caelestia') {
        const colors = this.getThemeColors
        return colors?.selectedBg || colors?.background || '#1d211b'
      }
      return theme === 'dark' ? '#111827' : '#f9fafb'
    },
    backdropColor() {
      const theme = this.getTheme
      if (theme === 'caelestia') {
        const colors = this.getThemeColors
        const bg = colors?.background || '#11140f'
        const r = parseInt(bg.slice(1, 3), 16)
        const g = parseInt(bg.slice(3, 5), 16)
        const b = parseInt(bg.slice(5, 7), 16)
        return `rgba(${r}, ${g}, ${b}, 0.5)`
      }
      return theme === 'dark' ? 'rgba(0, 0, 0, 0.5)' : 'rgba(0, 0, 0, 0.5)'
    },
    hintTextColor() {
      const theme = this.getTheme
      if (theme === 'caelestia') {
        const colors = this.getThemeColors
        // Use a slightly dimmed version of text color for hints
        if (colors?.text) {
          const textColor = colors.text
          const r = parseInt(textColor.slice(1, 3), 16)
          const g = parseInt(textColor.slice(3, 5), 16)
          const b = parseInt(textColor.slice(5, 7), 16)
          return `rgba(${r}, ${g}, ${b}, 0.6)`
        }
        return '#8c9387'
      }
      return theme === 'dark' ? '#9ca3af' : '#6b7280'
    },
    versionTextColor() {
      return this.hintTextColor
    },
    closeButtonHoverBg() {
      const theme = this.getTheme
      if (theme === 'caelestia') {
        const colors = this.getThemeColors
        return colors?.selectedBg ? this._lightenColor(colors.selectedBg, 0.1) : '#2a3325'
      }
      return theme === 'dark' ? '#374151' : '#e5e7eb'
    },
    buttonBg() {
      const theme = this.getTheme
      if (theme === 'caelestia') {
        const colors = this.getThemeColors
        return colors?.selectedBg || colors?.background || '#1d211b'
      }
      return theme === 'dark' ? '#1f2937' : '#f3f4f6'
    },
    buttonHoverBg() {
      const theme = this.getTheme
      if (theme === 'caelestia') {
        const colors = this.getThemeColors
        const baseBg = colors?.selectedBg || colors?.background || '#1d211b'
        return this._lightenColor(baseBg, 0.1)
      }
      return theme === 'dark' ? '#374151' : '#e5e7eb'
    },
    buttonText() {
      return this.themeText
    },
    buttonBorderColor() {
      const theme = this.getTheme
      if (theme === 'caelestia') {
        const colors = this.getThemeColors
        return colors?.text ? this._adjustOpacity(colors.text, 0.15) : '#4a5568'
      }
      return theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
    }
  },
  methods: {
    ...mapActions('app', [AppActions.SET_DATA_PATH]),
    async handleSelectCustomThemeFile() {
      try {
        const newPath = await setCustomThemePath()
        if (newPath) {
          this.customThemePath = newPath
        }
      } catch (error) {
        console.error('Error selecting custom theme file:', error)
      }
    },
    closeModal() {
      this.$emit('close')
    },
    _handleEscapeKey(event) {
      if (event.key === 'Escape' && this.isOpen) {
        this.closeModal()
      }
    },
    _lightenColor(hex, amount) {
      // Lighten a hex color by a percentage (0-1)
      const r = parseInt(hex.slice(1, 3), 16)
      const g = parseInt(hex.slice(3, 5), 16)
      const b = parseInt(hex.slice(5, 7), 16)
      const newR = Math.min(255, Math.floor(r + (255 - r) * amount))
      const newG = Math.min(255, Math.floor(g + (255 - g) * amount))
      const newB = Math.min(255, Math.floor(b + (255 - b) * amount))
      return `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`
    },
    _adjustOpacity(hex, opacity) {
      const r = parseInt(hex.slice(1, 3), 16)
      const g = parseInt(hex.slice(3, 5), 16)
      const b = parseInt(hex.slice(5, 7), 16)
      return `rgba(${r}, ${g}, ${b}, ${opacity})`
    }
  },
  async mounted() {
    document.addEventListener('keyup', this._handleEscapeKey, true)
    // Load custom theme path if custom theme is active
    if (this.currentTheme === 'caelestia') {
      try {
        this.customThemePath = await getCustomThemePath()
      } catch (error) {
        console.error('Error loading custom theme path:', error)
      }
    }
  },
  watch: {
    currentTheme(newTheme) {
      // Load custom theme path when switching to custom theme
      if (newTheme === 'caelestia') {
        getCustomThemePath().then(path => {
          this.customThemePath = path
        }).catch(error => {
          console.error('Error loading custom theme path:', error)
        })
      }
    }
  },
  beforeDestroy() {
    document.removeEventListener('keyup', this._handleEscapeKey, true)
  }
}
</script>

