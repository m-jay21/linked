<template>
  <div class="relative">
    <div class="relative">
      <!-- Hidden span to measure text width -->
      <span
        ref="measureSpan"
        class="absolute invisible whitespace-nowrap text-sm"
        :style="{
          fontFamily: currentFont,
          fontSize: '0.875rem',
          paddingLeft: '1.5rem',
          paddingRight: '0.5rem'
        }"
      >{{ displayValue || currentFontName }}</span>
      <input
        ref="input"
        type="text"
        :value="displayValue"
        class="
          pl-6
          pr-2
          py-2
          rounded
          text-sm
          cursor-text
          focus:outline-none
        "
        :style="{
          fontFamily: currentFont,
          backgroundColor: inputBg,
          color: inputText,
          borderColor: inputBorder,
          borderWidth: '1px',
          borderStyle: 'solid',
          width: inputWidth,
          minWidth: '7rem',
          maxWidth: '12rem'
        }"
        @focus="_handleFocus"
        @focusin="_handleFocusIn"
        @focusout="_handleFocusOut"
        @input="_handleInput"
        @keydown.enter.prevent="_handleEnter"
        @keydown.escape="_handleEscape"
        @blur="_handleBlur"
        :title="currentFontName"
      />
      <svg
        class="absolute left-1.5 top-1/2 transform -translate-y-1/2 h-3 w-3 pointer-events-none"
        :style="{ color: iconColor }"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
    </div>
    <ul
      class="
        absolute
        z-50
        right-0
        mt-1
        w-48
        shadow-lg
        max-h-60
        rounded-md
        py-1
        text-base
        overflow-auto
        focus:outline-none
        sm:text-sm
      "
      :style="{
        backgroundColor: dropdownBg,
        color: dropdownText,
        borderWidth: '1px',
        borderStyle: 'solid',
        borderColor: inputBorder
      }"
      tabindex="-1"
      role="listbox"
      v-if="open"
    >
      <!-- System Fonts Section -->
      <template v-if="groupedFilteredFonts.system.length > 0">
        <li 
          class="px-3 py-1 text-xs font-semibold sticky top-0" 
          :style="{ 
            backgroundColor: dropdownBg,
            color: iconColor 
          }"
        >
          System Fonts
        </li>
        <template v-for="(font, index) in groupedFilteredFonts.system">
          <li
            class="cursor-default select-none relative py-2 pl-8 pr-4"
            :id="`listbox-option-system-${index}`"
            role="option"
            :key="`system-${index}`"
            @click="_handleFontChange(font.value, font.name, font.googleName)"
            @mouseenter="_handleMouseEnter"
            @mouseleave="_handleMouseLeave"
            :style="{
              fontFamily: font.value,
              backgroundColor: currentFont === font.value ? hoverBg : 'transparent'
            }"
            :data-font-value="font.value"
          >
            <span class="font-normal block truncate">{{ font.name }}</span>
            <span
              class="absolute inset-y-0 left-0 flex items-center pl-1.5"
              :style="{ color: accentColor }"
              v-if="currentFont === font.value"
            >
              <TickIcon />
            </span>
          </li>
        </template>
      </template>
      
      <!-- Google Fonts Section -->
      <template v-if="groupedFilteredFonts.google.length > 0">
        <li 
          class="px-3 py-1 text-xs font-semibold sticky top-0 mt-1" 
          :style="{ 
            backgroundColor: dropdownBg,
            color: iconColor 
          }"
        >
          Google Fonts
        </li>
        <template v-for="(font, index) in groupedFilteredFonts.google">
          <li
            class="cursor-default select-none relative py-2 pl-8 pr-4"
            :id="`listbox-option-google-${index}`"
            role="option"
            :key="`google-${index}`"
            @click="_handleFontChange(font.value, font.name, font.googleName)"
            @mouseenter="_handleMouseEnter"
            @mouseleave="_handleMouseLeave"
            :style="{
              fontFamily: font.value,
              backgroundColor: currentFont === font.value ? hoverBg : 'transparent'
            }"
            :data-font-value="font.value"
          >
            <span class="font-normal block truncate">{{ font.name }}</span>
            <span
              class="absolute inset-y-0 left-0 flex items-center pl-1.5"
              :style="{ color: accentColor }"
              v-if="currentFont === font.value"
            >
              <TickIcon />
            </span>
          </li>
        </template>
      </template>
    </ul>
  </div>
</template>

<script>
import TickIcon from '@/assets/icons/tick.svg'
import { getFontFamily, setFontFamily } from '@/store/modules/app/helper'
import { mapGetters } from 'vuex'
import { Getters as AppGetters } from '@/store/modules/app/types'

