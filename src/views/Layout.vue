<template>
  <div 
    class="flex flex-col min-h-screen"
    :style="{
      backgroundColor: themeBg,
      color: themeText
    }"
  >
    <div class="w-full h-full min-h-screen">
      <slot />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { Getters as AppGetters } from '@/store/modules/app/types'

export default {
  computed: {
    ...mapGetters('app', [AppGetters.GET_THEME, AppGetters.GET_THEME_COLORS]),
    themeBg() {
      const theme = this.getTheme
      if (theme === 'caelestia') {
        const colors = this.getThemeColors
        return colors?.background || '#11140f'
      }
      return theme === 'dark' ? '#000000' : '#ffffff'
    },
    themeText() {
      const theme = this.getTheme
      if (theme === 'caelestia') {
        const colors = this.getThemeColors
        return colors?.text || '#e0e4da'
      }
      return theme === 'dark' ? '#ffffff' : '#000000'
    }
  }
}
</script>
