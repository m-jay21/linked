<template>
  <div>
    <div class="mt-4 relative">
      <button
        type="button"
        class="
          relative
          w-full
          bg-gray-100
          dark:bg-gray-800
          rounded-md
          pl-3
          pr-10
          py-2
          text-left
          cursor-default
          focus:outline-none
          focus:ring-2 focus:ring-accent
          focus:border-accent
          sm:text-sm
          cursor-pointer
        "
        aria-haspopup="listbox"
        aria-expanded="true"
        aria-labelledby="listbox-label"
        @click="open = !open"
        :style="{ fontFamily: currentFont }"
      >
        <span class="block truncate">{{ currentFontName }}</span>
        <span
          class="
            absolute
            inset-y-0
            right-0
            flex
            items-center
            pr-2
            pointer-events-none
          "
        >
          <DropdownIcon />
        </span>
      </button>
      <ul
        class="
          absolute
          z-10
          mt-1
          w-full
          bg-gray-100
          dark:bg-gray-800
          shadow-lg
          max-h-60
          rounded-md
          py-1
          text-base
          ring-1 ring-black ring-opacity-5
          overflow-auto
          focus:outline-none
          sm:text-sm
        "
        style="
          margin-left: 0 !important;
          margin-right: 0 !important;
          margin-top: 0.25rem !important;
        "
        tabindex="-1"
        role="listbox"
        aria-labelledby="listbox-label"
        v-if="open"
      >
        <template v-for="(font, index) in fonts">
          <li
            class="cursor-default select-none relative py-2 pl-8 pr-4"
            :id="`listbox-option-${index}`"
            role="option"
            :key="index"
            @click="_handleFontChange(font.value, font.name)"
            :style="{ fontFamily: font.value }"
          >
            <span class="font-normal block truncate">{{ font.name }}</span>
            <span
              class="
                text-accent
                absolute
                inset-y-0
                left-0
                flex
                items-center
                pl-1.5
              "
              v-if="currentFont === font.value"
            >
              <TickIcon />
            </span>
          </li>
        </template>
      </ul>
    </div>
  </div>
</template>

<script>
import TickIcon from '@/assets/icons/tick.svg'
import DropdownIcon from '@/assets/icons/dropdown.svg'
import { getFontFamily, setFontFamily } from '@/store/modules/app/helper'

export default {
  data() {
    return {
      open: false,
      currentFont: 'system-ui, -apple-system, sans-serif',
      currentFontName: 'System',
      fonts: [
        { name: 'System', value: 'system-ui, -apple-system, sans-serif' },
        { name: 'Inter', value: 'Inter, system-ui, sans-serif' },
        { name: 'Roboto', value: 'Roboto, sans-serif' },
        { name: 'Open Sans', value: 'Open Sans, sans-serif' },
        { name: 'Lato', value: 'Lato, sans-serif' },
        { name: 'Montserrat', value: 'Montserrat, sans-serif' },
        { name: 'Source Sans Pro', value: 'Source Sans Pro, sans-serif' },
        { name: 'Raleway', value: 'Raleway, sans-serif' },
        { name: 'Poppins', value: 'Poppins, sans-serif' },
        { name: 'Nunito', value: 'Nunito, sans-serif' },
        { name: 'Merriweather', value: 'Merriweather, serif' },
        { name: 'Lora', value: 'Lora, serif' },
        { name: 'Playfair Display', value: 'Playfair Display, serif' },
        { name: 'Georgia', value: 'Georgia, serif' },
        { name: 'Times New Roman', value: 'Times New Roman, serif' },
        { name: 'Courier New', value: 'Courier New, monospace' },
        { name: 'Monaco', value: 'Monaco, monospace' },
        { name: 'Consolas', value: 'Consolas, monospace' }
      ]
    }
  },
  methods: {
    async _handleFontChange(fontValue, fontName) {
      if (this.currentFont === fontValue) return

      this.currentFont = fontValue
      this.currentFontName = fontName
      this.open = false
      await setFontFamily(fontValue)
      document.documentElement.style.setProperty('--font-family', fontValue)
    },
    async _loadCurrentFont() {
      const font = await getFontFamily()
      if (font) {
        this.currentFont = font
        // Find matching font name
        const fontObj = this.fonts.find(f => f.value === font)
        this.currentFontName = fontObj ? fontObj.name : 'System'
      }
    }
  },
  components: {
    TickIcon,
    DropdownIcon
  },
  mounted() {
    this._loadCurrentFont()
  }
}
</script>