export default {
  data() {
    return {
      open: false,
      isFocused: false,
      searchQuery: '',
      currentFont: 'system-ui, -apple-system, sans-serif',
      currentFontName: 'System',
      inputWidth: '7rem',
      systemFonts: [
        { name: 'System', value: 'system-ui, -apple-system, sans-serif' },
        { name: 'Georgia', value: 'Georgia, serif' },
        { name: 'Times New Roman', value: 'Times New Roman, serif' },
        { name: 'Courier New', value: 'Courier New, monospace' },
        { name: 'Monaco', value: 'Monaco, monospace' },
        { name: 'Consolas', value: 'Consolas, monospace' }
      ],
      googleFonts: [
        { name: 'Inter', value: 'Inter, system-ui, sans-serif', googleName: 'Inter' },
        { name: 'Roboto', value: 'Roboto, sans-serif', googleName: 'Roboto' },
        { name: 'Open Sans', value: 'Open Sans, sans-serif', googleName: 'Open+Sans' },
        { name: 'Lato', value: 'Lato, sans-serif', googleName: 'Lato' },
        { name: 'Montserrat', value: 'Montserrat, sans-serif', googleName: 'Montserrat' },
        { name: 'Source Sans Pro', value: 'Source Sans Pro, sans-serif', googleName: 'Source+Sans+Pro' },
        { name: 'Raleway', value: 'Raleway, sans-serif', googleName: 'Raleway' },
        { name: 'Poppins', value: 'Poppins, sans-serif', googleName: 'Poppins' },
        { name: 'Nunito', value: 'Nunito, sans-serif', googleName: 'Nunito' },
        { name: 'Merriweather', value: 'Merriweather, serif', googleName: 'Merriweather' },
        { name: 'Lora', value: 'Lora, serif', googleName: 'Lora' },
        { name: 'Playfair Display', value: 'Playfair Display, serif', googleName: 'Playfair+Display' }
      ]
    }
  },
  computed: {
    ...mapGetters('app', [AppGetters.GET_THEME, AppGetters.GET_THEME_COLORS]),
    displayValue() {
      if (this.isFocused || this.searchQuery) {
        return this.searchQuery
      }
      return this.currentFontName
    },
    allFonts() {
      return [
        ...this.systemFonts.map(f => ({ ...f, category: 'system' })),
        ...this.googleFonts.map(f => ({ ...f, category: 'google' }))
      ]
    },
    filteredFonts() {
      if (!this.searchQuery.trim()) {
        return this.allFonts
      }
      const query = this.searchQuery.toLowerCase().trim()
      return this.allFonts.filter(font => 
        font.name.toLowerCase().includes(query)
      )
    },
    groupedFilteredFonts() {
      const filtered = this.filteredFonts
      const system = filtered.filter(f => f.category === 'system')
      const google = filtered.filter(f => f.category === 'google')
      return { system, google }
    },
    inputBg() {
      const theme = this.getTheme
      if (theme === 'caelestia') {
        const colors = this.getThemeColors
        return colors?.selectedBg || '#1d211b'
      }
      return theme === 'dark' ? '#1f1f1f' : '#f3f4f6'
    },
    inputText() {
      const theme = this.getTheme
      if (theme === 'caelestia') {
        const colors = this.getThemeColors
        return colors?.text || '#e0e4da'
      }
      return theme === 'dark' ? '#ffffff' : '#000000'
    },
    inputBorder() {
      const theme = this.getTheme
      if (theme === 'caelestia') {
        const colors = this.getThemeColors
        return colors?.text ? this._adjustOpacity(colors.text, 0.15) : '#4a5568'
      }
      return theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
    },
    dropdownBg() {
      const theme = this.getTheme
      if (theme === 'caelestia') {
        const colors = this.getThemeColors
        return colors?.selectedBg || '#1d211b'
      }
      return theme === 'dark' ? '#1f1f1f' : '#ffffff'
    },
    dropdownText() {
      const theme = this.getTheme
      if (theme === 'caelestia') {
        const colors = this.getThemeColors
        return colors?.text || '#e0e4da'
      }
      return theme === 'dark' ? '#ffffff' : '#000000'
    },
    hoverBg() {
      const theme = this.getTheme
      if (theme === 'caelestia') {
        const colors = this.getThemeColors
        return colors?.selectedBg ? this._lightenColor(colors.selectedBg, 0.1) : '#2a3325'
      }
      return theme === 'dark' ? '#374151' : '#e5e7eb'
    },
    iconColor() {
      const theme = this.getTheme
      if (theme === 'caelestia') {
        const colors = this.getThemeColors
        return colors?.text ? this._adjustOpacity(colors.text, 0.6) : '#9ca3af'
      }
      return theme === 'dark' ? '#9ca3af' : '#6b7280'
    },
    accentColor() {
      const colors = this.getThemeColors
      if (!colors) return '#FF005C'
      const theme = this.getTheme
      return (theme === 'dark' || theme === 'caelestia') ? colors.accentDark : colors.accent
    }
  },
  watch: {
    displayValue() {
      this.$nextTick(() => {
        this._updateInputWidth()
      })
    },
    currentFont() {
      this.$nextTick(() => {
        this._updateInputWidth()
      })
    }
  },
  methods: {
    _loadGoogleFont(googleName) {
      // Check if font is already loaded
      const linkId = `google-font-${googleName.replace(/\s+/g, '-').toLowerCase()}`
      if (document.getElementById(linkId)) {
        return // Already loaded
      }
      
      // Create link element to load Google Font
      const link = document.createElement('link')
      link.id = linkId
      link.rel = 'stylesheet'
      link.href = `https://fonts.googleapis.com/css2?family=${googleName}:wght@400;500;600;700&display=swap`
      document.head.appendChild(link)
    },
    async _handleFontChange(fontValue, fontName, googleName) {
      if (this.currentFont === fontValue) return

      // Load Google Font if it's a Google font
      if (googleName) {
        this._loadGoogleFont(googleName)
      }

      this.currentFont = fontValue
      this.currentFontName = fontName
      this.searchQuery = ''
      this.open = false
      this.isFocused = false
      await setFontFamily(fontValue)
      document.documentElement.style.setProperty('--font-family', fontValue)
      this.$el.querySelector('input').blur()
    },
    async _loadCurrentFont() {
      const font = await getFontFamily()
      if (font) {
        this.currentFont = font
        // Find matching font name in both arrays
        const fontObj = this.allFonts.find(f => f.value === font)
        this.currentFontName = fontObj ? fontObj.name : 'System'
        
        // Load Google Font if it's a Google font
        if (fontObj && fontObj.googleName) {
          this._loadGoogleFont(fontObj.googleName)
        }
        
        this.$nextTick(() => {
          this._updateInputWidth()
        })
      }
    },
    _handleFocus() {
      this.isFocused = true
      this.open = true
      this.searchQuery = ''
      // Clear input on focus so user can start typing
      this.$nextTick(() => {
        const input = this.$el.querySelector('input')
        if (input) {
          input.value = ''
        }
      })
    },
    _handleInput(event) {
      this.searchQuery = event.target.value
      this.open = true
      this.$nextTick(() => {
        this._updateInputWidth()
      })
    },
    _handleBlur() {
      // Delay to allow click events on dropdown items
      setTimeout(() => {
        if (!this.$el.contains(document.activeElement)) {
          this.isFocused = false
          this.open = false
          this.searchQuery = ''
        }
      }, 200)
    },
    _handleEnter() {
      if (this.filteredFonts.length > 0) {
        const firstMatch = this.filteredFonts[0]
        this._handleFontChange(firstMatch.value, firstMatch.name, firstMatch.googleName)
      }
    },
    _handleEscape() {
      this.open = false
      this.searchQuery = ''
      this.isFocused = false
      this.$el.querySelector('input').blur()
    },
    _handleClickOutside(event) {
      if (!this.$el.contains(event.target)) {
        this.open = false
        this.searchQuery = ''
        this.isFocused = false
      }
    },
    _handleFocusIn(event) {
      event.target.style.borderColor = this.accentColor
      event.target.style.boxShadow = `0 0 0 2px ${this.accentColor}40`
    },
    _handleFocusOut(event) {
      event.target.style.borderColor = this.inputBorder
      event.target.style.boxShadow = 'none'
    },
    _handleMouseEnter(event) {
      const fontValue = event.currentTarget.dataset.fontValue
      if (fontValue !== this.currentFont) {
        event.currentTarget.style.backgroundColor = this.hoverBg
      }
    },
    _handleMouseLeave(event) {
      const fontValue = event.currentTarget.dataset.fontValue
      if (fontValue !== this.currentFont) {
        event.currentTarget.style.backgroundColor = 'transparent'
      }
    },
    _adjustOpacity(color, opacity) {
      // Convert hex to rgba
      if (color.startsWith('#')) {
        const r = parseInt(color.slice(1, 3), 16)
        const g = parseInt(color.slice(3, 5), 16)
        const b = parseInt(color.slice(5, 7), 16)
        return `rgba(${r}, ${g}, ${b}, ${opacity})`
      }
      return color
    },
    _lightenColor(color, amount) {
      // Lighten a hex color by a percentage
      if (color.startsWith('#')) {
        const r = parseInt(color.slice(1, 3), 16)
        const g = parseInt(color.slice(3, 5), 16)
        const b = parseInt(color.slice(5, 7), 16)
        const newR = Math.min(255, Math.floor(r + (255 - r) * amount))
        const newG = Math.min(255, Math.floor(g + (255 - g) * amount))
        const newB = Math.min(255, Math.floor(b + (255 - b) * amount))
        return `rgb(${newR}, ${newG}, ${newB})`
      }
      return color
    },
    _updateInputWidth() {
      if (this.$refs.measureSpan) {
        const width = this.$refs.measureSpan.offsetWidth
        // Add some padding and ensure min/max constraints
        const minWidth = 112 // 7rem = 112px
        const maxWidth = 192 // 12rem = 192px
        const padding = 32 // Extra padding for icon and spacing
        const calculatedWidth = Math.max(minWidth, Math.min(maxWidth, width + padding))
        this.inputWidth = `${calculatedWidth}px`
      }
    }
  },
  components: {
    TickIcon
  },
  mounted() {
    this._loadCurrentFont()
    document.addEventListener('click', this._handleClickOutside)
    this.$nextTick(() => {
      this._updateInputWidth()
    })
  },
  beforeDestroy() {
    document.removeEventListener('click', this._handleClickOutside)
  }
}
</script>



