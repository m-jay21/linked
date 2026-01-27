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
      class="rounded-lg shadow-xl w-[600px] max-w-[90vw] max-h-[90vh] p-6 border-2 border-accent dark:border-accent-dark overflow-y-auto relative"
      :style="{
        backgroundColor: modalBg,
        color: themeText
      }"
      @click.stop
    >
      <!-- Close button in top-right corner -->
      <button
        class="absolute top-4 right-4 cursor-pointer p-1.5 hover:bg-gray-200 dark:hover:bg-gray-800 rounded transition-colors z-10"
        :style="{ color: themeText }"
        @click="closeModal"
        title="Close"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" width="20" height="20" fill="currentColor">
          <path d="M504.6 148.5C515.9 134.9 514.1 114.7 500.5 103.4C486.9 92.1 466.7 93.9 455.4 107.5L320 270L184.6 107.5C173.3 93.9 153.1 92.1 139.5 103.4C125.9 114.7 124.1 134.9 135.4 148.5L278.3 320L135.4 491.5C124.1 505.1 125.9 525.3 139.5 536.6C153.1 547.9 173.3 546.1 184.6 532.5L320 370L455.4 532.5C466.7 546.1 486.9 547.9 500.5 536.6C514.1 525.3 515.9 505.1 504.6 491.5L361.7 320L504.6 148.5z"/>
        </svg>
      </button>

      <!-- Header -->
      <div class="mb-6 pr-8">
        <h1 class="text-2xl font-black" :style="{ color: themeText }">{{ $t('settings.title') }}</h1>
      </div>

      <!-- Settings Content -->
      <div class="space-y-6">
        <div>
          <h3 class="mt-4">{{ $t('settings.languages.title') }}</h3>
          <p class="text-sm leading-5 text-gray-500 dark:text-gray-400">{{ $t('settings.languages.hint') }}</p>
          <language-dropdown />
        </div>

        <div>
          <h3 class="mt-4">{{ $t('settings.designMode.title') }}</h3>
          <p class="text-sm text-gray-500 dark:text-gray-400">{{ $t('settings.designMode.hint') }}</p>
          <theme-switcher />
        </div>

        <div>
          <h3 class="mt-4">{{ $t('settings.data.title') }}</h3>
          <p class="text-sm text-gray-500 dark:text-gray-400">
            {{ $t('settings.data.hint')}} 
            <span class="font-bold">{{ getDataPath }}</span>
          </p>
          <button class="
            bg-gray-100
            hover:bg-gray-200
            dark:bg-gray-800
            dark:hover:bg-gray-700
            rounded-lg
            flex
            justify-center
            items-center
            align-center
            text-gray-900
            dark:text-gray-200
            cursor-pointer
            w-full
            h-12
            mt-4
          "
          @click='setDataPath'
          >
            {{ $t('settings.data.choose') }}
          </button>
        </div>

        <div>
          <h3 class="mt-4">{{ $t('settings.updates.title') }}</h3>
          <p class="text-sm text-gray-500 dark:text-gray-400">{{ $t('settings.updates.hint') }}</p>
          <update-dropdown />
        </div>

        <div>
          <h3 class="mt-4">{{ $t('settings.search.index.title') }}</h3>
          <p class="text-sm text-gray-500 dark:text-gray-400">{{ $t('settings.search.index.hint') }}</p>
          <button class="
            bg-gray-100
            hover:bg-gray-200
            dark:bg-gray-800
            dark:hover:bg-gray-700
            rounded-lg
            flex
            justify-center
            items-center
            align-center
            text-gray-900
            dark:text-gray-200
            cursor-pointer
            w-full
            h-12
            mt-4
          "
          @click='reIndexAll'
          >
            {{ $t('settings.search.index.start') }}
          </button>
        </div>

        <div>
          <allow-prerelease />
        </div>

        <div class="text-center text-xs text-gray-500 dark:text-gray-400 pb-4">
          v{{ version }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { version } from '../../package.json'
import LanguageDropdown from '@/components/language-dropdown'
import UpdateDropdown from '@/components/update-dropdown'
import ThemeSwitcher from '@/components/theme-switcher'
import { reIndexAll } from '@/store/modules/app/helper'
import { mapActions, mapGetters } from 'vuex'
import { Actions as AppActions, Getters as AppGetters } from '@/store/modules/app/types'
import AllowPrerelease from '@/components/settings/allow-prerelease'

export default {
  components: {
    AllowPrerelease,
    ThemeSwitcher,
    LanguageDropdown,
    UpdateDropdown
  },
  props: {
    isOpen: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      version
    }
  },
  computed: {
    ...mapGetters('app', [
      AppGetters.GET_DATA_PATH,
      AppGetters.GET_THEME_COLORS,
      AppGetters.GET_THEME
    ]),
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
    }
  },
  methods: {
    reIndexAll,
    ...mapActions('app', [AppActions.SET_DATA_PATH]),
    closeModal() {
      this.$emit('close')
    },
    _handleEscapeKey(event) {
      if (event.key === 'Escape' && this.isOpen) {
        this.closeModal()
      }
    }
  },
  mounted() {
    document.addEventListener('keyup', this._handleEscapeKey, true)
  },
  beforeDestroy() {
    document.removeEventListener('keyup', this._handleEscapeKey, true)
  }
}
</script>

