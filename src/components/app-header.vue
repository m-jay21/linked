<template>
  <!-- Header Start -->
  <header
    class="
      sticky
      top-0
      select-none
      z-50
    "
    :style="{
      backgroundColor: themeBg,
      color: themeText
    }"
  >
    <week-switcher />
    <day-switcher />
  </header>
</template>

<script>
import DaySwitcher from '@/components/day-switcher'
import WeekSwitcher from '@/components/week-switcher'
import { mapGetters } from 'vuex'
import { Getters as AppGetters } from '@/store/modules/app/types'

export default {
  components: { DaySwitcher, WeekSwitcher },
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